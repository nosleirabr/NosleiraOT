<?php
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Donate';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
$payment_method = isset($_POST['payment_method']) ? $_POST['payment_method'] : (isset($_GET['payment_method']) ? $_GET['payment_method'] : 'pix');
$points_package = isset($_POST['points_package']) ? $_POST['points_package'] : '25';
$tibia_char_name = isset($_POST['tibia_char_name']) ? trim($_POST['tibia_char_name']) : '';

// Função auxiliar para calcular o valor cobrado em R$ (PIX recebe 5% de desconto automático)
if (!function_exists('get_nosleira_price')) {
    function get_nosleira_price($method, $package_coins) {
        $coins = (int)$package_coins;
        if ($method === 'pix') {
            return round($coins * 0.95, 2);
        }
        return (float)$coins;
    }
}

// Capturar conta logada (MyAAC)
$acc_id = 0;
$acc_name = '';
if (isset($logged) && $logged && isset($account_logged) && $account_logged) {
    $acc_id = (int)$account_logged->getId();
    $acc_name = $account_logged->getName();
}

// Intenção: Garantir que as tabelas e colunas de auditoria financeira existam no banco
if (function_exists('ensure_donation_audit_tables')) {
    ensure_donation_audit_tables();
}

// Mapeamento de pacotes Tibia Coins (em múltiplos exatos de 25 com taxa inclusa)
// 250 TC  ➔ 50 NosleiraCoins
// 500 TC  ➔ 100 NosleiraCoins
// 1.000 TC ➔ 200 NosleiraCoins
// 2.500 TC ➔ 500 NosleiraCoins
$tc_products = array(
    '50'   => array('product' => '50 NosleiraCoins',   'price' => '250 TC'),
    '100'  => array('product' => '100 NosleiraCoins',  'price' => '500 TC'),
    '200'  => array('product' => '200 NosleiraCoins',  'price' => '1.000 TC'),
    '500'  => array('product' => '500 NosleiraCoins',  'price' => '2.500 TC'),
    // Compatibilidade com seleções legadas
    '52'   => array('product' => '50 NosleiraCoins',   'price' => '250 TC'),
    '105'  => array('product' => '100 NosleiraCoins',  'price' => '500 TC'),
    '209'  => array('product' => '200 NosleiraCoins',  'price' => '1.000 TC'),
    '525'  => array('product' => '500 NosleiraCoins',  'price' => '2.500 TC'),
    '55'   => array('product' => '50 NosleiraCoins',   'price' => '250 TC'),
    '110'  => array('product' => '100 NosleiraCoins',  'price' => '500 TC'),
    '220'  => array('product' => '200 NosleiraCoins',  'price' => '1.000 TC'),
    '550'  => array('product' => '500 NosleiraCoins',  'price' => '2.500 TC')
);

// Fallback de retrocompatibilidade para requisições de Tibia Coins
if ($payment_method === 'tibia_coins') {
    if ($points_package == '55' || $points_package == '52' || $points_package == '25') $points_package = '50';
    if ($points_package == '110' || $points_package == '105') $points_package = '100';
    if ($points_package == '220' || $points_package == '209') $points_package = '200';
    if ($points_package == '550' || $points_package == '525') $points_package = '500';
}

if (isset($tc_products[$points_package])) {
    $product_label = $tc_products[$points_package]['product'];
    $price_label   = $tc_products[$points_package]['price'];
} else {
    $product_label = $points_package . ' NosleiraCoins';
    $price_label   = $points_package . ' TC';
}

// ENDPOINT AJAX DE VERIFICAÇÃO DE STATUS DO PEDIDO
if ($action === 'check_payment_status' && isset($_GET['order_id'])) {
    header('Content-Type: application/json');
    $check_id = (int)$_GET['order_id'];
    $don = $db->query("SELECT `status` FROM `myaac_donations` WHERE `id` = " . $check_id)->fetch();
    echo json_encode(array('status' => $don ? $don['status'] : 'pending'));
    exit;
}

$order_id = 0;
$mp_qr_code = '';
$mp_qr_code_base64 = '';
$mp_payment_id = 0;
$mp_error_msg = '';
$card_payment_result = null;
$card_error_msg = '';

// PROCESSAR PAGAMENTO COM CARTÃO DE CRÉDITO (MERCADO PAGO)
if ($action === 'process_card' && !empty($_POST['card_token'])) {
    $payment_method = 'stripe';
    $card_token = trim($_POST['card_token']);
    $order_id = isset($_POST['order_id']) ? (int)$_POST['order_id'] : 0;
    $payment_method_id = isset($_POST['payment_method_id']) ? trim($_POST['payment_method_id']) : 'visa';
    $installments = isset($_POST['installments']) ? (int)$_POST['installments'] : 1;
    $doc_number = isset($_POST['doc_number']) ? preg_replace('/[^0-9]/', '', $_POST['doc_number']) : '';
    $points_package = isset($_POST['points_package']) ? $_POST['points_package'] : '55';

    if ($order_id > 0) {
        $don = $db->query("SELECT * FROM `myaac_donations` WHERE `id` = " . $order_id)->fetch();
        if ($don) {
            $mp_access_token = isset($config['mercadopago_access_token']) ? $config['mercadopago_access_token'] : '';
            if (!empty($mp_access_token)) {
                $payer_email = 'comprador_' . ($acc_id > 0 ? $acc_id : time()) . '@nosleira.com';
                if (isset($logged) && $logged && isset($account_logged) && method_exists($account_logged, 'getEmail')) {
                    $u_email = $account_logged->getEmail();
                    if (!empty($u_email) && filter_var($u_email, FILTER_VALIDATE_EMAIL)) {
                        $payer_email = $u_email;
                    }
                }
                if (!empty($_POST['cardholder_email']) && filter_var($_POST['cardholder_email'], FILTER_VALIDATE_EMAIL)) {
                    $payer_email = trim($_POST['cardholder_email']);
                }

                $payload = array(
                    'token' => $card_token,
                    'description' => $points_package . ' NosleiraCoins - Account: ' . ($acc_name ? $acc_name : 'Player'),
                    'external_reference' => (string)$order_id,
                    'installments' => $installments > 0 ? $installments : 1,
                    'payment_method_id' => !empty($payment_method_id) ? strtolower($payment_method_id) : 'visa',
                    'transaction_amount' => get_nosleira_price($payment_method, $points_package),
                    'payer' => array(
                        'email' => $payer_email,
                        'identification' => array(
                            'type' => 'CPF',
                            'number' => $doc_number
                        )
                    )
                );

                $ch = curl_init('https://api.mercadopago.com/v1/payments');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_TIMEOUT, 20);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Authorization: Bearer ' . $mp_access_token,
                    'Content-Type: application/json',
                    'X-Idempotency-Key: card_order_' . $order_id . '_' . time()
                ));
                $res = curl_exec($ch);
                curl_close($ch);
                $card_payment_result = json_decode($res, true);

                if (isset($card_payment_result['status']) && $card_payment_result['status'] === 'approved') {
                    $mp_card_id = isset($card_payment_result['id']) ? (string)$card_payment_result['id'] : '';
                    // Intenção: Atualizar status no banco e registrar auditoria de sucesso
                    $db->query("UPDATE `myaac_donations` SET `status` = 'completed', `updated_at` = " . time() . ", `mp_payment_id` = " . $db->quote($mp_card_id) . ", `installments` = " . (int)$installments . ", `card_brand` = " . $db->quote($payment_method_id) . ", `payer_email` = " . $db->quote($payer_email) . " WHERE `id` = " . $order_id);
                    if (function_exists('log_donation_event')) {
                        log_donation_event($order_id, $acc_id, 'PAYMENT_APPROVED', 'Aprovado via Cartão de Crédito (' . strtoupper($payment_method_id) . ' ' . $installments . 'x) - MP ID: ' . $mp_card_id);
                    }
                } elseif (isset($card_payment_result['message'])) {
                    $card_error_msg = $card_payment_result['message'];
                    if (isset($card_payment_result['cause'][0]['description'])) {
                        $card_error_msg .= ' (' . $card_payment_result['cause'][0]['description'] . ')';
                    }
                    if (function_exists('log_donation_event')) {
                        log_donation_event($order_id, $acc_id, 'PAYMENT_FAILED', 'Falha no Cartão: ' . $card_error_msg);
                    }
                }
            }
        }
    }
}

// INSERÇÃO NO BANCO DE DADOS (HISTÓRICO COM DADOS DE AUDITORIA)
$client_ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';
$u_email = '';
if (isset($logged) && $logged && isset($account_logged) && method_exists($account_logged, 'getEmail')) {
    $u_email = $account_logged->getEmail();
}

if ($action === 'confirm_tc' && !empty($tibia_char_name)) {
    $db->query("INSERT INTO `myaac_donations` (`account_id`, `account_name`, `payment_method`, `points_package`, `coins`, `price`, `tibia_char_name`, `status`, `created_at`, `updated_at`, `payer_ip`, `payer_email`) VALUES (
        " . (int)$acc_id . ",
        " . $db->quote($acc_name) . ",
        'tibia_coins',
        " . (int)$points_package . ",
        " . (int)$points_package . ",
        " . $db->quote($price_label) . ",
        " . $db->quote($tibia_char_name) . ",
        'pending',
        " . time() . ",
        " . time() . ",
        " . $db->quote($client_ip) . ",
        " . $db->quote($u_email) . "
    )");
    $order_id = $db->lastInsertId();
    if (function_exists('log_donation_event')) {
        log_donation_event($order_id, $acc_id, 'ORDER_CREATED', 'Criado pedido Tibia Coins (Char: ' . $tibia_char_name . ', Package: ' . $points_package . ' coins)');
    }
} elseif ($action === 'checkout' && isset($_POST['payment_method'])) {
    if ($payment_method === 'pix' || $payment_method === 'stripe') {
        $charged_amount = get_nosleira_price($payment_method, $points_package);
        $price_str = 'R$ ' . number_format($charged_amount, 2, ',', '.');
        $card_inst = isset($_POST['installments']) ? (int)$_POST['installments'] : 1;
        $card_b = isset($_POST['payment_method_id']) ? trim($_POST['payment_method_id']) : null;

        $db->query("INSERT INTO `myaac_donations` (`account_id`, `account_name`, `payment_method`, `points_package`, `coins`, `price`, `tibia_char_name`, `status`, `created_at`, `updated_at`, `payer_ip`, `payer_email`, `installments`, `card_brand`) VALUES (
            " . (int)$acc_id . ",
            " . $db->quote($acc_name) . ",
            " . $db->quote($payment_method) . ",
            " . (int)$points_package . ",
            " . (int)$points_package . ",
            " . $db->quote($price_str) . ",
            '',
            'pending',
            " . time() . ",
            " . time() . ",
            " . $db->quote($client_ip) . ",
            " . $db->quote($u_email) . ",
            " . (int)$card_inst . ",
            " . ($card_b ? $db->quote($card_b) : "NULL") . "
        )");
        $order_id = $db->lastInsertId();
        if (function_exists('log_donation_event')) {
            log_donation_event($order_id, $acc_id, 'ORDER_CREATED', 'Criado pedido ' . strtoupper($payment_method) . ' (' . $points_package . ' NosleiraCoins - ' . $price_str . ')');
        }

        // GERAR COBRANÇA PIX REAL VIA MERCADO PAGO API
        if ($payment_method === 'pix' && $order_id > 0) {
            $mp_access_token = isset($config['mercadopago_access_token']) ? $config['mercadopago_access_token'] : '';
            if (!empty($mp_access_token)) {
                $payer_email = 'comprador_' . ($acc_id > 0 ? $acc_id : time()) . '@nosleira.com';
                if (isset($logged) && $logged && isset($account_logged) && method_exists($account_logged, 'getEmail')) {
                    $u_email = $account_logged->getEmail();
                    if (!empty($u_email) && filter_var($u_email, FILTER_VALIDATE_EMAIL)) {
                        $payer_email = $u_email;
                    }
                }

                $payload = array(
                    'transaction_amount' => $charged_amount,
                    'description' => $points_package . ' NosleiraCoins - Account: ' . ($acc_name ? $acc_name : 'Player'),
                    'payment_method_id' => 'pix',
                    'payer' => array(
                        'email' => $payer_email,
                        'first_name' => $acc_name ? $acc_name : 'Player',
                        'last_name' => 'Nosleira'
                    ),
                    'external_reference' => (string)$order_id
                );

                $ch = curl_init('https://api.mercadopago.com/v1/payments');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_TIMEOUT, 15);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Authorization: Bearer ' . $mp_access_token,
                    'Content-Type: application/json',
                    'X-Idempotency-Key: order_' . $order_id . '_' . time()
                ));
                $res = curl_exec($ch);
                curl_close($ch);
                $data = json_decode($res, true);

                if (isset($data['id']) && isset($data['point_of_interaction']['transaction_data'])) {
                    $mp_payment_id = $data['id'];
                    $mp_qr_code = $data['point_of_interaction']['transaction_data']['qr_code'];
                    $mp_qr_code_base64 = isset($data['point_of_interaction']['transaction_data']['qr_code_base64']) ? $data['point_of_interaction']['transaction_data']['qr_code_base64'] : '';
                } elseif (isset($data['message'])) {
                    $mp_error_msg = $data['message'];
                    if (isset($data['cause'][0]['description'])) {
                        $mp_error_msg .= ' (' . $data['cause'][0]['description'] . ')';
                    }
                }
            }
        }
    }
}
?>

<!-- Google Translate Widget (Oculto) -->
<div id="google_translate_element" style="display:none !important;"></div>

<script type="text/javascript">
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,en,es,pl',
        autoDisplay: false
    }, 'google_translate_element');
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

<script type="text/javascript">
function changeLanguage(lang) {
    var domain = window.location.hostname;
    if (lang === 'pt') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain + ';';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domain.replace(/^www\./, '') + ';';
        
        var combo = document.querySelector('.goog-te-combo');
        if (combo) {
            combo.value = 'pt';
            combo.dispatchEvent(new Event('change'));
        }
        location.reload();
        return;
    }

    var cookieValue = '/pt/' + lang;
    document.cookie = 'googtrans=' + cookieValue + '; path=/;';
    document.cookie = 'googtrans=' + cookieValue + '; path=/; domain=' + domain + ';';
    document.cookie = 'googtrans=' + cookieValue + '; path=/; domain=.' + domain.replace(/^www\./, '') + ';';

    var combo = document.querySelector('.goog-te-combo');
    if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
    } else {
        location.reload();
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

/* Ocultar elementos do Google Translate */
.goog-te-banner-frame,
.goog-te-banner-frame.skiptranslate,
#goog-gt-tt,
.goog-te-balloon-frame,
.goog-tooltip,
.goog-tooltip:hover {
    display: none !important;
    visibility: hidden !important;
}

.skiptranslate {
    display: none !important;
}
#google_translate_element {
    display: none !important;
}

