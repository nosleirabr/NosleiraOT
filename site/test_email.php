<?php
require 'common.php';
require 'system/init.php';

$mailBody = $twig->render('account.welcome_mail.html.twig', array(
    'account' => '9140433',
    'password' => 'MinhaSenhaForte123'
));

echo $mailBody;
