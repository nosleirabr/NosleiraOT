<?php
/**
 * Mercado Pago Webhook Handler
 * Recebe notificações automáticas de pagamento e entrega dias de Premium instantaneamente
 */

// Permitir acesso via callback do Mercado Pago
if (!defined('MYAAC')) {
    define('MYAAC', true);
    require_once __DIR__ . '/../../config.php';
    require_once __DIR__ . '/../init.php';
}

$token = isset($config['mercadopago_access_token']) ? $config['mercadopago_access_token'] : '';

// Capturar ID do pagamento enviado pelo Mercado Pago
$payment_id = 0;
if (isset($_GET['id'])) {
    $payment_id = $_GET['id'];
} elseif (isset($_GET['data_id'])) {
    $payment_id = $_GET['data_id'];
} else {
    $rawInput = file_get_contents('php://input');
    $json = json_decode($rawInput, true);
    if (isset($json['data']['id'])) {
        $payment_id = $json['data']['id'];
    }
}

if (!empty($payment_id) && !empty($token)) {
    // Consulta Reversa à API oficial do Mercado Pago para verificação segura
    $ch = curl_init('https://api.mercadopago.com/v1/payments/' . $payment_id);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer ' . $token
    ));
    $res = curl_exec($ch);
    curl_close($ch);
    $paymentData = json_decode($res, true);

    if (isset($paymentData['status']) && isset($paymentData['external_reference'])) {
        $status = $paymentData['status'];
        $order_id = (int)$paymentData['external_reference'];

        if ($order_id > 0) {
            // Intenção: Tratar pagamento aprovado creditando dias de Premium e registrando no livro razão
            if ($status === 'approved') {
                $order = $db->query("SELECT * FROM `myaac_donations` WHERE `id` = " . $order_id)->fetch();
                if ($order && $order['status'] !== 'completed') {
                    $installments = isset($paymentData['installments']) ? (int)$paymentData['installments'] : 1;
                    $card_brand = isset($paymentData['payment_method_id']) ? $paymentData['payment_method_id'] : null;

                    // Atualizar status para completed
                    $db->query("UPDATE `myaac_donations` SET `status` = 'completed', `updated_at` = " . time() . ", `mp_payment_id` = " . $db->quote($payment_id) . ", `installments` = " . (int)$installments . ", `card_brand` = " . ($card_brand ? $db->quote($card_brand) : "NULL") . " WHERE `id` = " . $order_id);

                    // Creditar dias de Premium direto na conta (corrige bug: compra sem ativação)
                    $premium_days = 0;
                    if (function_exists('get_donation_premium_days')) {
                        $premium_days = get_donation_premium_days($order);
                    }
                    if ($premium_days <= 0) {
                        $premium_days = 90;
                    }
                    if (function_exists('credit_premium_account')) {
                        credit_premium_account((int)$order['account_id'], $premium_days, $order_id, 'Crédito via Mercado Pago Webhook (Pagamento #' . $payment_id . ')');
                    }

                    if (function_exists('log_donation_event')) {
                        log_donation_event($order_id, $order['account_id'], 'PAYMENT_APPROVED', 'Aprovado via Webhook Mercado Pago - Payment ID: ' . $payment_id . ' - ' . $premium_days . ' dias Premium creditados');
                    }
                }
            }
            // Intenção: Tratar estorno/chargeback e acionar reversão e banimento em cadeia
            elseif (in_array($status, array('charged_back', 'refunded', 'in_refund'), true)) {
                if (function_exists('revert_fraudulent_donation')) {
                    revert_fraudulent_donation($order_id, 'Estorno / Chargeback de Doação no Cartão de Crédito');
                } else {
                    $db->query("UPDATE `myaac_donations` SET `status` = 'charged_back', `updated_at` = " . time() . " WHERE `id` = " . $order_id);
                }
            }
        }
    }
}

http_response_code(200);
echo 'OK';
