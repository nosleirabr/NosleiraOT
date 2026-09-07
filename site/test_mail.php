<?php
define('MYAAC', true);
require 'system/init.php';

$to = 'nosleiraot@gmail.com';
$subject = 'MyAAC SMTP Test - ' . date('H:i:s');
$body = '<h1>Hello!</h1><p>If you received this, your SMTP configuration is working perfectly.</p>';

if (_mail($to, $subject, $body)) {
    echo "SUCCESS";
} else {
    echo "ERROR";
}
