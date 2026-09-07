<?php
require 'common.php';
require 'system/init.php';

$to = 'nosleirabr@gmail.com';
$subject = 'Teste Web - Nosleira';
$body = '<h1>Teste de Envio SMTP</h1><p>Enviado via web request!</p>';

if (_mail($to, $subject, $body)) {
    echo 'SENT_SUCCESS';
} else {
    echo 'SENT_FAILED';
    global $mailer;
    if ($mailer) echo ' ERROR: ' . $mailer->ErrorInfo;
}
