<?php
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Donate';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
$payment_method = isset($_POST['payment_method']) ? $_POST['payment_method'] : (isset($_GET['payment_method']) ? $_GET['payment_method'] : 'pix');
$points_package = isset($_POST['points_package']) ? $_POST['points_package'] : '3';
$tibia_char_name = isset($_POST['tibia_char_name']) ? trim($_POST['tibia_char_name']) : '';

// Intenção: Estruturar detalhes e precificação dos planos oficiais de Premium Account (PA)
if (!function_exists('get_nosleira_package_details')) {
    function get_nosleira_package_details($pkg) {
        $key = (string)$pkg;
        $map = array(
            '3' => array('id' => 3, 'name' => 'PA 3 Meses', 'duration' => '90 Dias', 'price_brl' => 468.00, 'price_str' => 'R$ 468,00', 'tc' => '2.500 TC', 'coins' => 468, 'badge' => ''),
            '6' => array('id' => 6, 'name' => 'PA 6 Meses', 'duration' => '180 Dias', 'price_brl' => 872.00, 'price_str' => 'R$ 872,00', 'tc' => '5.000 TC', 'coins' => 872, 'badge' => ''),
            '12' => array('id' => 12, 'name' => 'PA 12 Meses (Anual)', 'duration' => '360 Dias', 'price_brl' => 1621.00, 'price_str' => 'R$ 1.621,00', 'tc' => '10.000 TC', 'coins' => 1621, 'badge' => 'Melhor Custo-Benefício'),
            // Compatibilidade com chaves alternativas
            '90' => array('id' => 3, 'name' => 'PA 3 Meses', 'duration' => '90 Dias', 'price_brl' => 468.00, 'price_str' => 'R$ 468,00', 'tc' => '2.500 TC', 'coins' => 468, 'badge' => ''),
            '180' => array('id' => 6, 'name' => 'PA 6 Meses', 'duration' => '180 Dias', 'price_brl' => 872.00, 'price_str' => 'R$ 872,00', 'tc' => '5.000 TC', 'coins' => 872, 'badge' => ''),
            '360' => array('id' => 12, 'name' => 'PA 12 Meses (Anual)', 'duration' => '360 Dias', 'price_brl' => 1621.00, 'price_str' => 'R$ 1.621,00', 'tc' => '10.000 TC', 'coins' => 1621, 'badge' => 'Melhor Custo-Benefício'),
            '25' => array('id' => 3, 'name' => 'PA 3 Meses', 'duration' => '90 Dias', 'price_brl' => 468.00, 'price_str' => 'R$ 468,00', 'tc' => '2.500 TC', 'coins' => 468, 'badge' => ''),
            '50' => array('id' => 3, 'name' => 'PA 3 Meses', 'duration' => '90 Dias', 'price_brl' => 468.00, 'price_str' => 'R$ 468,00', 'tc' => '2.500 TC', 'coins' => 468, 'badge' => ''),
            '100' => array('id' => 6, 'name' => 'PA 6 Meses', 'duration' => '180 Dias', 'price_brl' => 872.00, 'price_str' => 'R$ 872,00', 'tc' => '5.000 TC', 'coins' => 872, 'badge' => ''),
            '200' => array('id' => 12, 'name' => 'PA 12 Meses (Anual)', 'duration' => '360 Dias', 'price_brl' => 1621.00, 'price_str' => 'R$ 1.621,00', 'tc' => '10.000 TC', 'coins' => 1621, 'badge' => 'Melhor Custo-Benefício'),
            '468' => array('id' => 3, 'name' => 'PA 3 Meses', 'duration' => '90 Dias', 'price_brl' => 468.00, 'price_str' => 'R$ 468,00', 'tc' => '2.500 TC', 'coins' => 468, 'badge' => ''),
            '872' => array('id' => 6, 'name' => 'PA 6 Meses', 'duration' => '180 Dias', 'price_brl' => 872.00, 'price_str' => 'R$ 872,00', 'tc' => '5.000 TC', 'coins' => 872, 'badge' => ''),
            '1621' => array('id' => 12, 'name' => 'PA 12 Meses (Anual)', 'duration' => '360 Dias', 'price_brl' => 1621.00, 'price_str' => 'R$ 1.621,00', 'tc' => '10.000 TC', 'coins' => 1621, 'badge' => 'Melhor Custo-Benefício')
        );
        return isset($map[$key]) ? $map[$key] : $map['3'];
    }
}

if (!function_exists('get_nosleira_price')) {
    function get_nosleira_price($method, $package_coins) {
        $details = get_nosleira_package_details($package_coins);
        $preco = (float)$details['price_brl'];
        // Desconto de 5% para pagamentos via PIX
        if ($method === 'pix') {
            $preco = round($preco * 0.95, 2);
        }
        return $preco;
    }
}

// Capturar conta logada (MyAAC)
$acc_id = 0;
$acc_name = '';
if (isset($logged) && $logged && isset($account_logged) && $account_logged) {
    $acc_id = (int)$account_logged->getId();
    $acc_name = $account_logged->getName();
}