/* Accordion estilisado estilo Tibia Premium */
.rule-accordion {
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(160, 130, 90, 0.2);
    padding-bottom: 4px;
}
.rule-accordion:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}
.rule-accordion summary {
    cursor: pointer;
    outline: none;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: linear-gradient(180deg, #fdf9f3 0%, #f4e8d7 100%);
    border: 1px solid #d8c6af;
    border-radius: 6px;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    user-select: none;
}
.rule-accordion summary::-webkit-details-marker {
    display: none;
}
.rule-accordion summary:hover {
    background: linear-gradient(180deg, #fffcf7 0%, #ebd7be 100%);
    border-color: #b89a72;
    box-shadow: 0 3px 8px rgba(127, 0, 0, 0.12);
    transform: translateY(-1px);
}
.rule-accordion[open] summary {
    background: linear-gradient(180deg, #f0dfc8 0%, #e3ceb0 100%);
    border-color: #8b0000;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    border-radius: 6px 6px 0 0;
}

.rule-summary-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
}

.rule-icon-box {
    width: 24px;
    height: 24px;
    min-width: 24px;
    background: linear-gradient(180deg, #9e1a1a 0%, #6e0000 100%);
    color: #fff8e7;
    border: 1px solid #520000;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    margin-right: 12px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease;
}
.rule-accordion[open] .rule-icon-box {
    transform: rotate(180deg);
    background: linear-gradient(180deg, #520000 0%, #8b0000 100%);
}

.rule-title-group {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.rule-accordion-title {
    font-family: 'Cinzel', 'Martel', 'Georgia', serif;
    font-weight: 700;
    font-size: 13.5px;
    color: #4a1c00;
    letter-spacing: 0.2px;
}

.rule-accordion-brief {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 11.5px;
    color: #6e543b;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.rule-action-badge {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #7f0000;
    background: #f5eae0;
    border: 1px solid #d4b5a0;
    padding: 4px 10px;
    border-radius: 12px;
    white-space: nowrap;
    margin-left: 10px;
    transition: all 0.2s ease;
}
.rule-accordion summary:hover .rule-action-badge {
    background: #7f0000;
    color: #ffffff;
    border-color: #5b0000;
}
.rule-accordion[open] .badge-text-closed {
    display: none;
}
.rule-accordion:not([open]) .badge-text-open {
    display: none;
}

.rule-accordion-body {
    background: #faf4e8;
    border: 1px solid #d8c6af;
    border-top: none;
    border-left: 4px solid #8b0000;
    border-radius: 0 0 6px 6px;
    padding: 14px 18px;
    margin-bottom: 12px;
    color: #2b1704;
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 13px;
    line-height: 1.65;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05);
}

/* Destaques Elegantes para Produtos e Preços */
.badge-product {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    color: #ffffff !important;
    padding: 4px 12px;
    border-radius: 14px;
    font-weight: 800;
    font-size: 13.5px;
    border: 1px solid #b45309;
    box-shadow: 0 2px 4px rgba(180, 83, 9, 0.25), inset 0 1px 0 rgba(255,255,255,0.4);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}

.badge-price-tc {
    background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
    color: #ffffff !important;
    padding: 4px 12px;
    border-radius: 14px;
    font-weight: 800;
    font-size: 13.5px;
    border: 1px solid #4c1d95;
    box-shadow: 0 2px 4px rgba(91, 33, 182, 0.25), inset 0 1px 0 rgba(255,255,255,0.4);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}

/* Estilos de Abas de Histórico */
.history-tabs-nav {
    display: flex;
    gap: 6px;
    border-bottom: 2px solid #d8c6af;
    margin-bottom: 12px;
}
.history-tab-btn {
    padding: 8px 16px;
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 13px;
    color: #4a1c00;
    background: linear-gradient(180deg, #fdf9f3 0%, #e2d2bc 100%);
    border: 1px solid #d8c6af;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}
.history-tab-btn.active {
    background: linear-gradient(180deg, #5c9e38 0%, #3d6e24 100%);
    color: #ffffff;
    border-color: #294c18;
    text-shadow: 0 1px 1px rgba(0,0,0,0.4);
}
.history-tab-content {
    display: none;
}
.history-tab-content.active {
    display: block;
}

/* Status Badges com Animação Piscante */
@keyframes badgePendingPulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); opacity: 1; }
    50% { transform: scale(1.04); box-shadow: 0 0 10px 3px rgba(245, 158, 11, 0.7); opacity: 0.85; }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); opacity: 1; }
}

.status-badge-pending {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #fffbeb;
    color: #92400e;
    border: 1px solid #f59e0b;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 11px;
    white-space: nowrap;
    animation: badgePendingPulse 1.6s infinite ease-in-out;
}
.status-badge-completed {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #22c55e;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 800;
    font-size: 11px;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(34, 197, 94, 0.25);
}
.status-badge-canceled {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #ef4444;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 11px;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.history-table-wrapper {
    border: 1px solid #d8c6af;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    background: #ffffff;
}

/* Bandeiras na Área Verde das Regras */
.rules-caption-inner {
    position: relative !important;
}
.rules-green-bar-flags {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 50;
}
.flag-icon {
    transition: transform 0.15s ease-in-out;
    width: 18px;
    height: 12px;
    border: none !important;
    box-shadow: none !important;
    display: block;
    cursor: pointer !important;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    -ms-interpolation-mode: nearest-neighbor;
}
.flag-icon:hover {
    transform: scale(1.2);
}

/* Termos e Condições & Checkbox & Botão Continuar */
.terms-main-title {
    font-family: 'Cinzel', 'Georgia', serif;
    font-size: 16px;
    font-weight: 800;
    color: #4a1c00;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(160, 130, 90, 0.35);
    padding-bottom: 8px;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 1px rgba(255,255,255,0.7);
}

.terms-rules-header {
    background: linear-gradient(180deg, #f5ebd9 0%, #e8d5bc 100%);
    border: 1px solid #c8b193;
    border-left: 5px solid #b45309;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.terms-rules-title {
    font-family: 'Cinzel', 'Georgia', serif;
    font-weight: 800;
    font-size: 15px;
    color: #4a1c00;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-shadow: 0 1px 0 rgba(255,255,255,0.6);
}

.terms-rules-subtitle {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 11.5px;
    color: #78350f;
    font-weight: 600;
    background: rgba(255,255,255,0.6);
    padding: 3px 10px;
    border-radius: 12px;
    border: 1px solid rgba(180, 83, 9, 0.2);
}

.terms-agreement-card {
    background: linear-gradient(180deg, #ffffff 0%, #fbf6ee 100%);
    border: 1.5px solid #cbb290;
    border-radius: 8px;
    padding: 16px 20px;
    margin: 10px auto;
    max-width: 680px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.05);
    transition: all 0.2s ease-in-out;
}

.terms-agreement-card:hover {
    border-color: #059669;
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.12);
}

.custom-checkbox-container {
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    user-select: none;
    text-align: left;
    margin: 0;
}

.custom-checkbox-container input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    cursor: pointer;
}

.custom-checkbox-checkmark {
    width: 24px;
    height: 24px;
    min-width: 24px;
    background-color: #ffffff;
    border: 2px solid #a0825a;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    position: relative;
}

.custom-checkbox-container:hover .custom-checkbox-checkmark {
    border-color: #059669;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
}

.custom-checkbox-container input[type="checkbox"]:checked ~ .custom-checkbox-checkmark {
    background: linear-gradient(135deg, #10b981 0%, #047857 100%);
    border-color: #065f46;
    box-shadow: 0 2px 5px rgba(4, 120, 87, 0.4);
}

.custom-checkbox-checkmark:after {
    content: "";
    position: absolute;
    display: none;
    width: 6px;
    height: 11px;
    border: solid #ffffff;
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg) translate(-1px, -1px);
}

.custom-checkbox-container input[type="checkbox"]:checked ~ .custom-checkbox-checkmark:after {
    display: block;
}

.terms-agreement-text {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 13.5px;
    color: #2b1704;
    line-height: 1.5;
}

.terms-agreement-text strong {
    color: #065f46;
}

.btn-donate-continue {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 42px;
    font-family: 'Cinzel', serif;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: #ffffff;
    background: linear-gradient(180deg, #34d399 0%, #059669 45%, #047857 100%);
    border: 1px solid #064e3b;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(4, 120, 87, 0.35), inset 0 1px 0 rgba(255,255,255,0.4);
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    transition: all 0.2s ease-in-out;
}

.btn-donate-continue:hover {
    background: linear-gradient(180deg, #4ade80 0%, #10b981 45%, #059669 100%);
    box-shadow: 0 6px 16px rgba(4, 120, 87, 0.45), inset 0 1px 0 rgba(255,255,255,0.6);
    transform: translateY(-2px);
}

.btn-donate-continue:active {
    transform: translateY(1px);
    box-shadow: 0 2px 6px rgba(4, 120, 87, 0.3);
}

.btn-donate-continue .btn-arrow {
    font-size: 16px;
    transition: transform 0.2s ease;
}

.btn-donate-continue:hover .btn-arrow {
    transform: translateX(4px);
}
</style>

<?php if ($action === 'confirm_tc'): ?>

<!-- TELA 4: CONFIRMAÇÃO DO PEDIDO DE TIBIA COINS (TEMA DA COMUNIDADE TIBIA) -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer rules-caption-inner">
            <div class="rules-green-bar-flags">
                <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" style="cursor: pointer;" />
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">DONATE</div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
    
    <table class="Table3" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <div class="InnerTableContainer">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight: bold; font-size: 16px; padding: 12px 16px; font-family: 'Cinzel', serif; color: #3d1c02; text-shadow: 0 1px 0 rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: space-between;">
                                                                <div style="display: flex; align-items: center; gap: 8px;">
                                                                    <span style="color: #22c55e;">✓</span>
                                                                    <span>Pedido de Doação Registrado com Sucesso!</span>
                                                                </div>
                                                                <?php if ($order_id > 0): ?>
                                                                <span style="font-size: 13px; color: #b45309; font-weight: 800;">Ref: #<?php echo $order_id; ?></span>
                                                                <?php endif; ?>
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 18px;">
                                                                <div style="background: linear-gradient(180deg, #fdf9f3 0%, #f5e9d6 100%); border: 1px solid #d8c6af; border-radius: 6px; padding: 20px 24px; margin-bottom: 20px; line-height: 1.7; color: #2b1704; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                                                                    <div style="font-size: 15px; font-weight: 700; color: #4a1c00; margin-bottom: 14px; font-family: 'Cinzel', serif; border-bottom: 1px solid rgba(160, 130, 90, 0.3); padding-bottom: 6px;">Resumo da Solicitação:</div>
                                                                    
                                                                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-family: 'Inter', sans-serif; font-size: 13.5px;">
                                                                        <tbody>
                                                                            <tr style="border-bottom: 1px solid rgba(160, 130, 90, 0.2);">
                                                                                <td style="width: 200px; padding: 8px 0; font-weight: 700; color: #4a1c00;">Produto:</td>
                                                                                <td style="padding: 8px 0;">
                                                                                     <span class="badge-product"><img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="NosleiraCoin" style="height: 16px; width: 16px; vertical-align: middle; margin-right: 2px;"> <?php echo htmlspecialchars($product_label); ?></span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr style="border-bottom: 1px solid rgba(160, 130, 90, 0.2);">
                                                                                <td style="padding: 8px 0; font-weight: 700; color: #4a1c00;">Preço:</td>
                                                                                <td style="padding: 8px 0;">
                                                                                    <span class="badge-price-tc">⚡ <?php echo htmlspecialchars($price_label); ?></span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr style="border-bottom: 1px solid rgba(160, 130, 90, 0.2);">
                                                                                <td style="padding: 8px 0; font-weight: 700; color: #4a1c00;">Taxa de Conversão:</td>
                                                                                <td style="padding: 8px 0;">
                                                                                    <span style="font-size: 12px; font-weight: 700; color: #047857; background: #ecfdf5; border: 1px solid #10b981; padding: 3px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">✓ 5% de taxa já deduzida no total entregue</span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr style="border-bottom: 1px solid rgba(160, 130, 90, 0.2);">
                                                                                <td style="padding: 8px 0; font-weight: 700; color: #4a1c00;">Personagem de Origem (Tibia.com):</td>
                                                                                <td style="padding: 8px 0; color: #4a1c00; font-weight: 700; font-size: 14px;"><?php echo htmlspecialchars($tibia_char_name); ?></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="padding: 8px 0; font-weight: 700; color: #4a1c00;">Personagem de Destino (Staff):</td>
                                                                                <td style="padding: 8px 0; color: #b45309; font-weight: 800; font-size: 15px; font-family: 'Cinzel', serif;">roxzorde</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <div style="background: linear-gradient(180deg, #fff7ed 0%, #fef3c7 100%); border: 1px solid #f59e0b; border-left: 4px solid #d97706; border-radius: 6px; padding: 14px 18px; color: #78350f; font-size: 13px; font-family: 'Inter', sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                                                                        <div style="font-weight: 800; font-size: 14px; margin-bottom: 8px; color: #92400e; display: flex; align-items: center; gap: 6px;">
                                                                            <span style="font-size: 16px;">🎟️</span>
                                                                            <span>Instruções Finais para Entrega:</span>
                                                                        </div>
                                                                        <ol style="margin: 0 0 0 18px; padding: 0; line-height: 1.7;">
                                                                            <li>Transfira exatamente <b><?php echo htmlspecialchars($price_label); ?></b> no Tibia.com para o personagem <b>roxzorde</b>.</li>
                                                                            <li><b style="color: #b45309;">Abra um ticket</b> em nosso suporte informando o nome do personagem (<b><?php echo htmlspecialchars($tibia_char_name); ?></b>) que enviou as moedas para o meu personagem (<b>roxzorde</b>).</li>
                                                                            <li>Seus <b><?php echo htmlspecialchars($product_label); ?></b> serão creditados em sua conta em um prazo de <b>1 dia a 24 horas</b> após a validação do ticket.</li>
                                                                        </ol>
                                                                    </div>
                                                                </div>

                                                                <div style="display: flex; justify-content: center; margin-top: 15px;">
                                                                    <form action="?subtopic=donate" method="post">
                                                                        <input type="hidden" name="accept_terms" value="1">
                                                                        <input type="submit" value="Voltar para Doações" style="padding: 8px 36px; font-weight: bold; font-size: 13px; cursor: pointer; background: linear-gradient(180deg, #5c9e38 0%, #3d6e24 100%); color: #ffffff; border: 1px solid #294c18; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-shadow: 0 1px 1px rgba(0,0,0,0.4);">
                                                                    </form>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<?php elseif ($action === 'checkout'): ?>

<!-- TELA 3: PROCESSANDO PAGAMENTO (NO TEMA OFICIAL DO SITE) -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer rules-caption-inner">
            <div class="rules-green-bar-flags">
                <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" style="cursor: pointer;" />
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">DONATE</div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>

    <table class="Table3" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <div class="InnerTableContainer">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight: bold; font-size: 16px; padding: 12px 16px; font-family: 'Cinzel', serif; color: #3d1c02; text-shadow: 0 1px 0 rgba(255,255,255,0.4); display: flex; align-items: center; gap: 10px;">
                                                                <?php if ($payment_method === 'tibia_coins'): ?>
                                                                    <img src="<?php echo BASE_URL; ?>images/payment/tibia_coins_hd.png" alt="Tibia Coins" style="height: 28px; image-rendering: pixelated;">
                                                                    <span>Processing Payment: Tibia Coins</span>
                                                                <?php elseif ($payment_method === 'pix'): ?>
                                                                    <img src="<?php echo BASE_URL; ?>images/payment/pix_official.png" alt="PIX" style="height: 26px; object-fit: contain;">
                                                                    <span>Processing Payment: PIX Instantâneo</span>
                                                                <?php else: ?>
                                                                    <img src="<?php echo BASE_URL; ?>images/payment/stripe_cards_hd.png" alt="Cartão de Crédito" style="height: 26px; object-fit: contain;">
                                                                    <span>Processing Payment: Cartão de Crédito</span>
                                                                <?php endif; ?>
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 18px;">

                                                                <?php if ($payment_method === 'tibia_coins'): ?>

                                                                <form action="?subtopic=donate&action=confirm_tc" method="post" id="tc_checkout_form">
                                                                    <input type="hidden" name="accept_terms" value="1">
                                                                    <input type="hidden" name="payment_method" value="tibia_coins">
                                                                    <input type="hidden" name="points_package" value="<?php echo htmlspecialchars($points_package); ?>">

                                                                    <div style="background: linear-gradient(180deg, #fdf9f3 0%, #f5e9d6 100%); border: 1px solid #d8c6af; border-radius: 6px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                                                                        <table style="width: 100%; border-collapse: collapse; color: #2b1704; font-family: 'Inter', Arial, sans-serif; font-size: 13.5px;">
                                                                            <tbody>
                                                                                <tr style="border-bottom: 1px solid rgba(160, 130, 90, 0.25);">
                                                                                    <td style="width: 200px; padding: 10px 0; font-weight: 700; color: #4a1c00;">Product:</td>
                                                                                    <td style="padding: 10px 0;">
                                                                                        <span class="badge-product"><img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="NosleiraCoin" style="height: 16px; width: 16px; vertical-align: middle; margin-right: 2px;"> <?php echo htmlspecialchars($product_label); ?></span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="border-bottom: 1px solid rgba(160, 130, 90, 0.25);">
                                                                                    <td style="padding: 10px 0; font-weight: 700; color: #4a1c00;">Price:</td>
                                                                                    <td style="padding: 10px 0;">
                                                                                        <span class="badge-price-tc">⚡ <?php echo htmlspecialchars($price_label); ?></span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="border-bottom: 1px solid rgba(160, 130, 90, 0.25);">
                                                                                    <td style="padding: 10px 0; font-weight: 700; color: #4a1c00;">Taxa de Conversão:</td>
                                                                                    <td style="padding: 10px 0;">
                                                                                        <span style="font-size: 12px; font-weight: 700; color: #047857; background: #ecfdf5; border: 1px solid #10b981; padding: 3px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">✓ 5% de taxa já deduzida no total a receber</span>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="border-bottom: 1px solid rgba(160, 130, 90, 0.25);">
                                                                                    <td style="padding: 10px 0; font-weight: 700; color: #4a1c00;">Personagem de Destino (Staff):</td>
                                                                                    <td style="padding: 10px 0; color: #b45309; font-weight: 800; font-size: 15px; font-family: 'Cinzel', serif;">roxzorde</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style="padding: 14px 0 4px 0; font-weight: 700; color: #4a1c00; vertical-align: middle;">Tibia.com - char name</td>
                                                                                    <td style="padding: 14px 0 4px 0;">
                                                                                        <input type="text" name="tibia_char_name" style="width: 300px; max-width: 100%; padding: 7px 12px; font-size: 13.5px; background-color: #ffffff; color: #2b1704; border: 1px solid #a0825a; border-radius: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.08); outline: none; font-weight: 600;" required placeholder="Nome do seu personagem no Tibia.com">
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td></td>
                                                                                    <td style="padding-top: 6px;">
                                                                                        <span style="font-size: 12px; color: #7f5539; font-family: 'Inter', sans-serif; display: block; font-weight: 500;">Abra um ticket com o nome do personagem que foi enviado as contas para o nome do meu personagem: <b style="color: #b45309;">roxzorde</b>.</span>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>

                                                                    <div style="display: flex; justify-content: center; gap: 160px; margin-top: 20px; margin-bottom: 10px;">
                                                                        <input type="submit" value="Submit" style="padding: 8px 42px; font-weight: bold; font-size: 13.5px; cursor: pointer; background: linear-gradient(180deg, #5c9e38 0%, #3d6e24 100%); color: #ffffff; border: 1px solid #294c18; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-shadow: 0 1px 1px rgba(0,0,0,0.4);">

                                                                        <button type="button" onclick="var f=document.getElementById('tc_checkout_form'); f.action='?subtopic=donate'; f.submit();" style="padding: 8px 42px; font-weight: bold; font-size: 13.5px; cursor: pointer; background: linear-gradient(180deg, #9e1a1a 0%, #6e0000 100%); color: #ffffff; border: 1px solid #520000; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-shadow: 0 1px 1px rgba(0,0,0,0.4);">Back</button>
                                                                    </div>
                                                                </form>

                                                                <?php elseif ($payment_method === 'pix'): ?>

                                                                <!-- TELA DE CHECKOUT PIX MERCADO PAGO -->
                                                                <div style="font-weight: 700; font-size: 14.5px; margin-bottom: 12px; color: #4a1c00; font-family: 'Cinzel', serif;">
                                                                    Processing Payment: PIX Instantâneo
                                                                </div>
                                                                <div style="background: linear-gradient(180deg, #fdf9f3 0%, #f5e9d6 100%); border: 1px solid #d8c6af; border-radius: 6px; padding: 20px 24px; margin-bottom: 20px; text-align: center; color: #2b1704; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                                                                    <div style="font-size: 16px; font-weight: 800; color: #00875a; margin-bottom: 8px;">Pagamento via PIX (Mercado Pago)</div>
                                                                    <p style="font-size: 14px; color: #2b1704; margin-bottom: 14px;">Valor: <b style="color: #00875a;"><?php echo htmlspecialchars($price_str); ?></b> - Pacote: <b><?php echo htmlspecialchars($points_package); ?> NosleiraCoins <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="NosleiraCoin" style="height: 16px; width: 16px; vertical-align: middle; margin-right: 2px;"></b> (Pedido #<?php echo $order_id; ?>)</p>
                                                                    <?php 
                                                                    $qr_img_src = '';
                                                                    if (!empty($mp_qr_code_base64)) {
                                                                        $qr_img_src = 'data:image/png;base64,' . $mp_qr_code_base64;
                                                                    } elseif (!empty($mp_qr_code)) {
                                                                        $qr_img_src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . urlencode($mp_qr_code);
                                                                    } else {
                                                                        // QR Code de Demonstração / Preview HD
                                                                        $demo_pix_code = "00020126580014BR.GOV.BCB.PIX0136nosleira-pix-chave-demo-2026520400005303986540510.005802BR5915Nosleira Server6009SAO PAULO62070503***6304E2D8";
                                                                        $qr_img_src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . urlencode($demo_pix_code);
                                                                        if (empty($mp_qr_code)) {
                                                                            $mp_qr_code = $demo_pix_code;
                                                                        }
                                                                    }
                                                                    ?>

                                                                    <!-- QUADRO DO QR CODE GRANDÃO -->
                                                                    <div style="background: #ffffff; padding: 18px; display: inline-block; border-radius: 12px; border: 2px solid #00875a; margin-bottom: 16px; box-shadow: 0 4px 14px rgba(0,135,90,0.15);">
                                                                        <div style="font-weight: 700; font-size: 13px; color: #00875a; margin-bottom: 10px; font-family: 'Cinzel', serif;">Escaneie o QR Code abaixo no app do seu Banco:</div>
                                                                        <img src="<?php echo $qr_img_src; ?>" alt="PIX QR Code" style="width: 250px; height: 250px; display: block; margin: 0 auto; image-rendering: pixelated; border: 1px solid #e2d2bc; border-radius: 6px; padding: 6px; background: #fff;">
                                                                    </div>

                                                                    <?php if (!empty($mp_qr_code)): ?>
                                                                        <div style="margin-top: 10px; margin-bottom: 16px;">
                                                                            <label style="font-weight: 700; font-size: 13px; color: #4a1c00; display: block; margin-bottom: 6px;">Ou use o código PIX Copia e Cola abaixo:</label>
                                                                            <div style="display: flex; justify-content: center; gap: 8px; max-width: 520px; margin: 0 auto;">
                                                                                <input type="text" id="pix_copia_cola" value="<?php echo htmlspecialchars($mp_qr_code); ?>" readonly style="flex: 1; padding: 9px 12px; font-size: 11.5px; background: #fff; border: 1px solid #a0825a; border-radius: 4px; color: #2b1704; outline: none; font-weight: 600;">
                                                                                <button type="button" onclick="copyPixCode()" style="padding: 9px 20px; font-weight: bold; font-size: 13px; cursor: pointer; background: linear-gradient(180deg, #00875a 0%, #006644 100%); color: #fff; border: 1px solid #004d33; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Copiar Código</button>
                                                                            </div>
                                                                            <span id="pix_copied_msg" style="display: none; color: #00875a; font-size: 12.5px; font-weight: 700; margin-top: 6px;">✓ Código PIX copiado para a área de transferência!</span>
                                                                        </div>
                                                                        <script type="text/javascript">
                                                                        function copyPixCode() {
                                                                            var copyText = document.getElementById('pix_copia_cola');
                                                                            copyText.select();
                                                                            copyText.setSelectionRange(0, 99999);
                                                                            navigator.clipboard.writeText(copyText.value);
                                                                            document.getElementById('pix_copied_msg').style.display = 'block';
                                                                            setTimeout(function(){ document.getElementById('pix_copied_msg').style.display = 'none'; }, 3000);
                                                                        }
                                                                        </script>
                                                                    <?php endif; ?>

                                                                    <?php if (!empty($mp_error_msg)): ?>
                                                                        <div style="background: #fff3cd; border: 1px solid #ffeba8; border-left: 5px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin: 12px auto; max-width: 540px; text-align: left; font-size: 12.5px; color: #856404; font-family: 'Inter', sans-serif;">
                                                                            🔑 <b>Aviso de Ativação do Mercado Pago:</b><br>
                                                                            O Mercado Pago retornou a seguinte instrução: <i>"Collector user without key enabled for QR"</i>.<br>
                                                                            <b>Como resolver em 1 minuto:</b> No aplicativo do Mercado Pago no seu celular, vá em <b>PIX $\rightarrow$ Minhas Chaves</b> e cadastre qualquer chave (CPF, E-mail ou Celular). Isso libera o QR Code real de produção instantaneamente!
                                                                        </div>
                                                                    <?php endif; ?>

                                                                    <div id="live_status_box" style="margin-top: 14px; font-size: 13.5px; font-weight: 700; color: #b45309; background: #fff8e7; padding: 8px 14px; border-radius: 20px; display: inline-block; border: 1px solid #f59e0b;">
                                                                        ⏳ Aguardando pagamento... Status verificado em tempo real.
                                                                    </div>
                                                                    <script type="text/javascript">
                                                                    var orderIdToCheck = <?php echo (int)$order_id; ?>;
                                                                    if (orderIdToCheck > 0) {
                                                                        var checkInterval = setInterval(function() {
                                                                            fetch('?subtopic=donate&action=check_payment_status&order_id=' + orderIdToCheck)
                                                                                .then(response => response.json())
                                                                                .then(data => {
                                                                                    if (data.status === 'completed') {
                                                                                        clearInterval(checkInterval);
                                                                                        document.getElementById('live_status_box').style.background = '#dcfce7';
                                                                                        document.getElementById('live_status_box').style.borderColor = '#22c55e';
                                                                                        document.getElementById('live_status_box').innerHTML = '<span style="color: #15803d; font-size: 15px;">🎉 Pagamento Aprovado! Seus NosleiraCoins já foram entregues na sua conta!</span>';
                                                                                    }
                                                                                });
                                                                        }, 3000);
                                                                    }
                                                                    </script>
                                                                </div>
                                                                <div style="display: flex; justify-content: center;">
                                                                    <form action="?subtopic=donate" method="post">
                                                                        <input type="hidden" name="accept_terms" value="1">
                                                                        <input type="submit" value="Voltar para Doações" style="padding: 8px 42px; font-weight: bold; font-size: 13.5px; cursor: pointer; background: linear-gradient(180deg, #9e1a1a 0%, #6e0000 100%); color: #ffffff; border: 1px solid #520000; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                                                    </form>
                                                                </div>

                                                                <?php elseif ($payment_method === 'stripe' || $payment_method === 'credit_card' || $action === 'process_card'): ?>

                                                                <!-- TELA DE CHECKOUT CARTÃO DE CRÉDITO -->
                                                                <div style="font-weight: 700; font-size: 14.5px; margin-bottom: 12px; color: #4a1c00; font-family: 'Cinzel', serif;">
                                                                    Processing Payment: Cartão de Crédito (Mercado Pago)
                                                                </div>

                                                                <?php if (isset($card_payment_result['status']) && $card_payment_result['status'] === 'approved'): ?>

                                                                    <div style="background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-left: 4px solid #10b981; border-radius: 6px; padding: 22px 26px; margin-bottom: 20px; text-align: center; color: #065f46; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                                                                        <div style="font-size: 24px; margin-bottom: 6px;">🎉</div>
                                                                        <div style="font-size: 17px; font-weight: 800; color: #047857; margin-bottom: 8px; font-family: 'Cinzel', serif;">Pagamento Aprovado com Sucesso!</div>
                                                                        <p style="font-size: 14px; margin-bottom: 12px;">Seu pagamento no valor de <b style="color: #047857;">R$ <?php echo htmlspecialchars($points_package); ?>,00</b> via Cartão de Crédito foi processado.</p>
                                                                        <p style="font-size: 14px; font-weight: 700; color: #065f46; background: #ffffff; display: inline-block; padding: 8px 18px; border-radius: 20px; border: 1px solid #6ee7b7;">
                                                                            <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="NosleiraCoin" style="height: 18px; width: 18px; vertical-align: middle; margin-right: 4px;"> Seus <?php echo htmlspecialchars($points_package); ?> NosleiraCoins já foram adicionados à sua conta!
                                                                        </p>
                                                                    </div>

                                                                    <div style="display: flex; justify-content: center;">
                                                                        <form action="?subtopic=donate" method="post">
                                                                            <input type="hidden" name="accept_terms" value="1">
                                                                            <input type="submit" value="Voltar para Doações" style="padding: 10px 42px; font-weight: bold; font-size: 13.5px; cursor: pointer; background: linear-gradient(180deg, #5c9e38 0%, #3d6e24 100%); color: #ffffff; border: 1px solid #294c18; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                                                        </form>
                                                                    </div>

                                                                <?php elseif (isset($card_payment_result['status']) && $card_payment_result['status'] === 'in_process'): ?>

                                                                    <div style="background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 20px 24px; margin-bottom: 20px; text-align: center; color: #92400e;">
                                                                        <div style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">⏳ Pagamento em Análise</div>
                                                                        <p style="font-size: 13.5px;">A operadora do seu cartão de crédito está analisando a transação. Seus NosleiraCoins serão liberados assim que a análise for concluída.</p>
                                                                    </div>

                                                                    <div style="display: flex; justify-content: center;">
                                                                        <form action="?subtopic=donate" method="post">
                                                                            <input type="hidden" name="accept_terms" value="1">
                                                                            <input type="submit" value="Voltar para Doações" style="padding: 8px 42px; font-weight: bold; font-size: 13.5px; cursor: pointer; background: linear-gradient(180deg, #9e1a1a 0%, #6e0000 100%); color: #ffffff; border: 1px solid #520000; border-radius: 4px;">
                                                                        </form>
                                                                    </div>

                                                                <?php else: ?>

                                                                    <?php if (!empty($card_error_msg) || (isset($card_payment_result['status']) && $card_payment_result['status'] === 'rejected')): ?>
                                                                        <div style="background: #fef2f2; border: 1px solid #fca5a5; border-left: 4px solid #ef4444; border-radius: 6px; padding: 12px 18px; margin-bottom: 16px; color: #991b1b; font-size: 13px; font-family: 'Inter', sans-serif;">
                                                                            <b>❌ Transação Recusada:</b> <?php echo !empty($card_error_msg) ? htmlspecialchars($card_error_msg) : 'Sua operadora de cartão não aprovou o pagamento. Verifique os dados ou tente outro cartão.'; ?>
                                                                        </div>
                                                                    <?php endif; ?>

                                                                    <!-- FORMULÁRIO SEGURO DE CARTÃO DE CRÉDITO -->
                                                                    <form id="card_payment_form" action="?subtopic=donate&action=process_card" method="post" onsubmit="return handleCardTokenization(event);">
                                                                        <input type="hidden" name="order_id" value="<?php echo $order_id; ?>">
                                                                        <input type="hidden" name="payment_method" value="stripe">
                                                                        <input type="hidden" name="points_package" value="<?php echo htmlspecialchars($points_package); ?>">
                                                                        <input type="hidden" name="card_token" id="mp_card_token" value="">
                                                                        <input type="hidden" name="payment_method_id" id="mp_payment_method_id" value="visa">

                                                                        <div style="background: linear-gradient(180deg, #fdf9f3 0%, #f5e9d6 100%); border: 1px solid #d8c6af; border-radius: 6px; padding: 22px 26px; margin-bottom: 20px; color: #2b1704; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                                                                            <div style="font-size: 16px; font-weight: 800; color: #1d4ed8; margin-bottom: 6px; font-family: 'Cinzel', serif; border-bottom: 1px solid rgba(160, 130, 90, 0.3); padding-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                                                                                <span>💳 Dados do Cartão de Crédito</span>
                                                                                <span style="font-size: 11.5px; font-family: 'Inter', sans-serif; color: #059669; font-weight: 700; background: #d1fae5; padding: 3px 8px; border-radius: 12px; border: 1px solid #a7f3d0;">🔒 Criptografia SSL 256-bit (Mercado Pago)</span>
                                                                            </div>
                                                                            
                                                                            <p style="font-size: 13.5px; color: #4a1c00; margin-bottom: 16px;">
                                                                                Valor a Pagar: <b style="color: #059669;"><?php echo htmlspecialchars($price_str); ?></b> &bull; Pacote: <b><?php echo htmlspecialchars($points_package); ?> NosleiraCoins <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="NosleiraCoin" style="height: 16px; width: 16px; vertical-align: middle; margin-right: 2px;"></b> (Pedido #<?php echo $order_id; ?>)
                                                                            </p>

                                                                            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px;">
                                                                                <span id="card_brand_badge" style="font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 4px; background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;">💳 Bandeiras Aceitas: VISA, MASTERCARD, ELO, AMEX, HIPERCARD</span>
                                                                            </div>

                                                                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; text-align: left; max-width: 580px; margin: 0 auto; font-family: 'Inter', sans-serif;">
                                                                                
                                                                                <!-- Número do Cartão -->
                                                                                <div style="grid-column: span 2;">
                                                                                    <label style="font-size: 12px; font-weight: 700; color: #4a1c00; display: block; margin-bottom: 4px;">Número do Cartão:</label>
                                                                                    <input type="text" id="card_number" placeholder="0000 0000 0000 0000" maxlength="19" required oninput="formatCardNumber(this); detectCardBrand(this.value);" style="width: 100%; padding: 8px 12px; font-size: 14px; border: 1px solid #a0825a; border-radius: 4px; outline: none; box-sizing: border-box; background: #fff;">
                                                                                </div>

                                                                                <!-- Nome Impresso no Cartão -->
                                                                                <div style="grid-column: span 2;">
                                                                                    <label style="font-size: 12px; font-weight: 700; color: #4a1c00; display: block; margin-bottom: 4px;">Nome no Cartão (como impresso):</label>
                                                                                    <input type="text" id="cardholder_name" name="cardholder_name" placeholder="NOME SOBRENOME" required style="width: 100%; padding: 8px 12px; font-size: 13.5px; border: 1px solid #a0825a; border-radius: 4px; outline: none; box-sizing: border-box; text-transform: uppercase; background: #fff;">
                                                                                </div>

                                                                                <!-- Validade MM/AA -->
                                                                                <div>
                                                                                    <label style="font-size: 12px; font-weight: 700; color: #4a1c00; display: block; margin-bottom: 4px;">Validade (MM/AA):</label>
                                                                                    <input type="text" id="card_expiration" placeholder="MM/AA" maxlength="5" required oninput="formatExpiration(this);" style="width: 100%; padding: 8px 12px; font-size: 13.5px; border: 1px solid #a0825a; border-radius: 4px; outline: none; box-sizing: border-box; background: #fff;">
                                                                                </div>

                                                                                <!-- CVV -->
                                                                                <div>
                                                                                    <label style="font-size: 12px; font-weight: 700; color: #4a1c00; display: block; margin-bottom: 4px;">Código de Segurança (CVV):</label>
                                                                                    <input type="password" id="card_cvv" placeholder="123" maxlength="4" required style="width: 100%; padding: 8px 12px; font-size: 13.5px; border: 1px solid #a0825a; border-radius: 4px; outline: none; box-sizing: border-box; background: #fff;">
                                                                                </div>

                                                                                <!-- CPF -->
                                                                                <div>
                                                                                    <label style="font-size: 12px; font-weight: 700; color: #4a1c00; display: block; margin-bottom: 4px;">CPF do Titular:</label>
                                                                                    <input type="text" id="doc_number" name="doc_number" placeholder="000.000.000-00" maxlength="14" required oninput="formatCPF(this);" style="width: 100%; padding: 8px 12px; font-size: 13.5px; border: 1px solid #a0825a; border-radius: 4px; outline: none; box-sizing: border-box; background: #fff;">
                                                                                </div>

                                                                                <!-- Parcelas -->
                                                                                <div>
                                                                                    <label style="font-size: 12px; font-weight: 700; color: #4a1c00; display: block; margin-bottom: 4px;">Parcelamento:</label>
                                                                                    <select name="installments" id="card_installments" style="width: 100%; padding: 8px 12px; font-size: 13.5px; border: 1px solid #a0825a; border-radius: 4px; outline: none; box-sizing: border-box; background: #fff;">
                                                                                        <option value="1">1x de <?php echo $price_str; ?> à vista</option>
                                                                                        <option value="2">2x de R$ <?php echo number_format($charged_amount / 2, 2, ',', '.'); ?></option>
                                                                                        <option value="3">3x de R$ <?php echo number_format($charged_amount / 3, 2, ',', '.'); ?></option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>

                                                                            <div id="card_error_msg" style="display: none; background: #fef2f2; border: 1px solid #ef4444; border-radius: 4px; padding: 10px 14px; margin-top: 14px; font-size: 12.5px; color: #991b1b; text-align: center;"></div>
                                                                            <div id="card_loading_msg" style="display: none; background: #eff6ff; border: 1px solid #3b82f6; border-radius: 4px; padding: 10px 14px; margin-top: 14px; font-size: 13px; color: #1e40af; font-weight: 700; text-align: center;">
                                                                                ⏳ Criptografando dados do cartão com segurança Mercado Pago... Aguarde um momento.
                                                                            </div>
                                                                        </div>

                                                                        <div style="display: flex; justify-content: center; gap: 20px;">
                                                                            <button type="submit" id="btn_submit_card" style="padding: 10px 36px; font-weight: bold; font-size: 14px; cursor: pointer; background: linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%); color: #ffffff; border: 1px solid #1e3a8a; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">🔒 Pagar com Cartão de Crédito</button>
                                                                            <button type="button" onclick="window.location.href='?subtopic=donate&accepted=1';" style="padding: 10px 24px; font-weight: bold; font-size: 14px; cursor: pointer; background: linear-gradient(180deg, #9e1a1a 0%, #6e0000 100%); color: #ffffff; border: 1px solid #520000; border-radius: 4px;">Voltar</button>
                                                                        </div>
                                                                    </form>

                                                                    <script type="text/javascript">
                                                                    var MP_PUBLIC_KEY = '<?php echo isset($config['mercadopago_public_key']) ? $config['mercadopago_public_key'] : ''; ?>';

                                                                    function formatCardNumber(input) {
                                                                        var v = input.value.replace(/\D/g, '').substring(0, 16);
                                                                        input.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
                                                                    }

                                                                    function formatExpiration(input) {
                                                                        var v = input.value.replace(/\D/g, '').substring(0, 4);
                                                                        if (v.length >= 3) {
                                                                            input.value = v.substring(0, 2) + '/' + v.substring(2, 4);
                                                                        } else {
                                                                            input.value = v;
                                                                        }
                                                                    }

                                                                    function formatCPF(input) {
                                                                        var v = input.value.replace(/\D/g, '').substring(0, 11);
                                                                        v = v.replace(/(\d{3})(\d)/, '$1.$2');
                                                                        v = v.replace(/(\d{3})(\d)/, '$1.$2');
                                                                        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                                                        input.value = v;
                                                                    }

                                                                    function detectCardBrand(number) {
                                                                        var cleanNumber = number.replace(/\D/g, '');
                                                                        var brand = 'visa';
                                                                        var brandName = 'VISA';

                                                                        if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
                                                                            brand = 'master'; brandName = 'MASTERCARD';
                                                                        } else if (/^3[47]/.test(cleanNumber)) {
                                                                            brand = 'amex'; brandName = 'AMERICAN EXPRESS';
                                                                        } else if (/^(4011|4389|4514|4576|5041|5067|5090|6277|6362|6363)/.test(cleanNumber)) {
                                                                            brand = 'elo'; brandName = 'ELO';
                                                                        } else if (/^(606282|3841)/.test(cleanNumber)) {
                                                                            brand = 'hipercard'; brandName = 'HIPERCARD';
                                                                        } else if (/^4/.test(cleanNumber)) {
                                                                            brand = 'visa'; brandName = 'VISA';
                                                                        }

                                                                        document.getElementById('mp_payment_method_id').value = brand;
                                                                        document.getElementById('card_brand_badge').innerText = '💳 Bandeira Detectada: ' + brandName;
                                                                    }

                                                                    function handleCardTokenization(e) {
                                                                        e.preventDefault();
                                                                        
                                                                        var rawCard = document.getElementById('card_number').value.replace(/\D/g, '');
                                                                        var holder = document.getElementById('cardholder_name').value.trim();
                                                                        var exp = document.getElementById('card_expiration').value.replace(/\D/g, '');
                                                                        var cvv = document.getElementById('card_cvv').value.replace(/\D/g, '');
                                                                        var doc = document.getElementById('doc_number').value.replace(/\D/g, '');
                                                                        var errorBox = document.getElementById('card_error_msg');
                                                                        var loadingBox = document.getElementById('card_loading_msg');
                                                                        var btnSubmit = document.getElementById('btn_submit_card');

                                                                        errorBox.style.display = 'none';

                                                                        if (rawCard.length < 13) {
                                                                            errorBox.innerText = '❌ Por favor, digite um número de cartão válido.';
                                                                            errorBox.style.display = 'block';
                                                                            return false;
                                                                        }
                                                                        if (exp.length < 4) {
                                                                            errorBox.innerText = '❌ Por favor, digite a data de vencimento no formato MM/AA.';
                                                                            errorBox.style.display = 'block';
                                                                            return false;
                                                                        }
                                                                        if (cvv.length < 3) {
                                                                            errorBox.innerText = '❌ Por favor, digite o código de segurança (CVV).';
                                                                            errorBox.style.display = 'block';
                                                                            return false;
                                                                        }
                                                                        if (doc.length < 11) {
                                                                            errorBox.innerText = '❌ Por favor, digite um CPF válido.';
                                                                            errorBox.style.display = 'block';
                                                                            return false;
                                                                        }

                                                                        var month = exp.substring(0, 2);
                                                                        var year = '20' + exp.substring(2, 4);

                                                                        loadingBox.style.display = 'block';
                                                                        btnSubmit.disabled = true;

                                                                        // Tokenização criptografada via API oficial Mercado Pago usando a Public Key
                                                                        var tokenPayload = {
                                                                            card_number: rawCard,
                                                                            expiration_month: parseInt(month, 10),
                                                                            expiration_year: parseInt(year, 10),
                                                                            security_code: cvv,
                                                                            cardholder: {
                                                                                name: holder,
                                                                                identification: {
                                                                                    type: 'CPF',
                                                                                    number: doc
                                                                                }
                                                                            }
                                                                        };

                                                                        fetch('https://api.mercadopago.com/v1/card_tokens?public_key=' + MP_PUBLIC_KEY, {
                                                                            method: 'POST',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify(tokenPayload)
                                                                        })
                                                                        .then(response => response.json())
                                                                        .then(data => {
                                                                            if (data.id) {
                                                                                document.getElementById('mp_card_token').value = data.id;
                                                                                document.getElementById('card_number').value = '';
                                                                                document.getElementById('card_cvv').value = '';
                                                                                document.getElementById('card_payment_form').submit();
                                                                            } else {
                                                                                loadingBox.style.display = 'none';
                                                                                btnSubmit.disabled = false;
                                                                                var errReason = 'Não foi possível validar os dados do cartão.';
                                                                                if (data.cause && data.cause[0] && data.cause[0].description) {
                                                                                    errReason = data.cause[0].description;
                                                                                } else if (data.message) {
                                                                                    errReason = data.message;
                                                                                }
                                                                                errorBox.innerText = '❌ Erro na criptografia do cartão: ' + errReason;
                                                                                errorBox.style.display = 'block';
                                                                            }
                                                                        })
                                                                        .catch(err => {
                                                                            loadingBox.style.display = 'none';
                                                                            btnSubmit.disabled = false;
                                                                            errorBox.innerText = '❌ Erro de comunicação com o Mercado Pago. Tente novamente.';
                                                                            errorBox.style.display = 'block';
                                                                        });

                                                                        return false;
                                                                    }
                                                                    </script>

                                                                <?php endif; ?>

                                                                <?php endif; ?>

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<?php elseif (isset($_POST['accept_terms']) || isset($_GET['accepted'])): ?>

<!-- TELA 2: SELEÇÃO DE MÉTODO E PACOTE DE NOSLEIRACOINS -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer rules-caption-inner">
            <div class="rules-green-bar-flags">
                <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" style="cursor: pointer;" />
                <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" style="cursor: pointer;" />
            </div>
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">DONATE</div>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
    
    <table class="Table3" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <div class="InnerTableContainer">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight: 800; font-size: 18px; padding: 12px 18px; font-family: 'Cinzel', serif; color: #2d1000; text-shadow: 0 1px 1px rgba(255,255,255,0.6);">
                                                                <div style="display: flex; align-items: center; gap: 12px;">
                                                                    <img src="<?php echo BASE_URL; ?>images/payment/card_pix_hd.png" alt="Método de Pagamento" style="height: 44px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.25)); object-fit: contain;">
                                                                    <span style="letter-spacing: 0.5px;">Método de Pagamento</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 14px; text-align: center;">
                                                                <style>
                                                                    @keyframes pulseGlow {
                                                                        0% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.7); transform: scale(1); }
                                                                        50% { box-shadow: 0 0 12px 3px rgba(245, 158, 11, 0.8); transform: scale(1.04); }
                                                                        100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0); transform: scale(1); }
                                                                    }
                                                                    .bonus-badge-blink {
                                                                        animation: pulseGlow 1.5s infinite;
                                                                        background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%) !important;
                                                                        color: #ffffff !important;
                                                                        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                                                                    }
                                                                    .payment-card {
                                                                        position: relative;
                                                                        background: linear-gradient(180deg, #4b5f7b 0%, #36465c 100%);
                                                                        border: 2px solid #141c28;
                                                                        box-shadow: inset 0 0 0 1px #6f86a6;
                                                                        border-radius: 4px;
                                                                        padding: 8px 6px;
                                                                        width: 148px;
                                                                        box-sizing: border-box;
                                                                        text-align: center;
                                                                        cursor: pointer;
                                                                        transition: all 0.2s ease-in-out;
                                                                        user-select: none;
                                                                    }
                                                                    .payment-card:hover {
                                                                        transform: translateY(-2px);
                                                                        box-shadow: 0 4px 10px rgba(0,0,0,0.3), inset 0 0 0 1px #8da6cb;
                                                                    }
                                                                    .payment-card.selected {
                                                                        border-color: #22c55e !important;
                                                                        box-shadow: 0 0 0 2px #4ade80, inset 0 0 0 1px #86efac !important;
                                                                    }
                                                                    .card-check-icon {
                                                                        display: none;
                                                                        position: absolute;
                                                                        top: -8px;
                                                                        right: -8px;
                                                                        width: 22px;
                                                                        height: 22px;
                                                                        background: #22c55e;
                                                                        color: #ffffff;
                                                                        border: 2px solid #ffffff;
                                                                        border-radius: 50%;
                                                                        text-align: center;
                                                                        line-height: 18px;
                                                                        font-weight: 800;
                                                                        font-size: 13px;
                                                                        box-shadow: 0 2px 5px rgba(0,0,0,0.4);
                                                                        z-index: 20;
                                                                    }
                                                                    .payment-card.selected .card-check-icon {
                                                                        display: block;
                                                                    }
                                                                    .nosleira-custom-select-wrap {
                                                                        position: relative;
                                                                        flex: 1;
                                                                        min-width: 280px;
                                                                        max-width: 440px;
                                                                        font-family: 'Inter', Arial, sans-serif;
                                                                    }
                                                                    .nosleira-select-trigger {
                                                                        padding: 8px 14px;
                                                                        font-size: 13px;
                                                                        font-weight: 600;
                                                                        color: #2b1704;
                                                                        background: linear-gradient(180deg, #ffffff 0%, #f4e8d7 100%);
                                                                        border: 1px solid #a0825a;
                                                                        border-radius: 4px;
                                                                        box-shadow: inset 0 1px 2px rgba(0,0,0,0.08);
                                                                        cursor: pointer;
                                                                        display: flex;
                                                                        align-items: center;
                                                                        justify-content: space-between;
                                                                        user-select: none;
                                                                        transition: border-color 0.2s, box-shadow 0.2s;
                                                                    }
                                                                    .nosleira-select-trigger:hover, .nosleira-select-trigger.active {
                                                                        border-color: #78350f !important;
                                                                        box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.25) !important;
                                                                    }
                                                                    .nosleira-select-dropdown {
                                                                        position: absolute;
                                                                        top: calc(100% + 4px);
                                                                        left: 0;
                                                                        right: 0;
                                                                        background: #ffffff;
                                                                        border: 1px solid #a0825a;
                                                                        border-radius: 4px;
                                                                        box-shadow: 0 8px 22px rgba(0,0,0,0.22);
                                                                        z-index: 1000;
                                                                        max-height: 270px;
                                                                        overflow-y: auto;
                                                                        display: none;
                                                                    }
                                                                    .nosleira-select-item {
                                                                        padding: 8px 12px;
                                                                        font-size: 13px;
                                                                        font-weight: 600;
                                                                        color: #2b1704;
                                                                        cursor: pointer;
                                                                        display: flex;
                                                                        align-items: center;
                                                                        border-bottom: 1px solid #f3ebe0;
                                                                        transition: background 0.15s ease, color 0.15s ease;
                                                                    }
                                                                    .nosleira-select-item:last-child {
                                                                        border-bottom: none;
                                                                    }
                                                                    .nosleira-select-item:hover {
                                                                        background: #fef7ec !important;
                                                                        color: #92400e !important;
                                                                    }
                                                                    .nosleira-select-item.selected {
                                                                        background: #faecd8 !important;
                                                                        font-weight: 700 !important;
                                                                    }
                                                                    .nosleira-price-val {
                                                                        color: #047857 !important;
                                                                        font-weight: 800 !important;
                                                                    }
                                                                    .nosleira-coins-val {
                                                                        color: #ea580c !important;
                                                                        font-weight: 800 !important;
                                                                    }
                                                                    @keyframes badgeBlink {
                                                                        0%, 100% {
                                                                            opacity: 1;
                                                                            transform: scale(1);
                                                                        }
                                                                        50% {
                                                                            opacity: 0.3;
                                                                            transform: scale(0.96);
                                                                        }
                                                                    }
                                                                    .badge-blink {
                                                                        display: inline-block;
                                                                        animation: badgeBlink 1s infinite ease-in-out;
                                                                    }
                                                                    .btn-donate-continue-action {
                                                                        min-width: 220px;
                                                                        justify-content: center;
                                                                        padding: 9px 32px;
                                                                        font-weight: 800;
                                                                        font-size: 14px;
                                                                        letter-spacing: 0.5px;
                                                                        font-family: 'Cinzel', serif;
                                                                        cursor: pointer;
                                                                        background: linear-gradient(180deg, #22c55e 0%, #15803d 100%);
                                                                        color: #ffffff;
                                                                        border: 1px solid #14532d;
                                                                        border-radius: 4px;
                                                                        box-shadow: 0 3px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35);
                                                                        text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                                                                        display: inline-flex;
                                                                        align-items: center;
                                                                        gap: 8px;
                                                                        transition: all 0.2s ease;
                                                                    }
                                                                    .btn-donate-continue-action:hover {
                                                                        filter: brightness(1.12);
                                                                        transform: translateY(-1px);
                                                                        box-shadow: 0 5px 12px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.5) !important;
                                                                    }
                                                                    .btn-donate-continue-action:active {
                                                                        filter: brightness(0.95);
                                                                        transform: translateY(1px);
                                                                    }
                                                                </style>

                                                                <!-- Container escuro estilo Tibia -->
                                                                <div style="background-color: #2b394a; border: 2px solid #141c28; box-shadow: inset 0 0 0 1px #4e647f; border-radius: 4px; padding: 10px 8px;">
                                                                    <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                                                                        <!-- Card Cartão de Crédito -->
                                                                        <div class="payment-card <?php echo ($payment_method === 'stripe' || $payment_method === 'credit_card' || $action === 'process_card') ? 'selected' : ''; ?>" data-method="stripe" onclick="selectPaymentMethod('stripe', this)">
                                                                            <div class="card-check-icon">✓</div>
                                                                            <div style="height: 58px; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #141c28; border-radius: 3px; overflow: hidden; margin-bottom: 6px; padding: 4px;">
                                                                                <img src="<?php echo BASE_URL; ?>images/payment/stripe_cards_hd.png" alt="Cartões de Crédito" style="max-width: 98%; max-height: 94%; object-fit: contain;">
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 5px 2px; margin-bottom: 5px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #ffffff; font-weight: 700; font-size: 13px; font-family: Arial, sans-serif;">Cartão de Crédito</span>
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 6px 2px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #a0b3c6; font-size: 11px; font-family: Arial, sans-serif; display: block;">Usual Process Time:</span>
                                                                                <span style="color: #ffffff; font-weight: 600; font-size: 12px; font-family: Arial, sans-serif; display: block; margin-top: 2px;">Instant</span>
                                                                            </div>
                                                                        </div>

                                                                        <!-- Card PIX -->
                                                                        <div class="payment-card <?php echo ($payment_method === 'pix') ? 'selected' : ''; ?>" data-method="pix" onclick="selectPaymentMethod('pix', this)">
                                                                            <div class="card-check-icon">✓</div>
                                                                            <div style="height: 58px; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #141c28; border-radius: 3px; overflow: hidden; margin-bottom: 6px; padding: 4px;">
                                                                                <img src="<?php echo BASE_URL; ?>images/payment/pix_official.png" alt="PIX Oficial" style="max-width: 95%; max-height: 90%; object-fit: contain;">
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 5px 2px; margin-bottom: 5px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #ffffff; font-weight: 700; font-size: 13px; font-family: Arial, sans-serif;">PIX</span>
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 6px 2px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #a0b3c6; font-size: 11px; font-family: Arial, sans-serif; display: block;">Usual Process Time:</span>
                                                                                <span style="color: #ffffff; font-weight: 600; font-size: 12px; font-family: Arial, sans-serif; display: block; margin-top: 2px;">Instant</span>
                                                                            </div>
                                                                        </div>

                                                                        <!-- Card Tibia Coins -->
                                                                        <div class="payment-card <?php echo ($payment_method === 'tibia_coins') ? 'selected' : ''; ?>" data-method="tibia_coins" onclick="selectPaymentMethod('tibia_coins', this)">
                                                                            <div class="card-check-icon">✓</div>
                                                                            <div style="height: 58px; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #141c28; border-radius: 3px; overflow: hidden; margin-bottom: 6px; padding: 4px;">
                                                                                <img src="<?php echo BASE_URL; ?>images/payment/tibia_coins_hd.png" alt="Tibia Coins" style="max-width: 95%; max-height: 90%; object-fit: contain;">
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 5px 2px; margin-bottom: 5px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #ffffff; font-weight: 700; font-size: 13px; font-family: Arial, sans-serif;">Tibia Coins</span>
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 6px 2px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #a0b3c6; font-size: 11px; font-family: Arial, sans-serif; display: block;">Usual Process Time:</span>
                                                                                <span style="color: #ffffff; font-weight: 600; font-size: 12px; font-family: Arial, sans-serif; display: block; margin-top: 2px;">1 dia a 24 horas</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <!-- Nota de Rodapé Estilizada -->
                                                                <div style="background: linear-gradient(180deg, #fbf7ee 0%, #f3e5d0 100%); border: 1px solid #cbb291; border-left: 4px solid #d97706; border-radius: 4px; padding: 10px 14px; margin-top: 10px; font-size: 12px; color: #5a422b; text-align: left; display: flex; align-items: center; gap: 8px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.05);">
                                                                    <span style="font-size: 16px;">ℹ️</span>
                                                                    <span><b>Atenção:</b> Por favor, note que preços, prazos e bônus podem variar dependendo do seu método de pagamento selecionado.</span>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight: bold; font-size: 16px; padding: 10px 16px; font-family: 'Cinzel', serif; color: #3d1c02; text-shadow: 0 1px 0 rgba(255,255,255,0.4);">
                                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                                    <div style="background: linear-gradient(180deg, #f59e0b 0%, #b45309 100%); color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 12px; border: 1px solid #78350f; box-shadow: 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4); display: flex; align-items: center; gap: 4px;">
                                                                         <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="NosleiraCoin" style="height: 16px; width: 16px; vertical-align: middle;">
                                                                        <span style="font-weight: 800; letter-spacing: 0.5px;">MOEDA VIRTUAL</span>
                                                                    </div>
                                                                    <span>Pacote de <b style="color: #b45309; font-size: 17px; text-shadow: 0 1px 1px rgba(255,255,255,0.6);">NosleiraCoins</b></span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px;">
                                                                <!-- Banner Promocional de Bônus (Exclusivo PIX) -->
                                                                <div id="bonus_promo_banner" style="background: linear-gradient(90deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #10b981; border-left: 4px solid #059669; border-radius: 5px; padding: 10px 14px; margin-bottom: 14px; display: <?php echo ($payment_method === 'pix') ? 'flex' : 'none'; ?>; align-items: center; justify-content: space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                                                                    <div style="display: flex; align-items: center; gap: 8px;">
                                                                        <span style="font-size: 20px;">⚡</span>
                                                                        <div>
                                                                            <span style="font-weight: 800; font-size: 13px; color: #065f46;">BENEFÍCIO EXCLUSIVO PIX:</span>
                                                                            <span style="font-size: 12px; color: #047857; margin-left: 4px;">Pagamentos via <b>PIX</b> contam com <b>5% de desconto automático</b> em todos os pacotes!</span>
                                                                        </div>
                                                                    </div>
                                                                    <span class="badge-blink" style="font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.5px; background: #059669; color: #ffffff; border: 1px solid #047857; white-space: nowrap;">5% DE DESCONTO</span>
                                                                </div>

                                                                <form action="?subtopic=donate&action=checkout" method="post" style="display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; margin: 8px 0;">
                                                                    <input type="hidden" name="accept_terms" value="1">
                                                                    <input type="hidden" id="payment_method_input" name="payment_method" value="<?php echo htmlspecialchars($payment_method); ?>">
                                                                    
                                                                    <div style="display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; width: 100%;">
                                                                        <label style="font-weight: 700; font-size: 13px; color: #4a1c00; font-family: 'Cinzel', serif; white-space: nowrap;">
                                                                            Selecione o pacote de <span style="color: #ea580c; font-weight: 800;">NosleiraCoins</span>:
                                                                        </label>

                                                                        <!-- Select nativo em segundo plano para envio de formulário padrão -->
                                                                        <select id="points_package_select" name="points_package" style="display: none;">
                                                                            <?php if ($payment_method === 'tibia_coins'): ?>
                                                                                <option value="50" <?php echo ($points_package == '50') ? 'selected' : ''; ?>>250 TC ➔ 50 NosleiraCoins (taxa de 5% inclusa)</option>
                                                                                <option value="100" <?php echo ($points_package == '100') ? 'selected' : ''; ?>>500 TC ➔ 100 NosleiraCoins (taxa de 5% inclusa)</option>
                                                                                <option value="200" <?php echo ($points_package == '200') ? 'selected' : ''; ?>>1.000 TC ➔ 200 NosleiraCoins (taxa de 5% inclusa)</option>
                                                                                <option value="500" <?php echo ($points_package == '500') ? 'selected' : ''; ?>>2.500 TC ➔ 500 NosleiraCoins (taxa de 5% inclusa)</option>
                                                                            <?php elseif ($payment_method === 'pix'): ?>
                                                                                <option value="25">R$ 23,75 - 25 NosleiraCoins (5% de desconto no PIX)</option>
                                                                                <option value="50">R$ 47,50 - 50 NosleiraCoins (5% de desconto no PIX)</option>
                                                                                <option value="75">R$ 71,25 - 75 NosleiraCoins (5% de desconto no PIX)</option>
                                                                                <option value="100">R$ 95,00 - 100 NosleiraCoins (5% de desconto no PIX)</option>
                                                                                <option value="150">R$ 142,50 - 150 NosleiraCoins (5% de desconto no PIX)</option>
                                                                                <option value="200">R$ 190,00 - 200 NosleiraCoins (5% de desconto no PIX)</option>
                                                                                <option value="250">R$ 237,50 - 250 NosleiraCoins (5% de desconto no PIX)</option>
                                                                                <option value="500">R$ 475,00 - 500 NosleiraCoins (5% de desconto no PIX)</option>
                                                                                <option value="1000">R$ 950,00 - 1.000 NosleiraCoins (5% de desconto no PIX)</option>
                                                                            <?php else: ?>
                                                                                <option value="25">R$ 25,00 - 25 NosleiraCoins</option>
                                                                                <option value="50">R$ 50,00 - 50 NosleiraCoins</option>
                                                                                <option value="75">R$ 75,00 - 75 NosleiraCoins</option>
                                                                                <option value="100">R$ 100,00 - 100 NosleiraCoins</option>
                                                                                <option value="150">R$ 150,00 - 150 NosleiraCoins</option>
                                                                                <option value="200">R$ 200,00 - 200 NosleiraCoins</option>
                                                                                <option value="250">R$ 250,00 - 250 NosleiraCoins</option>
                                                                                <option value="500">R$ 500,00 - 500 NosleiraCoins</option>
                                                                                <option value="1000">R$ 1.000,00 - 1000 NosleiraCoins</option>
                                                                            <?php endif; ?>
                                                                        </select>

                                                                        <!-- Dropdown Personalizado Profissional com Ícone Oficial Golden N NosleiraCoin -->
                                                                        <div class="nosleira-custom-select-wrap" id="nosleira_select_wrap">
                                                                            <div id="nosleira_select_trigger" class="nosleira-select-trigger" onclick="toggleNosleiraDropdown(event)">
                                                                                <div id="nosleira_select_display" style="display: flex; align-items: center; gap: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                                                                    <!-- Conteúdo renderizado pelo JS -->
                                                                                </div>
                                                                                <span id="nosleira_select_arrow" style="font-size: 10px; color: #78350f; margin-left: 8px; transition: transform 0.2s ease;">▼</span>
                                                                            </div>
                                                                            <div id="nosleira_select_dropdown" class="nosleira-select-dropdown">
                                                                                <!-- Opções renderizadas pelo JS -->
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <!-- Botão Continuar Centralizado -->
                                                                    <div style="width: 100%; display: flex; justify-content: center; margin-top: 4px;">
                                                                        <button type="submit" class="btn-donate-continue-action">
                                                                            <span>Continuar</span>
                                                                            <span style="font-size: 14px; font-weight: bold; margin-left: 4px;">➔</span>
                                                                        </button>
                                                                    </div>
                                                                </form>

                                                                <script type="text/javascript">
                                                                var nosleiraCoinSvgUrl = '<?php echo BASE_URL; ?>images/nosleira_coin.svg';

                                                                var nosleiraPackages = {
                                                                    'tibia_coins': [
                                                                        { value: '50',  lead: '250 TC ➔ 50 NosleiraCoins',   note: 'taxa de 5% inclusa' },
                                                                        { value: '100', lead: '500 TC ➔ 100 NosleiraCoins',  note: 'taxa de 5% inclusa' },
                                                                        { value: '200', lead: '1.000 TC ➔ 200 NosleiraCoins', note: 'taxa de 5% inclusa' },
                                                                        { value: '500', lead: '2.500 TC ➔ 500 NosleiraCoins', note: 'taxa de 5% inclusa' }
                                                                    ],
                                                                    'pix': [
                                                                        { value: '25',   lead: 'R$ 23,75 ➔ 25 NosleiraCoins',   note: '5% de desconto no PIX' },
                                                                        { value: '50',   lead: 'R$ 47,50 ➔ 50 NosleiraCoins',   note: '5% de desconto no PIX' },
                                                                        { value: '75',   lead: 'R$ 71,25 ➔ 75 NosleiraCoins',   note: '5% de desconto no PIX' },
                                                                        { value: '100',  lead: 'R$ 95,00 ➔ 100 NosleiraCoins',  note: '5% de desconto no PIX' },
                                                                        { value: '150',  lead: 'R$ 142,50 ➔ 150 NosleiraCoins', note: '5% de desconto no PIX' },
                                                                        { value: '200',  lead: 'R$ 190,00 ➔ 200 NosleiraCoins', note: '5% de desconto no PIX' },
                                                                        { value: '250',  lead: 'R$ 237,50 ➔ 250 NosleiraCoins', note: '5% de desconto no PIX' },
                                                                        { value: '500',  lead: 'R$ 475,00 ➔ 500 NosleiraCoins', note: '5% de desconto no PIX' },
                                                                        { value: '1000', lead: 'R$ 950,00 ➔ 1.000 NosleiraCoins', note: '5% de desconto no PIX' }
                                                                    ],
                                                                    'stripe': [
                                                                        { value: '25',   lead: 'R$ 25,00 ➔ 25 NosleiraCoins',   note: '' },
                                                                        { value: '50',   lead: 'R$ 50,00 ➔ 50 NosleiraCoins',   note: '' },
                                                                        { value: '75',   lead: 'R$ 75,00 ➔ 75 NosleiraCoins',   note: '' },
                                                                        { value: '100',  lead: 'R$ 100,00 ➔ 100 NosleiraCoins', note: '' },
                                                                        { value: '150',  lead: 'R$ 150,00 ➔ 150 NosleiraCoins', note: '' },
                                                                        { value: '200',  lead: 'R$ 200,00 ➔ 200 NosleiraCoins', note: '' },
                                                                        { value: '250',  lead: 'R$ 250,00 ➔ 250 NosleiraCoins', note: '' },
                                                                        { value: '500',  lead: 'R$ 500,00 ➔ 500 NosleiraCoins', note: '' },
                                                                        { value: '1000', lead: 'R$ 1.000,00 ➔ 1000 NosleiraCoins', note: '' }
                                                                    ]
                                                                };

                                                                function formatNosleiraItemHtml(item) {
                                                                    var coinIcon = '<img src="' + nosleiraCoinSvgUrl + '" alt="N" style="height: 16px; width: 16px; vertical-align: middle; margin: 0 4px 1px 4px; display: inline-block;">';
                                                                    var noteBadge = '';
                                                                    if (item.note) {
                                                                        if (item.note.indexOf('+20%') !== -1) {
                                                                            noteBadge = ' <span style="font-size: 11px; font-weight: 800; color: #9a3412; background: #ffedd5; border: 1px solid #ea580c; padding: 1px 6px; border-radius: 4px; margin-left: 6px;">' + item.note + '</span>';
                                                                        } else {
                                                                            noteBadge = ' <span style="font-size: 11px; font-weight: 700; color: #047857; background: #ecfdf5; border: 1px solid #10b981; padding: 1px 6px; border-radius: 4px; margin-left: 6px;">(' + item.note + ')</span>';
                                                                        }
                                                                    }
                                                                    var formattedLead = item.lead.replace(/(R\$\s*[\d\.,]+)/g, '<span class="nosleira-price-val" style="color: #047857; font-weight: 800;">$1</span>');
                                                                    formattedLead = formattedLead.replace(/([\d\.,]+\s*NosleiraCoins)/g, '<span class="nosleira-coins-val" style="color: #ea580c; font-weight: 800;">$1</span>');
                                                                    return '<span style="white-space: nowrap;">' + formattedLead + '</span>' + coinIcon + noteBadge;
                                                                }

                                                                function toggleNosleiraDropdown(e) {
                                                                    if (e) e.stopPropagation();
                                                                    var dropdown = document.getElementById('nosleira_select_dropdown');
                                                                    var arrow = document.getElementById('nosleira_select_arrow');
                                                                    var trigger = document.getElementById('nosleira_select_trigger');
                                                                    if (!dropdown) return;
                                                                    var isOpen = dropdown.style.display === 'block';
                                                                    dropdown.style.display = isOpen ? 'none' : 'block';
                                                                    if (arrow) arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                                                                    if (trigger) {
                                                                        if (isOpen) trigger.classList.remove('active');
                                                                        else trigger.classList.add('active');
                                                                    }
                                                                }

                                                                function selectNosleiraPackage(val, method, htmlContent) {
                                                                    var nativeSelect = document.getElementById('points_package_select');
                                                                    if (nativeSelect) {
                                                                        nativeSelect.value = val;
                                                                    }
                                                                    var display = document.getElementById('nosleira_select_display');
                                                                    if (display) {
                                                                        display.innerHTML = htmlContent;
                                                                    }
                                                                    document.querySelectorAll('.nosleira-select-item').forEach(function(el) {
                                                                        if (el.getAttribute('data-value') === String(val)) {
                                                                            el.classList.add('selected');
                                                                        } else {
                                                                            el.classList.remove('selected');
                                                                        }
                                                                    });
                                                                    var dropdown = document.getElementById('nosleira_select_dropdown');
                                                                    var arrow = document.getElementById('nosleira_select_arrow');
                                                                    var trigger = document.getElementById('nosleira_select_trigger');
                                                                    if (dropdown) dropdown.style.display = 'none';
                                                                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                                                                    if (trigger) trigger.classList.remove('active');
                                                                }

                                                                function renderNosleiraCustomSelect(method, selectedVal) {
                                                                    var list = nosleiraPackages[method] || nosleiraPackages['stripe'];
                                                                    var nativeSelect = document.getElementById('points_package_select');
                                                                    var dropdown = document.getElementById('nosleira_select_dropdown');
                                                                    var display = document.getElementById('nosleira_select_display');

                                                                    if (!list || !dropdown) return;

                                                                    var exists = list.some(function(item) { return item.value === String(selectedVal); });
                                                                    if (!selectedVal || !exists) {
                                                                        selectedVal = list[0].value;
                                                                    }

                                                                    if (nativeSelect) {
                                                                        var optionsHtml = '';
                                                                        list.forEach(function(item) {
                                                                            var rawText = item.lead + (item.note ? ' (' + item.note + ')' : '');
                                                                            optionsHtml += '<option value="' + item.value + '"' + (item.value === selectedVal ? ' selected' : '') + '>' + rawText + '</option>';
                                                                        });
                                                                        nativeSelect.innerHTML = optionsHtml;
                                                                        nativeSelect.value = selectedVal;
                                                                    }

                                                                    var dropdownHtml = '';
                                                                    var activeHtml = '';
                                                                    list.forEach(function(item) {
                                                                        var itemHtml = formatNosleiraItemHtml(item);
                                                                        var isSelected = (item.value === selectedVal);
                                                                        if (isSelected) {
                                                                            activeHtml = itemHtml;
                                                                        }
                                                                        dropdownHtml += '<div class="nosleira-select-item' + (isSelected ? ' selected' : '') + '" data-value="' + item.value + '" onclick="selectNosleiraPackage(\'' + item.value + '\', \'' + method + '\', this.innerHTML)">' + itemHtml + '</div>';
                                                                    });

                                                                    dropdown.innerHTML = dropdownHtml;
                                                                    if (display) {
                                                                        display.innerHTML = activeHtml || formatNosleiraItemHtml(list[0]);
                                                                    }
                                                                }

                                                                document.addEventListener('click', function(e) {
                                                                    var wrap = document.getElementById('nosleira_select_wrap');
                                                                    var dropdown = document.getElementById('nosleira_select_dropdown');
                                                                    var arrow = document.getElementById('nosleira_select_arrow');
                                                                    var trigger = document.getElementById('nosleira_select_trigger');
                                                                    if (wrap && !wrap.contains(e.target)) {
                                                                        if (dropdown) dropdown.style.display = 'none';
                                                                        if (arrow) arrow.style.transform = 'rotate(0deg)';
                                                                        if (trigger) trigger.classList.remove('active');
                                                                    }
                                                                });

                                                                function selectPaymentMethod(method, el) {
                                                                    document.querySelectorAll('.payment-card').forEach(function(card) {
                                                                        card.classList.remove('selected');
                                                                        if (card.getAttribute('data-method') === method) {
                                                                            card.classList.add('selected');
                                                                        }
                                                                    });

                                                                    var input = document.getElementById('payment_method_input');
                                                                    if (input) {
                                                                        input.value = method;
                                                                    }

                                                                    var banner = document.getElementById('bonus_promo_banner');
                                                                    if (banner) {
                                                                        banner.style.display = (method === 'pix') ? 'flex' : 'none';
                                                                    }

                                                                    renderNosleiraCustomSelect(method);

                                                                    var tabMap = {
                                                                        'stripe': 'tab_stripe',
                                                                        'pix': 'tab_pix',
                                                                        'tibia_coins': 'tab_tibia_coins'
                                                                    };
                                                                    var targetTab = tabMap[method];
                                                                    if (targetTab && typeof syncHistoryTabOnly === 'function') {
                                                                        syncHistoryTabOnly(targetTab);
                                                                    }
                                                                }

                                                                // Inicialização no carregamento
                                                                if (document.readyState === 'loading') {
                                                                    document.addEventListener('DOMContentLoaded', function() {
                                                                        var curMethod = '<?php echo htmlspecialchars($payment_method); ?>';
                                                                        var curPkg = '<?php echo htmlspecialchars($points_package); ?>';
                                                                        renderNosleiraCustomSelect(curMethod, curPkg);
                                                                    });
                                                                } else {
                                                                    var curMethod = '<?php echo htmlspecialchars($payment_method); ?>';
                                                                    var curPkg = '<?php echo htmlspecialchars($points_package); ?>';
                                                                    renderNosleiraCustomSelect(curMethod, curPkg);
                                                                }
                                                                </script>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<br>

