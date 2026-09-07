<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'system/libs/PHPMailer/src/Exception.php';
require 'system/libs/PHPMailer/src/PHPMailer.php';
require 'system/libs/PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'nosleiraot@gmail.com';
    $mail->Password   = 'csuwffxildfyjrpe';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('nosleiraot@gmail.com', 'Nosleira');
    $mail->addAddress('nosleirabr@gmail.com');

    $mail->isHTML(true);
    $mail->Subject = 'Teste Final - Nosleira (Debug)';
    
    $body = '<h1>Teste final de e-mail</h1><p>Se chegou, funcionou perfeitamente com a senha do app!</p>';
    $mail->Body = $body;
    
    $mail->send();
    echo 'TEST_SUCCESS_OK';
} catch (Exception $e) {
    echo "TEST_FAILED_ERROR: {$mail->ErrorInfo}";
}