// TENTATIVA DE LOGIN DIRETO PELA AREA DE DOACOES
$login_error = '';
if ((!isset($logged) || !$logged) && isset($_POST['account_login'], $_POST['password_login'])) {
    $login_account = trim($_POST['account_login']);
    $login_password = $_POST['password_login'];

    // Validacao Cloudflare Turnstile - protege contra bots de forca bruta
    $turnstileSecret = $config['cloudflare_turnstile_secret'] ?? '';
    if (!empty($turnstileSecret)) {
        $turnstileToken = $_POST['cf-turnstile-response'] ?? '';
        $turnstileOk = false;
        if (!empty($turnstileToken)) {
            $verifyResp = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, stream_context_create(['http' => ['method' => 'POST', 'header' => 'Content-Type: application/x-www-form-urlencoded', 'content' => http_build_query(['secret' => $turnstileSecret, 'response' => $turnstileToken, 'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '']), 'timeout' => 5]]));
            if ($verifyResp !== false) {
                $verifyData = json_decode($verifyResp, true);
                $turnstileOk = !empty($verifyData['success']);
            }
        }
        if (!$turnstileOk) {
            $login_error = 'Verificacao de seguranca falhou. Por favor, tente novamente.';
        }
    }
    if (empty($login_error) && !empty($login_account) && !empty($login_password)) {
        $acc_check = new OTS_Account();
        if (defined('USE_ACCOUNT_NAME') && USE_ACCOUNT_NAME) {
            $acc_check->find($login_account);
        } else {
            $acc_check->load($login_account, true);
        }
        $salt = (defined('USE_ACCOUNT_SALT') && USE_ACCOUNT_SALT) ? $acc_check->getCustomField('salt') : '';
        if ($acc_check->isLoaded() && encrypt($salt . $login_password) == $acc_check->getPassword()) {
            session_regenerate_id();
            setSession('account', $acc_check->getId());
            setSession('password', encrypt($salt . $login_password));
            $logged = true;
            $account_logged = $acc_check;
            $acc_id = (int)$account_logged->getId();
            $acc_name = $account_logged->getName();
        } else {
            $login_error = 'Número da Conta ou Senha incorretos. Por favor, verifique seus dados.';
        }
    } else {
        $login_error = 'Por favor, preencha a Conta e a Senha para continuar.';
    }
}

// BLOQUEIO DE LOGIN: SE NAO ESTIVER LOGADO, EXIBIR INTERFACE PROFISSIONAL DE AUTENTICACAO
if (!isset($logged) || !$logged || !isset($account_logged) || !$account_logged || $acc_id <= 0) {
    ?>
    <div class="TableContainer">
        <div class="CaptionContainer">
            <div class="CaptionInnerContainer">
                <span class="CaptionEdgeLeftTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
                <span class="CaptionEdgeRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
                <span class="CaptionBorderTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
                <span class="CaptionVerticalLeft" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
                <div class="Text">&Aacute;rea Restrita - Autentica&ccedil;&atilde;o Obrigat&oacute;ria</div>
                <span class="CaptionVerticalRight" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-vertical.gif);"></span>
                <span class="CaptionBorderBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/table-headline-border.gif);"></span>
                <span class="CaptionEdgeLeftBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
                <span class="CaptionEdgeRightBottom" style="background-image:url(<?php echo $template_path; ?>/images/content/box-frame-edge.gif);"></span>
            </div>
        </div>
        <div class="TableContentAndHeaderContainer">
            <div class="TableContentContainer">
                <table class="TableContent" width="100%" style="border: 1px solid #cbb290; background-color: #f1e0c6;">
                    <tbody>
                        <tr>
                            <td style="padding: 30px 20px; text-align: center;">
                                <div style="max-width: 520px; margin: 0 auto;">
                                    
                                    <!-- Banner Superior -->
                                    <div style="margin-bottom: 22px;">
                                        <div style="width: 68px; height: 68px; margin: 0 auto 14px auto; background: linear-gradient(135deg, #8b0000 0%, #4a0000 100%); border: 2px solid #cfa600; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                        </div>
                                        <h2 style="font-family: 'Cinzel', Georgia, serif; color: #4a1c00; font-size: 21px; margin: 0 0 8px 0; font-weight: 700; text-shadow: 0 1px 1px rgba(255,255,255,0.7); letter-spacing: 0.5px;">
                                            Login Necess&aacute;rio para Doa&ccedil;&atilde;o
                                        </h2>
                                        <p style="font-family: 'Inter', -apple-system, sans-serif; font-size: 13px; color: #6e543b; margin: 0; line-height: 1.55;">
                                            Para sua total seguran&ccedil;a, o acesso &agrave; &aacute;rea de doa&ccedil;&otilde;es e ao mercado de <strong>NosleiraCoins</strong> exige login pr&eacute;vio. Suas moedas ser&atilde;o creditadas diretamente na conta autenticada.
                                        </p>
                                    </div>

                                    <?php if (!empty($login_error)): ?>
                                        <div style="background-color: #fef2f2; border: 1.5px solid #ef4444; color: #991b1b; padding: 12px 16px; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 13px; margin-bottom: 22px; text-align: left; display: flex; align-items: center; gap: 10px; box-shadow: 0 3px 8px rgba(239, 68, 68, 0.18);">
                                            <span style="font-weight: bold; font-size: 16px;">[!]</span>
                                            <div><strong>Falha na Autentica&ccedil;&atilde;o:</strong> <?php echo htmlspecialchars($login_error); ?></div>
                                        </div>
                                    <?php endif; ?>

                                    <!-- Card de Formulario -->
                                    <div style="background: linear-gradient(180deg, #ffffff 0%, #faf4e8 100%); border: 1.5px solid #d8c6af; border-radius: 8px; padding: 26px 24px; box-shadow: 0 6px 18px rgba(0,0,0,0.07); text-align: left;">
                                        <form action="?subtopic=donate" method="post">
                                            
                                            <!-- Campo Conta -->
                                            <div style="margin-bottom: 18px;">
                                                <label style="display: flex; align-items: center; gap: 6px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 12px; color: #4a1c00; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7f0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                    <span>N&uacute;mero da Conta / Account Name:</span>
                                                </label>
                                                <input type="text" name="account_login" required autocomplete="username" placeholder="Digite o n&uacute;mero da sua conta" style="width: 100%; box-sizing: border-box; padding: 11px 14px; font-size: 14px; font-family: 'Inter', sans-serif; border: 1px solid #b89a72; border-radius: 6px; background: #ffffff; color: #2b1704; outline: none; transition: all 0.2s ease; box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);" onfocus="this.style.borderColor='#8b0000'; this.style.boxShadow='0 0 0 3.5px rgba(139,0,0,0.15)';" onblur="this.style.borderColor='#b89a72'; this.style.boxShadow='inset 0 1px 3px rgba(0,0,0,0.06)';" />
                                            </div>

                                            <!-- Campo Senha -->
                                            <div style="margin-bottom: 22px;">
                                                <label style="display: flex; align-items: center; gap: 6px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 12px; color: #4a1c00; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7f0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                    <span>Senha / Password:</span>
                                                </label>
                                                <input type="password" name="password_login" required autocomplete="current-password" placeholder="" style="width: 100%; box-sizing: border-box; padding: 11px 14px; font-size: 14px; font-family: 'Inter', sans-serif; border: 1px solid #b89a72; border-radius: 6px; background: #ffffff; color: #2b1704; outline: none; transition: all 0.2s ease; box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);" onfocus="this.style.borderColor='#8b0000'; this.style.boxShadow='0 0 0 3.5px rgba(139,0,0,0.15)';" onblur="this.style.borderColor='#b89a72'; this.style.boxShadow='inset 0 1px 3px rgba(0,0,0,0.06)';" />
                                            </div>


                                            <?php if (!empty($config['cloudflare_turnstile_sitekey'])): ?>
                                            <!-- Cloudflare Turnstile CAPTCHA anti-bot -->
                                            <div style="margin-bottom: 18px; display: flex; justify-content: center;">
                                                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
                                                <div class="cf-turnstile" data-sitekey="<?php echo htmlspecialchars($config['cloudflare_turnstile_sitekey']); ?>" data-theme="light"></div>
                                            </div>
                                            <?php endif; ?>
                                            <!-- Botao de Submissao -->
                                            <button type="submit" style="width: 100%; padding: 13px 20px; font-family: 'Cinzel', Georgia, serif; font-size: 15px; font-weight: 800; color: #ffffff; background: linear-gradient(180deg, #34d399 0%, #059669 50%, #047857 100%); border: 1px solid #064e3b; border-radius: 6px; cursor: pointer; box-shadow: 0 4px 14px rgba(4, 120, 87, 0.35), inset 0 1px 0 rgba(255,255,255,0.4); text-shadow: 0 1px 2px rgba(0,0,0,0.5); transition: all 0.2s ease-in-out;" onmouseover="this.style.background='linear-gradient(180deg, #4ade80 0%, #10b981 50%, #059669 100%)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='linear-gradient(180deg, #34d399 0%, #059669 50%, #047857 100%)'; this.style.transform='translateY(0)';" onmousedown="this.style.transform='translateY(1px)';">
                                                ENTRAR E ACESSAR DOA&Ccedil;&Atilde;O &rarr;
                                            </button>

                                        </form>
                                    </div>

                                    <!-- Links de Apoio -->
                                    <div style="margin-top: 18px; display: flex; align-items: center; justify-content: space-between; font-family: 'Inter', sans-serif; font-size: 12.5px; background: #e8d7be; padding: 11px 18px; border-radius: 6px; border: 1px solid #d4c0a5;">
                                        <a href="?subtopic=account/create" style="color: #8b0000; font-weight: 700; text-decoration: none;" onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                                            N&atilde;o tem conta? Criar conta gr&aacute;tis
                                        </a>
                                        <span style="color: #a0825a;">|</span>
                                        <a href="?subtopic=account/lost" style="color: #5c3d1e; font-weight: 600; text-decoration: none;" onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                                            Esqueceu a Senha?
                                        </a>
                                    </div>

                                    <!-- Footer Informativo -->
                                    <div style="margin-top: 22px; font-family: 'Inter', sans-serif; font-size: 11.5px; color: #78624c; display: flex; align-items: center; justify-content: center; gap: 16px;">
                                        <span>Seguran&ccedil;a SSL</span>
                                        <span>&bull;</span>
                                        <span>Entrega Autom&aacute;tica</span>
                                        <span>&bull;</span>
                                        <span>PIX &amp; Cart&atilde;o</span>
                                    </div>

                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <?php
    return;
}

// Intenção: Garantir que as tabelas e colunas de auditoria financeira existam no banco
if (function_exists('ensure_donation_audit_tables')) {
    ensure_donation_audit_tables();
}

// Mapeamento de pacotes Tibia Coins para planos de Premium Account
$tc_products = array(
    '3'    => array('product' => 'PA 3 Meses (90 Dias)', 'price' => '2.500 TC'),
    '6'    => array('product' => 'PA 6 Meses (180 Dias)', 'price' => '5.000 TC'),
    '12'   => array('product' => 'PA 12 Meses (Anual - 360 Dias)', 'price' => '10.000 TC'),
    // Compatibilidade com seleções legadas
    '50'   => array('product' => 'PA 3 Meses (90 Dias)', 'price' => '2.500 TC'),
    '100'  => array('product' => 'PA 6 Meses (180 Dias)', 'price' => '5.000 TC'),
    '200'  => array('product' => 'PA 12 Meses (Anual)', 'price' => '10.000 TC'),
    '500'  => array('product' => 'PA 12 Meses (Anual)', 'price' => '10.000 TC')
);

// Fallback de retrocompatibilidade para requisições de Tibia Coins
if ($payment_method === 'tibia_coins') {
    if ($points_package == '55' || $points_package == '52' || $points_package == '25' || $points_package == '50') $points_package = '3';
    if ($points_package == '110' || $points_package == '105' || $points_package == '100') $points_package = '6';
    if ($points_package == '220' || $points_package == '209' || $points_package == '200' || $points_package == '500') $points_package = '12';
}

$pkg_details = get_nosleira_package_details($points_package);
if (isset($tc_products[$points_package])) {
    $product_label = $tc_products[$points_package]['product'];
    $price_label   = $tc_products[$points_package]['price'];
} else {
    $product_label = $pkg_details['name'] . ' (' . $pkg_details['duration'] . ')';
    $price_label   = $pkg_details['tc'];
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
    $points_package = isset($_POST['points_package']) ? $_POST['points_package'] : '3';

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

                $card_pkg_details = get_nosleira_package_details($points_package);

                $payload = array(
                    'token' => $card_token,
                    'description' => $card_pkg_details['name'] . ' - Account: ' . ($acc_name ? $acc_name : 'Player'),
                    'external_reference' => (string)$order_id,
                    'installments' => $installments > 0 ? $installments : 1,
                    'payment_method_id' => !empty($payment_method_id) ? strtolower($payment_method_id) : 'visa',
                    'transaction_amount' => $card_pkg_details['price_brl'],
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
        $pkg_details = get_nosleira_package_details($points_package);
        $charged_amount = $pkg_details['price_brl'];
        $price_str = $pkg_details['price_str'];
        $card_inst = isset($_POST['installments']) ? (int)$_POST['installments'] : 1;
        $card_b = isset($_POST['payment_method_id']) ? trim($_POST['payment_method_id']) : null;

        $db->query("INSERT INTO `myaac_donations` (`account_id`, `account_name`, `payment_method`, `points_package`, `coins`, `price`, `tibia_char_name`, `status`, `created_at`, `updated_at`, `payer_ip`, `payer_email`, `installments`, `card_brand`) VALUES (
            " . (int)$acc_id . ",
            " . $db->quote($acc_name) . ",
            " . $db->quote($payment_method) . ",
            " . (int)$pkg_details['id'] . ",
            " . (int)$pkg_details['coins'] . ",
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
            log_donation_event($order_id, $acc_id, 'ORDER_CREATED', 'Criado pedido ' . strtoupper($payment_method) . ' (' . $pkg_details['name'] . ' - ' . $price_str . ')');
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
                    'description' => $pkg_details['name'] . ' - Account: ' . ($acc_name ? $acc_name : 'Player'),
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

.terms-pillars-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin: 12px 0 4px 0;
}

.terms-pillar-item {
    background: #fbf6ee;
    border: 1px solid #d8c2a7;
    border-radius: 5px;
    padding: 10px 12px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 3px rgba(0,0,0,0.04);
}

.terms-pillar-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Cinzel', 'Georgia', serif;
    font-size: 12px;
    font-weight: 700;
    color: #4a1c00;
    margin-bottom: 6px;
    border-bottom: 1px dashed rgba(160, 130, 90, 0.4);
    padding-bottom: 4px;
}

.terms-pillar-icon {
    font-size: 14px;
}

.terms-pillar-body {
    font-family: Verdana, Arial, sans-serif;
    font-size: 11.5px;
    color: #432810;
    line-height: 1.5;
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
                                                                    <div style="font-size: 16px; font-weight: 800; color: #4a2505; margin-bottom: 8px; font-family: 'Cinzel', serif;">Pagamento via PIX (Mercado Pago)</div>
                                                                    <p style="font-size: 14px; color: #2b1704; margin-bottom: 14px;">Valor: <b style="color: #4a2505;"><?php echo htmlspecialchars($price_str); ?></b> - Plano: <b><?php echo htmlspecialchars($pkg_details['name']); ?> (<?php echo htmlspecialchars($pkg_details['duration']); ?>)</b> (Pedido #<?php echo $order_id; ?>)</p>
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

                                                                    <div style="background: linear-gradient(180deg, #fdf9f3 0%, #f4ead8 100%); border: 1px solid #d8c6af; border-left: 4px solid #8b521b; border-radius: 6px; padding: 22px 26px; margin-bottom: 20px; text-align: center; color: #3d1c02; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                                                                        <div style="font-size: 24px; margin-bottom: 6px;">🎉</div>
                                                                        <div style="font-size: 17px; font-weight: 800; color: #4a2505; margin-bottom: 8px; font-family: 'Cinzel', serif;">Pagamento Aprovado com Sucesso!</div>
                                                                        <p style="font-size: 14px; margin-bottom: 12px;">Seu pagamento no valor de <b style="color: #4a2505;"><?php echo htmlspecialchars($price_str); ?></b> via Cartão de Crédito foi processado.</p>
                                                                        <p style="font-size: 14px; font-weight: 700; color: #4a2505; background: #ffffff; display: inline-block; padding: 8px 18px; border-radius: 20px; border: 1px solid #d4c0a5;">
                                                                            Sua <b><?php echo htmlspecialchars($pkg_details['name']); ?></b> já foi ativada com sucesso em sua conta!
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
                                                                        <p style="font-size: 13.5px;">A operadora do seu cartão de crédito está analisando a transação. Sua Premium Account será liberada assim que a análise for concluída.</p>
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
                                                                            <div style="font-size: 15px; font-weight: 800; color: #3d1c02; margin-bottom: 6px; font-family: 'Cinzel', serif; border-bottom: 1px solid rgba(160, 130, 90, 0.3); padding-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                                                                                <span>💳 Dados do Cartão de Crédito</span>
                                                                                <span style="font-size: 11px; font-family: Arial, sans-serif; color: #4a2505; font-weight: 700; background: #eedfc8; padding: 3px 8px; border-radius: 4px; border: 1px solid #cbb291;">🔒 Criptografia SSL 256-bit (Mercado Pago)</span>
                                                                            </div>
                                                                            
                                                                            <p style="font-size: 13.5px; color: #4a1c00; margin-bottom: 16px;">
                                                                                Valor a Pagar: <b style="color: #4a2505;"><?php echo htmlspecialchars($price_str); ?></b> &bull; Plano: <b><?php echo htmlspecialchars($pkg_details['name']); ?> (<?php echo htmlspecialchars($pkg_details['duration']); ?>)</b> (Pedido #<?php echo $order_id; ?>)
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
                                                            <td style="font-weight: bold; font-size: 16px; padding: 10px 16px; font-family: 'Cinzel', serif; color: #3d1c02; text-shadow: 0 1px 0 rgba(255,255,255,0.4);">
                                                                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 8px;">
                                                                    <div style="display: flex; align-items: center; gap: 10px;">
                                                                        <div style="background: linear-gradient(180deg, #2b394a 0%, #1a232e 100%); color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 12px; border: 1px solid #141c28; box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2); display: flex; align-items: center; gap: 6px;">
                                                                            <svg style="height: 15px; width: 15px; fill: #60a5fa; vertical-align: middle;" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                                                                            <span style="font-weight: 800; letter-spacing: 0.5px;">CHECKOUT</span>
                                                                        </div>
                                                                        <span>Selecione o <b style="color: #4a1c00; font-size: 17px; text-shadow: 0 1px 1px rgba(255,255,255,0.6);">Método de Pagamento</b></span>
                                                                    </div>
                                                                    <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-family: 'Inter', Arial, sans-serif; color: #065f46; background: #ecfdf5; border: 1px solid #10b981; padding: 3px 9px; border-radius: 12px; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                                                        <span>🔒</span>
                                                                        <span>Pagamento Seguro & Criptografado</span>
                                                                    </div>
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
                                                                        padding: 10px 8px;
                                                                        flex: 1 1 170px;
                                                                        max-width: 215px;
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
                                                                        top: -9px;
                                                                        right: -9px;
                                                                        width: 24px;
                                                                        height: 24px;
                                                                        background: #22c55e;
                                                                        color: #ffffff;
                                                                        border: 2px solid #ffffff;
                                                                        border-radius: 50%;
                                                                        text-align: center;
                                                                        line-height: 20px;
                                                                        font-weight: 800;
                                                                        font-size: 14px;
                                                                        box-shadow: 0 2px 5px rgba(0,0,0,0.4);
                                                                        z-index: 20;
                                                                    }
                                                                    .payment-card.selected .card-check-icon {
                                                                        display: block;
                                                                    }
                                                                    .nosleira-custom-select-wrap {
                                                                        position: relative;
                                                                        flex: 1;
                                                                        min-width: 330px;
                                                                        max-width: 500px;
                                                                        font-family: Arial, sans-serif;
                                                                    }
                                                                    .nosleira-select-trigger {
                                                                        padding: 8px 14px;
                                                                        font-size: 13px;
                                                                        font-weight: 600;
                                                                        color: #2b1704;
                                                                        background: linear-gradient(180deg, #fffcf8 0%, #f4ebd9 100%);
                                                                        border: 1px solid #9e815e;
                                                                        border-radius: 4px;
                                                                        box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
                                                                        cursor: pointer;
                                                                        display: flex;
                                                                        align-items: center;
                                                                        justify-content: space-between;
                                                                        user-select: none;
                                                                        transition: border-color 0.2s, box-shadow 0.2s;
                                                                    }
                                                                    .nosleira-select-trigger:hover, .nosleira-select-trigger.active {
                                                                        border-color: #6d4214 !important;
                                                                        box-shadow: 0 0 0 2px rgba(110, 66, 20, 0.18) !important;
                                                                    }
                                                                    .nosleira-select-dropdown {
                                                                        position: absolute;
                                                                        top: calc(100% + 4px);
                                                                        left: 0;
                                                                        right: 0;
                                                                        background: #fffcf8;
                                                                        border: 1px solid #9e815e;
                                                                        border-radius: 4px;
                                                                        box-shadow: 0 8px 24px rgba(43, 23, 4, 0.18), 0 2px 6px rgba(43, 23, 4, 0.08);
                                                                        z-index: 1000;
                                                                        overflow: hidden;
                                                                        display: none;
                                                                    }
                                                                    .nosleira-select-item {
                                                                        padding: 10px 14px;
                                                                        cursor: pointer;
                                                                        border-bottom: 1px solid #ebdcc8;
                                                                        transition: background 0.15s ease;
                                                                    }
                                                                    .nosleira-select-item:last-child {
                                                                        border-bottom: none;
                                                                    }
                                                                    .nosleira-select-item:hover {
                                                                        background: #f6ede0 !important;
                                                                    }
                                                                    .nosleira-select-item.selected {
                                                                        background: #ecdcc6 !important;
                                                                    }
                                                                    .nosleira-select-item-content {
                                                                        display: flex;
                                                                        align-items: center;
                                                                        justify-content: space-between;
                                                                        width: 100%;
                                                                        gap: 12px;
                                                                    }
                                                                    .nosleira-select-left {
                                                                        display: flex;
                                                                        align-items: center;
                                                                        gap: 7px;
                                                                        white-space: nowrap;
                                                                    }
                                                                    .nosleira-star-icon {
                                                                        color: #926425;
                                                                        font-size: 13px;
                                                                        line-height: 1;
                                                                    }
                                                                    .nosleira-plan-title {
                                                                        color: #2b1704;
                                                                        font-weight: 700;
                                                                        font-size: 13.5px;
                                                                        font-family: 'Cinzel', serif;
                                                                        letter-spacing: 0.2px;
                                                                    }
                                                                    .nosleira-plan-days {
                                                                        color: #7d6954;
                                                                        font-size: 11.5px;
                                                                        font-weight: 500;
                                                                    }
                                                                    .nosleira-select-right {
                                                                        display: flex;
                                                                        align-items: center;
                                                                        gap: 8px;
                                                                        white-space: nowrap;
                                                                    }
                                                                    .nosleira-plan-price {
                                                                        color: #3b1e06;
                                                                        font-weight: 800;
                                                                        font-size: 13.5px;
                                                                        letter-spacing: 0.2px;
                                                                    }
                                                                    .nosleira-badge-soft {
                                                                        font-size: 10px;
                                                                        font-weight: 700;
                                                                        color: #5c3814;
                                                                        background: #eedfc8;
                                                                        border: 1px solid #cbb291;
                                                                        padding: 2px 6px;
                                                                        border-radius: 3px;
                                                                        white-space: nowrap;
                                                                        letter-spacing: 0.2px;
                                                                    }
                                                                    /* Preço original riscado (antes do desconto PIX) */
                                                                    .nosleira-price-original {
                                                                        color: #9b7b5a;
                                                                        font-weight: 500;
                                                                        font-size: 11.5px;
                                                                        text-decoration: line-through;
                                                                        letter-spacing: 0.1px;
                                                                        margin-right: 3px;
                                                                        opacity: 0.8;
                                                                    }
                                                                    /* Preço com desconto PIX — verde escuro sóbrio */
                                                                    .nosleira-price-discount {
                                                                        color: #1a6035 !important;
                                                                        font-weight: 800 !important;
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
                                                                <div style="background-color: #2b394a; border: 2px solid #141c28; box-shadow: inset 0 0 0 1px #4e647f; border-radius: 4px; padding: 14px 10px;">
                                                                    <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                                                                        <!-- Card Cartão de Crédito -->
                                                                        <div class="payment-card <?php echo ($payment_method === 'stripe' || $payment_method === 'credit_card' || $action === 'process_card') ? 'selected' : ''; ?>" data-method="stripe" onclick="selectPaymentMethod('stripe', this)">
                                                                            <div class="card-check-icon">✓</div>
                                                                            <div style="height: 72px; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #141c28; border-radius: 3px; overflow: hidden; margin-bottom: 6px; padding: 6px;">
                                                                                <img src="<?php echo BASE_URL; ?>images/payment/stripe_cards_hd.png" alt="Cartões de Crédito" style="max-width: 98%; max-height: 94%; object-fit: contain;">
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 6px 2px; margin-bottom: 6px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #ffffff; font-weight: 700; font-size: 13.5px; font-family: Arial, sans-serif;">Cartão de Crédito</span>
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 7px 2px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #a0b3c6; font-size: 11px; font-family: Arial, sans-serif; display: block;">Usual Process Time:</span>
                                                                                <span style="color: #ffffff; font-weight: 600; font-size: 12.5px; font-family: Arial, sans-serif; display: block; margin-top: 2px;">Instant</span>
                                                                            </div>
                                                                        </div>

                                                                        <!-- Card PIX -->
                                                                        <div class="payment-card <?php echo ($payment_method === 'pix') ? 'selected' : ''; ?>" data-method="pix" onclick="selectPaymentMethod('pix', this)">
                                                                            <div class="card-check-icon">✓</div>
                                                                            <div style="height: 72px; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #141c28; border-radius: 3px; overflow: hidden; margin-bottom: 6px; padding: 6px;">
                                                                                <img src="<?php echo BASE_URL; ?>images/payment/pix_official.png" alt="PIX Oficial" style="max-width: 95%; max-height: 92%; object-fit: contain;">
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 6px 2px; margin-bottom: 6px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #ffffff; font-weight: 700; font-size: 13.5px; font-family: Arial, sans-serif;">PIX</span>
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 7px 2px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #a0b3c6; font-size: 11px; font-family: Arial, sans-serif; display: block;">Usual Process Time:</span>
                                                                                <span style="color: #ffffff; font-weight: 600; font-size: 12.5px; font-family: Arial, sans-serif; display: block; margin-top: 2px;">Instant</span>
                                                                            </div>
                                                                        </div>

                                                                        <!-- Card Tibia Coins -->
                                                                        <div class="payment-card <?php echo ($payment_method === 'tibia_coins') ? 'selected' : ''; ?>" data-method="tibia_coins" onclick="selectPaymentMethod('tibia_coins', this)">
                                                                            <div class="card-check-icon">✓</div>
                                                                            <div style="height: 72px; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid #141c28; border-radius: 3px; overflow: hidden; margin-bottom: 6px; padding: 6px;">
                                                                                <img src="<?php echo BASE_URL; ?>images/payment/tibia_coins_hd.png" alt="Tibia Coins" style="max-width: 95%; max-height: 92%; object-fit: contain;">
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 6px 2px; margin-bottom: 6px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #ffffff; font-weight: 700; font-size: 13.5px; font-family: Arial, sans-serif;">Tibia Coins</span>
                                                                            </div>
                                                                            <div style="background: #212c3b; border: 1px solid #121824; border-radius: 3px; padding: 7px 2px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                                                                                <span style="color: #a0b3c6; font-size: 11px; font-family: Arial, sans-serif; display: block;">Usual Process Time:</span>
                                                                                <span style="color: #ffffff; font-weight: 600; font-size: 12.5px; font-family: Arial, sans-serif; display: block; margin-top: 2px;">1 dia a 24 horas</span>
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
                                                            <td style="font-weight: bold; font-size: 15px; padding: 10px 16px; font-family: 'Cinzel', serif; color: #3d1c02; text-shadow: 0 1px 0 rgba(255,255,255,0.4);">
                                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                                    <div style="background: linear-gradient(180deg, #d97706 0%, #92400e 100%); color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; border: 1px solid #78350f; box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3); display: flex; align-items: center; gap: 4px;">
                                                                        <span style="font-weight: 800; letter-spacing: 0.5px;">PREMIUM ACCOUNT</span>
                                                                    </div>
                                                                    <span>Planos de <b style="color: #4a2505; font-size: 16px;">Premium Account (PA)</b></span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr bgcolor="<?php echo $config['lightborder']; ?>">
                                                            <td style="padding: 18px 16px;">
                                                                <!-- Banner Informativo Sóbrio e Clássico -->
                                                                <div id="bonus_promo_banner" style="background: linear-gradient(90deg, #fbf7ee 0%, #f4ebd9 100%); border: 1px solid #cbb291; border-left: 4px solid #926425; border-radius: 4px; padding: 10px 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                                                                    <span style="font-size: 16px; color: #926425;">🛡️</span>
                                                                    <div>
                                                                        <span style="font-weight: 700; font-size: 12.5px; color: #3d1c02;">Ativação Instantânea:</span>
                                                                        <span style="font-size: 12px; color: #5a422b; margin-left: 4px;">Sua <b>Premium Account</b> é creditada de forma automática na conta logo após a confirmação do pagamento.</span>
                                                                    </div>
                                                                </div>

                                                                <!-- Banner de Desconto PIX — aparece somente quando PIX está selecionado -->
                                                                <div id="pix_discount_banner" style="background: linear-gradient(90deg, #f0faf4 0%, #e6f4ec 100%); border: 1px solid #9fcdb3; border-left: 4px solid #1a7a3f; border-radius: 4px; padding: 10px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                                                                    <span style="font-size: 17px;">💰</span>
                                                                    <div>
                                                                        <span style="font-weight: 700; font-size: 12.5px; color: #1a4a2e;">5% de desconto pagando via PIX.</span>
                                                                        <span style="font-size: 12px; color: #2d6b47; margin-left: 4px;">Desconto aplicado automaticamente — preço já exibido com o desconto no plano selecionado.</span>
                                                                    </div>
                                                                </div>

                                                                <form action="?subtopic=donate&action=checkout" method="post" style="display: flex; flex-direction: column; align-items: center; gap: 18px; width: 100%; margin: 8px 0;">
                                                                    <input type="hidden" name="accept_terms" value="1">
                                                                    <input type="hidden" id="payment_method_input" name="payment_method" value="<?php echo htmlspecialchars($payment_method); ?>">
                                                                    
                                                                    <div style="display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; width: 100%;">
                                                                        <label style="font-weight: 700; font-size: 13px; color: #3d1c02; font-family: 'Cinzel', serif; white-space: nowrap;">
                                                                            Selecione o plano de <span style="color: #6d4214; font-weight: 800;">Premium Account</span>:
                                                                        </label>

                                                                        <!-- Select nativo em segundo plano para envio de formulário padrão -->
                                                                        <select id="points_package_select" name="points_package" style="display: none;">
                                                                            <option value="3" <?php echo ($points_package == '3') ? 'selected' : ''; ?>>PA 3 Meses (90 Dias) - R$ 468,00</option>
                                                                            <option value="6" <?php echo ($points_package == '6') ? 'selected' : ''; ?>>PA 6 Meses (180 Dias) - R$ 872,00</option>
                                                                            <option value="12" <?php echo ($points_package == '12') ? 'selected' : ''; ?>>PA 12 Meses (Anual - 360 Dias) - R$ 1.621,00</option>
                                                                        </select>

                                                                        <!-- Dropdown Personalizado Profissional Nobre -->
                                                                        <div class="nosleira-custom-select-wrap" id="nosleira_select_wrap">
                                                                            <div id="nosleira_select_trigger" class="nosleira-select-trigger" onclick="toggleNosleiraDropdown(event)">
                                                                                <div id="nosleira_select_display" style="width: 100%; overflow: hidden;">
                                                                                    <!-- Conteúdo renderizado pelo JS -->
                                                                                </div>
                                                                                <span id="nosleira_select_arrow" style="font-size: 11px; color: #6d4214; margin-left: 10px; transition: transform 0.2s ease;">▼</span>
                                                                            </div>
                                                                            <div id="nosleira_select_dropdown" class="nosleira-select-dropdown">
                                                                                <!-- Opções renderizadas pelo JS -->
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <!-- Botão Continuar Centralizado -->
                                                                    <div style="width: 100%; display: flex; justify-content: center; margin-top: 6px;">
                                                                        <button type="submit" class="btn-donate-continue-action">
                                                                            <span>Continuar</span>
                                                                            <span style="font-size: 13px; font-weight: bold; margin-left: 4px;">➔</span>
                                                                        </button>
                                                                    </div>
                                                                </form>

                                                                <script type="text/javascript">
                                                                var nosleiraPackages = {
                                                                    /* PIX: 5% de desconto aplicado — preço original fica riscado */
                                                                    'pix': [
                                                                        { value: '3',  title: 'PA 3 Meses',        duration: '90 Dias',  price: 'R$ 444,60', priceOriginal: 'R$ 468,00', badge: '5% OFF no PIX' },
                                                                        { value: '6',  title: 'PA 6 Meses',        duration: '180 Dias', price: 'R$ 828,40', priceOriginal: 'R$ 872,00', badge: '5% OFF no PIX' },
                                                                        { value: '12', title: 'PA 12 Meses (Anual)', duration: '360 Dias', price: 'R$ 1.539,95', priceOriginal: 'R$ 1.621,00', badge: 'Melhor Custo-Benefício' }
                                                                    ],
                                                                    'stripe': [
                                                                        { value: '3',  title: 'PA 3 Meses',        duration: '90 Dias',  price: 'R$ 468,00', priceOriginal: '', badge: '' },
                                                                        { value: '6',  title: 'PA 6 Meses',        duration: '180 Dias', price: 'R$ 872,00', priceOriginal: '', badge: '' },
                                                                        { value: '12', title: 'PA 12 Meses (Anual)', duration: '360 Dias', price: 'R$ 1.621,00', priceOriginal: '', badge: 'Melhor Custo-Benefício' }
                                                                    ],
                                                                    'tibia_coins': [
                                                                        { value: '3',  title: 'PA 3 Meses',        duration: '90 Dias',  price: '2.500 TC',  priceOriginal: '', badge: '' },
                                                                        { value: '6',  title: 'PA 6 Meses',        duration: '180 Dias', price: '5.000 TC',  priceOriginal: '', badge: '' },
                                                                        { value: '12', title: 'PA 12 Meses (Anual)', duration: '360 Dias', price: '10.000 TC', priceOriginal: '', badge: 'Melhor Custo-Benefício' }
                                                                    ]
                                                                };

                                                                function formatNosleiraItemHtml(item) {
                                                                    var badgeHtml = '';
                                                                    if (item.badge) {
                                                                        badgeHtml = '<span class="nosleira-badge-soft">' + item.badge + '</span>';
                                                                    }
                                                                    /* Preço: se houver priceOriginal, exibe riscado + preço com desconto em verde */
                                                                    var priceHtml = '';
                                                                    if (item.priceOriginal) {
                                                                        priceHtml = '<span class="nosleira-price-original">' + item.priceOriginal + '</span>' +
                                                                                    '<span class="nosleira-plan-price nosleira-price-discount">' + item.price + '</span>';
                                                                    } else {
                                                                        priceHtml = '<span class="nosleira-plan-price">' + item.price + '</span>';
                                                                    }
                                                                    return '<div class="nosleira-select-item-content">' +
                                                                        '<div class="nosleira-select-left">' +
                                                                            '<span class="nosleira-star-icon">★</span>' +
                                                                            '<span class="nosleira-plan-title">' + item.title + '</span>' +
                                                                            '<span class="nosleira-plan-days">(' + item.duration + ')</span>' +
                                                                        '</div>' +
                                                                        '<div class="nosleira-select-right">' +
                                                                            priceHtml +
                                                                            badgeHtml +
                                                                        '</div>' +
                                                                    '</div>';
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
                                                                    var list = nosleiraPackages[method] || nosleiraPackages['pix'];
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
                                                                            var rawText = item.title + ' (' + item.duration + ') - ' + item.price + (item.badge ? ' [' + item.badge + ']' : '');
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

                                                                    /* Exibir banner de desconto PIX apenas quando PIX estiver ativo */
                                                                    var pixBanner = document.getElementById('pix_discount_banner');
                                                                    if (pixBanner) {
                                                                        pixBanner.style.display = (method === 'pix') ? 'flex' : 'none';
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

                                                                /* Controla visibilidade inicial do banner PIX na carga da página */
                                                                function initPixBannerVisibility(method) {
                                                                    var pixBanner = document.getElementById('pix_discount_banner');
                                                                    if (pixBanner) {
                                                                        pixBanner.style.display = (method === 'pix') ? 'flex' : 'none';
                                                                    }
                                                                }

                                                                // Inicialização no carregamento
                                                                if (document.readyState === 'loading') {
                                                                    document.addEventListener('DOMContentLoaded', function() {
                                                                        var curMethod = '<?php echo htmlspecialchars($payment_method); ?>';
                                                                        var curPkg = '<?php echo htmlspecialchars($points_package); ?>';
                                                                        renderNosleiraCustomSelect(curMethod, curPkg);
                                                                        initPixBannerVisibility(curMethod);
                                                                    });
                                                                } else {
                                                                    var curMethod = '<?php echo htmlspecialchars($payment_method); ?>';
                                                                    var curPkg = '<?php echo htmlspecialchars($points_package); ?>';
                                                                    renderNosleiraCustomSelect(curMethod, curPkg);
                                                                    initPixBannerVisibility(curMethod);
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
                                                                         <span>Apoio ao Projeto &amp; Diretrizes Oficiais</span>
                                                                     </div>
                                                                     <p style="margin: 0 0 12px 0; font-family: Verdana, Arial, sans-serif; font-size: 12px; color: #2b1704; line-height: 1.6;">
                                                                         O <strong>Nosleira OT 7.4</strong> é mantido através do suporte e da colaboração da nossa comunidade. Toda contribuição possui caráter <strong>estritamente voluntário</strong> e é integralmente destinada à manutenção de uma infraestrutura robusta, segura e estável.
                                                                     </p>
                                                                     <div class="terms-pillars-container">
                                                                         <div class="terms-pillar-item">
                                                                             <div class="terms-pillar-header">
                                                                                 <span class="terms-pillar-icon">🌐</span>
                                                                                 <span>Infraestrutura &amp; Estabilidade</span>
                                                                             </div>
                                                                             <div class="terms-pillar-body">
                                                                                 Os valores arrecadados cobrem servidores dedicados de baixa latência, hospedagem de alta performance e mitigação avançada contra ataques DDoS.
                                                                             </div>
                                                                         </div>

                                                                         <div class="terms-pillar-item">
                                                                             <div class="terms-pillar-header">
                                                                                 <span class="terms-pillar-icon">🪙</span>
                                                                                 <span>Gratificação em Coins</span>
                                                                             </div>
                                                                             <div class="terms-pillar-body">
                                                                                 Como agradecimento pelo seu suporte, você recebe <strong style="color: #ea580c;">NosleiraCoins</strong> <img src="<?php echo BASE_URL; ?>images/nosleira_coin.svg" alt="" style="height: 15px; width: 15px; vertical-align: -2px;"> na sua conta, utilizáveis na Store do jogo para benefícios exclusivos.
                                                                             </div>
                                                                         </div>

                                                                         <div class="terms-pillar-item">
                                                                             <div class="terms-pillar-header">
                                                                                 <span class="terms-pillar-icon">📜</span>
                                                                                 <span>Transparência &amp; Diretrizes</span>
                                                                             </div>
                                                                             <div class="terms-pillar-body">
                                                                                 Para assegurar total conformidade e transparência comunitária, solicitamos a leitura atenta das 7 diretrizes detalhadas abaixo antes de efetuar seu apoio.
                                                                             </div>
                                                                         </div>
                                                                     </div>
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
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div class="TableShadowContainer">
                                                <div class="TableBottomShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bm.gif);">
                                                    <div class="TableBottomLeftShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bl.gif);"></div>
                                                    <div class="TableBottomRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-br.gif);"></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- CAIXA DE ACEITE DOS TERMOS (ESTILO CRIAR CONTA) -->
                                    <tr>
                                        <td>
                                            <div class="TableShadowContainerRightTop">
                                                <div class="TableShadowRightTop" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rt.gif);"></div>
                                            </div>
                                            <div class="TableContentAndRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-rm.gif);">
                                                <div class="TableContentContainer">
                                                    <table class="TableContent" width="100%" style="border:1px solid #faf0d7;">
                                                        <tbody>
                                                            <tr>
                                                                <td colspan="2" style="padding: 12px 14px; text-align: left;">
                                                                    <div style="margin-bottom: 8px;">
                                                                        <input type="checkbox" id="accept_age" name="accept_age" value="true" required style="vertical-align: middle; margin-right: 8px; cursor: pointer;"/>
                                                                        <label for="accept_age" style="font-family: Verdana, Arial, sans-serif; font-size: 12px; color: #3d2208; cursor: pointer;">Confirmo que tenho 18 anos ou mais.</label>
                                                                    </div>
                                                                    <div>
                                                                        <input type="checkbox" id="accept_terms_checkbox" name="accept_terms" value="1" required style="vertical-align: middle; margin-right: 8px; cursor: pointer;"/>
                                                                        <label for="accept_terms_checkbox" style="font-family: Verdana, Arial, sans-serif; font-size: 12px; color: #3d2208; cursor: pointer;">
                                                                            Li e aceito as <a href="<?php echo getLink('regras/rules'); ?>" target="_blank" style="color: #005596; text-decoration: underline; font-weight: 500;">Regras do Jogo</a>, os <a href="<?php echo getLink('regras/agreement'); ?>" target="_blank" style="color: #005596; text-decoration: underline; font-weight: 500;">Termos de Serviço</a> e os <strong>Termos e Condições de Doação</strong> acima descritos.
                                                                        </label>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div class="TableShadowContainer">
                                                <div class="TableBottomShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bm.gif);">
                                                    <div class="TableBottomLeftShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-bl.gif);"></div>
                                                    <div class="TableBottomRightShadow" style="background-image:url(<?php echo $template_path; ?>/images/content/table-shadow-br.gif);"></div>
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

    <!-- BOTÃO CONTINUAR PADRÃO TIBIA -->
    <table width="100%" style="margin-top: 15px;">
        <tr align="center">
            <td>
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="border:0px;">
                            <div class="BigButton" style="background-image:url(<?php echo $template_path; ?>/images/global/buttons/sbutton.gif)">
                                <div onMouseOver="MouseOverBigButton(this);" onMouseOut="MouseOutBigButton(this);">
                                    <div class="BigButtonOver" style="background-image:url(<?php echo $template_path; ?>/images/global/buttons/sbutton_over.gif);"></div>
                                    <input class="BigButtonText" type="submit" value="Continuar">
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</form>

<?php endif; ?>
