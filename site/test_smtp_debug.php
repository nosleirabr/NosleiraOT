<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require 'common.php';
require 'system/init.php';

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
    $mail->Subject = 'Teste de Email - Nosleira (Debug)';
    
    $body = $twig->render('account.welcome_mail.html.twig', array(
        'account' => 'test_acc',
        'password' => 'Test@123'
    ));
    $mail->Body = $body;
    
    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