<!-- SEÇÃO DE HISTÓRICO DE DOAÇÕES DA CONTA (APENAS NA TELA 2 DE SELEÇÃO DE MÉTODO) -->
<div class="TableContainer">
    <div class="CaptionContainer">
        <div class="CaptionInnerContainer rules-caption-inner">
            <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <div class="Text">HISTÓRICO DE DOAÇÕES</div>
            <span id="history_toggle_btn" onclick="toggleDonationHistoryBox()" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #ffffff; font-weight: bold; font-size: 11.5px; background: rgba(0,0,0,0.35); padding: 3px 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.4); user-select: none;">[ + ] Expandir</span>
            <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
            <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
            <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
        </div>
    </div>
    
    <div id="donation_history_collapsible_content" style="display: none;">
    <table class="Table3" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <div class="InnerTableContainer">
                        <table style="width:100%;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                            <div class="TableContentContainer">
                                                <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                    <tbody>
                                                        <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                            <td style="font-weight: bold; font-size: 14px; padding: 10px 14px; font-family: 'Cinzel', serif; color: #3d1c02;">
                                                                Histórico de Pedidos da Conta
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 16px;">

                                                                 <?php if ($acc_id > 0): ?>

                                                                 <?php
                                                                 $active_history_tab = 'tab_stripe';
                                                                 if ($payment_method === 'pix') {
                                                                     $active_history_tab = 'tab_pix';
                                                                 } elseif ($payment_method === 'tibia_coins') {
                                                                     $active_history_tab = 'tab_tibia_coins';
                                                                 }
                                                                 ?>

                                                                 <div class="history-tabs-nav">
                                                                     <button type="button" class="history-tab-btn <?php echo $active_history_tab === 'tab_stripe' ? 'active' : ''; ?>" data-tab="tab_stripe" onclick="openHistoryTab('tab_stripe', this)">💳 Cartão de Crédito</button>
                                                                     <button type="button" class="history-tab-btn <?php echo $active_history_tab === 'tab_pix' ? 'active' : ''; ?>" data-tab="tab_pix" onclick="openHistoryTab('tab_pix', this)">⚡ PIX</button>
                                                                     <button type="button" class="history-tab-btn <?php echo $active_history_tab === 'tab_tibia_coins' ? 'active' : ''; ?>" data-tab="tab_tibia_coins" onclick="openHistoryTab('tab_tibia_coins', this)"><img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="N" style="height: 15px; width: 15px; vertical-align: middle; margin-right: 4px;">Tibia Coins</button>
                                                                 </div>

                                                                 <!-- ABA CARTÃO DE CRÉDITO -->
                                                                 <div id="tab_stripe" class="history-tab-content <?php echo $active_history_tab === 'tab_stripe' ? 'active' : ''; ?>" style="display: <?php echo $active_history_tab === 'tab_stripe' ? 'block' : 'none'; ?>;">
                                                                     <?php
                                                                     $stripe_donations = $db->query("SELECT * FROM `myaac_donations` WHERE (`account_id` = " . (int)$acc_id . " OR `account_name` = " . $db->quote($acc_name) . ") AND `payment_method` = 'stripe' ORDER BY `id` DESC LIMIT 20")->fetchAll();
                                                                     if (!empty($stripe_donations)):
                                                                     ?>
                                                                     <div class="history-table-wrapper">
                                                                         <table width="100%" style="border-collapse: collapse; font-size: 12px; font-family: 'Inter', sans-serif;">
                                                                             <thead>
                                                                                 <tr style="background: linear-gradient(180deg, #5c3d1a 0%, #3a2208 100%); color: #f5e6c8; font-weight: 700; border-bottom: 2px solid #d4a853; font-family: 'Cinzel', serif; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                                                                                     <th style="padding: 10px 8px; text-align: center; width: 50px; white-space: nowrap;">Ref #</th>
                                                                                     <th style="padding: 10px 8px; text-align: center; width: 110px; white-space: nowrap;">Data</th>
                                                                                     <th style="padding: 10px 10px; text-align: left; width: 160px; white-space: nowrap;">Pacote</th>
                                                                                     <th style="padding: 10px 8px; text-align: center; width: 100px; white-space: nowrap;">Valor</th>
                                                                                     <th style="padding: 10px 8px; text-align: center; width: 110px; white-space: nowrap;">Status</th>
                                                                                 </tr>
                                                                             </thead>
                                                                             <tbody>
                                                                                 <?php foreach ($stripe_donations as $don): ?>
                                                                                 <tr style="border-bottom: 1px solid #e2d2bc; background: rgba(255,255,255,0.7); vertical-align: middle;">
                                                                                     <td style="padding: 8px 6px; text-align: center; font-weight: 700; color: #b45309; white-space: nowrap;">#<?php echo $don['id']; ?></td>
                                                                                     <td style="padding: 8px 6px; text-align: center; color: #5a422b; white-space: nowrap; font-size: 11.5px;"><?php echo date('d/m/Y', $don['created_at']); ?><br><span style="font-size: 10.5px; color: #7a6249;"><?php echo date('H:i', $don['created_at']); ?></span></td>
                                                                                     <td style="padding: 8px 10px; font-weight: 700; color: #2b1704; white-space: nowrap;"><?php echo htmlspecialchars($don['coins']); ?> NosleiraCoins <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="N" style="height: 15px; width: 15px; vertical-align: middle; margin-left: 2px;"></td>
                                                                                     <td style="padding: 8px 6px; text-align: center; font-weight: 700; color: #00875a; white-space: nowrap;"><?php echo htmlspecialchars($don['price']); ?></td>
                                                                                     <td style="padding: 8px 6px; text-align: center; white-space: nowrap;">
                                                                                         <?php if ($don['status'] === 'completed'): ?>
                                                                                             <span class="status-badge-completed">Concluído ✅</span>
                                                                                         <?php elseif ($don['status'] === 'canceled'): ?>
                                                                                             <span class="status-badge-canceled">Cancelado ❌</span>
                                                                                         <?php else: ?>
                                                                                             <span class="status-badge-pending">Pendente ⏳</span>
                                                                                         <?php endif; ?>
                                                                                     </td>
                                                                                 </tr>
                                                                                 <?php endforeach; ?>
                                                                             </tbody>
                                                                         </table>
                                                                     </div>
                                                                     <?php else: ?>
                                                                     <p style="color: #6e543b; font-size: 13px; margin: 10px 0;">Nenhuma doação registrada via Cartão de Crédito nesta conta ainda.</p>
                                                                     <?php endif; ?>
                                                                 </div>

                                                                 <!-- ABA PIX -->
                                                                 <div id="tab_pix" class="history-tab-content <?php echo $active_history_tab === 'tab_pix' ? 'active' : ''; ?>" style="display: <?php echo $active_history_tab === 'tab_pix' ? 'block' : 'none'; ?>;">
                                                                     <?php
                                                                     $pix_donations = $db->query("SELECT * FROM `myaac_donations` WHERE (`account_id` = " . (int)$acc_id . " OR `account_name` = " . $db->quote($acc_name) . ") AND `payment_method` = 'pix' ORDER BY `id` DESC LIMIT 20")->fetchAll();
                                                                     if (!empty($pix_donations)):
                                                                     ?>
                                                                     <div class="history-table-wrapper">
                                                                         <table width="100%" style="border-collapse: collapse; font-size: 12px; font-family: 'Inter', sans-serif;">
                                                                             <thead>
                                                                                 <tr style="background: linear-gradient(180deg, #5c3d1a 0%, #3a2208 100%); color: #f5e6c8; font-weight: 700; border-bottom: 2px solid #d4a853; font-family: 'Cinzel', serif; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                                                                                     <th style="padding: 10px 8px; text-align: center; width: 50px; white-space: nowrap;">Ref #</th>
                                                                                     <th style="padding: 10px 8px; text-align: center; width: 110px; white-space: nowrap;">Data</th>
                                                                                     <th style="padding: 10px 10px; text-align: left; width: 160px; white-space: nowrap;">Pacote</th>
                                                                                     <th style="padding: 10px 8px; text-align: center; width: 100px; white-space: nowrap;">Valor</th>
                                                                                     <th style="padding: 10px 8px; text-align: center; width: 110px; white-space: nowrap;">Status</th>
                                                                                 </tr>
                                                                             </thead>
                                                                             <tbody>
                                                                                 <?php foreach ($pix_donations as $don): ?>
                                                                                 <tr style="border-bottom: 1px solid #e2d2bc; background: rgba(255,255,255,0.7); vertical-align: middle;">
                                                                                     <td style="padding: 8px 6px; text-align: center; font-weight: 700; color: #00875a; white-space: nowrap;">#<?php echo $don['id']; ?></td>
                                                                                     <td style="padding: 8px 6px; text-align: center; color: #5a422b; white-space: nowrap; font-size: 11.5px;"><?php echo date('d/m/Y', $don['created_at']); ?><br><span style="font-size: 10.5px; color: #7a6249;"><?php echo date('H:i', $don['created_at']); ?></span></td>
                                                                                     <td style="padding: 8px 10px; font-weight: 700; color: #2b1704; white-space: nowrap;"><?php echo htmlspecialchars($don['coins']); ?> NosleiraCoins <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="N" style="height: 15px; width: 15px; vertical-align: middle; margin-left: 2px;"></td>
                                                                                     <td style="padding: 8px 6px; text-align: center; font-weight: 700; color: #00875a; white-space: nowrap;"><?php echo htmlspecialchars($don['price']); ?></td>
                                                                                     <td style="padding: 8px 6px; text-align: center; white-space: nowrap;">
                                                                                         <?php if ($don['status'] === 'completed'): ?>
                                                                                             <span class="status-badge-completed">Concluído ✅</span>
                                                                                         <?php elseif ($don['status'] === 'canceled'): ?>
                                                                                             <span class="status-badge-canceled">Cancelado ❌</span>
                                                                                         <?php else: ?>
                                                                                             <span class="status-badge-pending">Pendente ⏳</span>
                                                                                         <?php endif; ?>
                                                                                     </td>
                                                                                 </tr>
                                                                                 <?php endforeach; ?>
                                                                             </tbody>
                                                                         </table>
                                                                     </div>
                                                                     <?php else: ?>
                                                                     <p style="color: #6e543b; font-size: 13px; margin: 10px 0;">Nenhuma doação registrada via PIX nesta conta ainda.</p>
                                                                     <?php endif; ?>
                                                                 </div>

                                                                 <!-- ABA TIBIA COINS -->
                                                                 <div id="tab_tibia_coins" class="history-tab-content <?php echo $active_history_tab === 'tab_tibia_coins' ? 'active' : ''; ?>" style="display: <?php echo $active_history_tab === 'tab_tibia_coins' ? 'block' : 'none'; ?>;">
                                                                     <?php
                                                                     $tc_donations = $db->query("SELECT * FROM `myaac_donations` WHERE (`account_id` = " . (int)$acc_id . " OR `account_name` = " . $db->quote($acc_name) . ") AND `payment_method` = 'tibia_coins' ORDER BY `id` DESC LIMIT 20")->fetchAll();
                                                                     if (!empty($tc_donations)):
                                                                     ?>
                                                                     <div class="history-table-wrapper">
                                                                         <table width="100%" style="border-collapse: collapse; font-size: 12px; font-family: 'Inter', sans-serif;">
                                                                             <thead>
                                                                                 <tr style="background: linear-gradient(180deg, #5c3d1a 0%, #3a2208 100%); color: #f5e6c8; font-weight: 700; border-bottom: 2px solid #d4a853; font-family: 'Cinzel', serif; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                                                                                     <th style="padding: 10px 6px; text-align: center; width: 45px; white-space: nowrap;">Ref #</th>
                                                                                     <th style="padding: 10px 6px; text-align: center; width: 100px; white-space: nowrap;">Data</th>
                                                                                     <th style="padding: 10px 8px; text-align: left; width: 140px; white-space: nowrap;">Pacote</th>
                                                                                     <th style="padding: 10px 6px; text-align: center; width: 80px; white-space: nowrap;">Valor</th>
                                                                                     <th style="padding: 10px 8px; text-align: left; width: 110px; white-space: nowrap;">Personagem</th>
                                                                                     <th style="padding: 10px 8px; text-align: left; width: 90px; white-space: nowrap;">Destino</th>
                                                                                     <th style="padding: 10px 6px; text-align: center; width: 105px; white-space: nowrap;">Status</th>
                                                                                 </tr>
                                                                             </thead>
                                                                             <tbody>
                                                                                 <?php foreach ($tc_donations as $don): ?>
                                                                                 <tr style="border-bottom: 1px solid #e2d2bc; background: rgba(255,255,255,0.7); vertical-align: middle;">
                                                                                     <td style="padding: 8px 6px; text-align: center; font-weight: 700; color: #b45309; white-space: nowrap;">#<?php echo $don['id']; ?></td>
                                                                                     <td style="padding: 8px 6px; text-align: center; color: #5a422b; white-space: nowrap; font-size: 11.5px;"><?php echo date('d/m/Y', $don['created_at']); ?><br><span style="font-size: 10.5px; color: #7a6249;"><?php echo date('H:i', $don['created_at']); ?></span></td>
                                                                                     <td style="padding: 8px; font-weight: 700; color: #2b1704; white-space: nowrap;"><?php echo htmlspecialchars($don['coins']); ?> NosleiraCoins <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="N" style="height: 15px; width: 15px; vertical-align: middle; margin-left: 2px;"></td>
                                                                                     <td style="padding: 8px 6px; text-align: center; font-weight: 700; color: #7c3aed; white-space: nowrap;"><?php echo htmlspecialchars($don['price']); ?></td>
                                                                                     <td style="padding: 8px; font-weight: 600; color: #4a1c00; white-space: nowrap;"><?php echo htmlspecialchars($don['tibia_char_name']); ?></td>
                                                                                     <td style="padding: 8px; font-weight: 700; color: #b45309; white-space: nowrap;">roxzorde</td>
                                                                                     <td style="padding: 8px 6px; text-align: center; white-space: nowrap;">
                                                                                         <?php if ($don['status'] === 'completed'): ?>
                                                                                             <span class="status-badge-completed">Entregue ✅</span>
                                                                                         <?php elseif ($don['status'] === 'canceled'): ?>
                                                                                             <span class="status-badge-canceled">Cancelado ❌</span>
                                                                                         <?php else: ?>
                                                                                             <span class="status-badge-pending">Pendente ⏳</span>
                                                                                         <?php endif; ?>
                                                                                     </td>
                                                                                 </tr>
                                                                                 <?php endforeach; ?>
                                                                             </tbody>
                                                                         </table>
                                                                     </div>
                                                                     <?php else: ?>
                                                                     <p style="color: #6e543b; font-size: 13px; margin: 10px 0;">Nenhuma doação registrada por Tibia Coins nesta conta ainda.</p>
                                                                     <?php endif; ?>
                                                                 </div>

                                                                 <script type="text/javascript">
                                                                 function toggleDonationHistoryBox() {
                                                                     var content = document.getElementById('donation_history_collapsible_content');
                                                                     var btn = document.getElementById('history_toggle_btn');
                                                                     if (!content || !btn) return;
                                                                     if (content.style.display === 'none' || content.style.display === '') {
                                                                         content.style.display = 'block';
                                                                         btn.innerText = '[ − ] Minimizar';
                                                                     } else {
                                                                         content.style.display = 'none';
                                                                         btn.innerText = '[ + ] Expandir';
                                                                     }
                                                                 }

                                                                 function syncHistoryTabOnly(tabId) {
                                                                     document.querySelectorAll('.history-tab-content').forEach(function(c) {
                                                                         c.classList.remove('active');
                                                                         c.style.display = 'none';
                                                                     });
                                                                     document.querySelectorAll('.history-tab-btn').forEach(function(b) {
                                                                         b.classList.remove('active');
                                                                         if (b.getAttribute('data-tab') === tabId) {
                                                                             b.classList.add('active');
                                                                         }
                                                                     });
                                                                     var target = document.getElementById(tabId);
                                                                     if (target) {
                                                                         target.classList.add('active');
                                                                         target.style.display = 'block';
                                                                     }
                                                                 }

                                                                 function openHistoryTab(tabId, btn) {
                                                                     syncHistoryTabOnly(tabId);

                                                                     var methodMap = {
                                                                         'tab_stripe': 'stripe',
                                                                         'tab_pix': 'pix',
                                                                         'tab_tibia_coins': 'tibia_coins'
                                                                     };
                                                                     var method = methodMap[tabId];
                                                                     if (method) {
                                                                         var card = document.querySelector('.payment-card[data-method="' + method + '"]');
                                                                         selectPaymentMethod(method, card);
                                                                     }
                                                                 }
                                                                 </script>

                                                                 <?php else: ?>
                                                                 <div style="background: linear-gradient(180deg, #fdf9f3 0%, #f5e9d6 100%); border: 1px solid #d8c6af; border-left: 4px solid #b45309; border-radius: 4px; padding: 12px 16px; color: #5a422b; font-size: 13px; font-family: 'Inter', sans-serif;">
                                                                     ℹ️ <b>Nota:</b> Faça <a href="?subtopic=accountmanagement" style="color: #b45309; font-weight: 700;">login na sua conta</a> para visualizar o seu histórico de solicitações vinculadas por método de pagamento.
                                                                 </div>
                                                                 <?php endif; ?>

                                                             </td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
                                             </div>
                                         </div>
                                     </td>
                                 </tr>
                             </tbody>
                         </table>
                     </div>
                 </td>
             </tr>
         </tbody>
     </table>
     </div>
 </div>

