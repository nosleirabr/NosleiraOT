<?php
$a = file_get_contents('site/config.local.php');
$a = str_replace("'http://127.0.0.1'", "'http://www.nosleiraot.com'", $a);
file_put_contents('site/config.local.php', $a);

$b = file_get_contents('server/config.lua');
$b = str_replace('127.0.0.1', 'www.nosleiraot.com', $b);
file_put_contents('server/config.lua', $b);