<?php else: ?>

<!-- TELA 1: TERMOS DE DOAÇÃO -->
<form action="?subtopic=donate" method="post">
    <div class="TableContainer">
        <div class="CaptionContainer">
            <div class="CaptionInnerContainer rules-caption-inner">
                <div class="rules-green-bar-flags">
                    <img src="<?php echo BASE_URL; ?>images/flags/br.gif" alt="Português" title="Português (BR)" class="flag-icon" onclick="changeLanguage('pt');" style="cursor: pointer;" />
                    <img src="<?php echo BASE_URL; ?>images/flags/us.gif" alt="English" title="English (US)" class="flag-icon" onclick="changeLanguage('en');" style="cursor: pointer;" />
                    <img src="<?php echo BASE_URL; ?>images/flags/es.gif" alt="Español" title="Español (ES)" class="flag-icon" onclick="changeLanguage('es');" style="cursor: pointer;" />
                    <img src="<?php echo BASE_URL; ?>images/flags/pl.gif" alt="Polski" title="Polski (PL)" class="flag-icon" onclick="changeLanguage('pl');" style="cursor: pointer;" />
                </div>
                <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
                <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
                <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
                <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
                <div class="Text">DONATE</div>
                <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
                <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
                <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
                <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            </div>
        </div>
        
        <table class="Table3" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td>
                        <div class="InnerTableContainer">
                            <table style="width:100%;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                                <div class="TableContentContainer">
                                                    <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                        <tbody>
                                                            <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                                 <td style="padding: 14px 18px; line-height: 1.65;">
                                                                     <div class="terms-main-title">
                                                                         <span>🛡️</span>
                                                                         <span>Termos e Condições de Apoio ao Projeto</span>
                                                                     </div>
                                                                     <p style="margin: 0 0 10px 0; font-family: 'Inter', sans-serif; font-size: 13.5px; color: #2b1704;">
                                                                         Antes de prosseguir, solicitamos que leia e concorde com as nossas diretrizes oficiais de apoio ao servidor.
                                                                     </p>
                                                                     <p style="margin: 0 0 10px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #3d230d;">
                                                                         Sua contribuição é fundamental para a sustentabilidade do servidor: todo o valor arrecadado é revertido diretamente na manutenção da infraestrutura, hospedagem de alta performance, proteção avançada contra ataques DDoS e no desenvolvimento contínuo de novidades.
                                                                     </p>
                                                                     <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #3d230d;">
                                                                         Como forma de agradecimento pelo seu apoio, creditaremos <strong>NosleiraCoins</strong> <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="NosleiraCoin" style="height: 17px; width: 17px; vertical-align: middle; margin: 0 2px;"> em sua conta, que podem ser utilizadas em nossa loja do jogo para adquirir itens e benefícios exclusivos para o seu personagem.
                                                                     </p>
                                                                 </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="padding: 0;">
                                                                    <div class="terms-rules-header">
                                                                        <div class="terms-rules-title">
                                                                            <span>📜</span>
                                                                            <span>Regras (Clique para expandir o detalhamento)</span>
                                                                        </div>
                                                                        <span class="terms-rules-subtitle">Clique nos tópicos abaixo para ler</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['darkborder']; ?>">
                                                                <td style="padding: 14px;">
                                                                    <!-- REGRA 1 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">1. Reembolso</span>
                                                                                    <span class="rule-accordion-brief">Você concorda plenamente que nenhum valor doado será reembolsado.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Você tem pleno consentimento de que qualquer valor de doação não será reembolsado sob nenhuma circunstância.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 2 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">2. Tempo de Entrega</span>
                                                                                    <span class="rule-accordion-brief">Os pontos são geralmente entregues automaticamente pelo sistema...</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Os pontos são geralmente entregues automaticamente pelo sistema. No entanto, se houver alguma falha ou instabilidade, temos um prazo máximo de 24 horas para que os pontos sejam entregues na sua conta.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 3 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">3. Segurança</span>
                                                                                    <span class="rule-accordion-brief">O jogador é o único responsável pela segurança dos seus dados...</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Nosso servidor possui diversos métodos de segurança, como certificado SSL, criptografia de dados e regras de senhas fortes. No entanto, a equipe não se responsabiliza pela sua conta, personagens, itens e acessos de terceiros. A segurança dos dados dentro do servidor é de total e exclusiva responsabilidade do jogador.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 4 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">4. Regras do Servidor</span>
                                                                                    <span class="rule-accordion-brief">O jogador está ciente de que deve seguir as regras do servidor.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            O jogador está ciente de que deve seguir todas as regras do servidor. Se alguma regra for quebrada, a punição apropriada será aplicada e a doação não será reembolsada, conforme descrito na primeira regra desta página.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 5 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">5. Problemas no Servidor</span>
                                                                                    <span class="rule-accordion-brief">Como este é um projeto de longo prazo, problemas podem ocorrer.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Embora este seja um projeto de longo prazo com foco na estabilidade (versão 7.4), imprevistos podem ocorrer. Em caso de qualquer problema técnico de nossa parte que resulte em perda generalizada (como rollbacks ou resets acidentais), nós possuímos backups de todos os salvamentos do servidor. Todos os pontos que tenham sido gastos ou perdidos nessas situações específicas serão devidamente restaurados.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 6 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">6. Mudanças de Balanceamento</span>
                                                                                    <span class="rule-accordion-brief">Qualquer elemento no jogo pode ser alterado e balanceado.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            O servidor busca manter a essência da versão 7.4, mas qualquer coisa no jogo pode ser alterada ou balanceada visando a saúde da comunidade. Não nos responsabilizamos por nenhuma perda no valor de itens/bens comprados, nem por qualquer outra coisa no jogo ou na loja adquirida por doações caso sofram ajustes de balanceamento.
                                                                        </div>
                                                                    </details>

                                                                    <!-- REGRA 7 -->
                                                                    <details class="rule-accordion">
                                                                        <summary>
                                                                            <div class="rule-summary-left">
                                                                                <div class="rule-icon-box">&#9660;</div>
                                                                                <div class="rule-title-group">
                                                                                    <span class="rule-accordion-title">7. Concordância</span>
                                                                                    <span class="rule-accordion-brief">Ao continuar nesta página, você concorda totalmente com os termos.</span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rule-action-badge">
                                                                                <span class="badge-text-closed">&#43; Clique para ler</span>
                                                                                <span class="badge-text-open">&#8722; Fechar</span>
                                                                            </div>
                                                                        </summary>
                                                                        <div class="rule-accordion-body">
                                                                            Ao prosseguir nesta página, você concorda integralmente que o valor enviado ao servidor é uma doação voluntária, portanto, não há vínculo com compras ou remessas comerciais por parte do servidor. Em seguida, enviaremos, como bônus por esta doação, um valor proporcional em moedas (points).
                                                                        </div>
                                                                    </details>

                                                                </td>
                                                            </tr>
                                                            <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                                <td style="padding: 24px 16px; text-align: center;">
                                                                    <div class="terms-agreement-card">
                                                                        <label class="custom-checkbox-container" for="accept_terms_checkbox">
                                                                            <input type="checkbox" name="accept_terms" value="1" required id="accept_terms_checkbox">
                                                                            <span class="custom-checkbox-checkmark"></span>
                                                                            <span class="terms-agreement-text">
                                                                                Declaro que <strong>li, compreendi e concordo integralmente</strong> com todos os <strong>Termos e Condições de Apoio ao Projeto</strong> acima descritos.
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                    <div style="margin-top: 20px;">
                                                                        <button type="submit" class="btn-donate-continue">
                                                                            <span>Concordar e Prosseguir para Doação</span>
                                                                            <span class="btn-arrow">&#10148;</span>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</form>

<?php endif; ?>
