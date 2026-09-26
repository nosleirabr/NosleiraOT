<?php
$db = new PDO('mysql:host=database_server;dbname=database', 'database', 'mv%ybJvh^^ZQ14rPoRYVZw!baT0G8%RI');

// create account '3'
$pass = sha1('3');
$db->exec("INSERT IGNORE INTO accounts (id, name, password, email, created) VALUES (3, '3', '$pass', 'test@test.com', UNIX_TIMESTAMP())");

function expForLevel($level) {
    return (int)((50/3) * ($level*$level*$level - 6*$level*$level + 17*$level - 12));
}

$chars = [
    ['name' => 'Mage Tester', 'vocation' => 1, 'level' => 300],
    ['name' => 'Ed Tester', 'vocation' => 2, 'level' => 400],
    ['name' => 'Ek Tester', 'vocation' => 4, 'level' => 500],
    ['name' => 'Paladin Tester', 'vocation' => 3, 'level' => 900],
];

foreach ($chars as $char) {
    $exp = expForLevel($char['level']);
    $health = 150 + ($char['level'] - 8) * ($char['vocation'] == 4 ? 15 : ($char['vocation'] == 3 ? 10 : 5));
    $mana = 35 + ($char['level'] - 8) * ($char['vocation'] == 4 ? 5 : ($char['vocation'] == 3 ? 15 : 30));
    
    $db->exec("INSERT IGNORE INTO players (name, group_id, account_id, level, vocation, health, healthmax, experience, lookbody, lookfeet, lookhead, looklegs, looktype, lookaddons, maglevel, mana, manamax, manaspent, soul, town_id, posx, posy, posz, cap, sex) 
    VALUES ('{$char['name']}', 1, 3, {$char['level']}, {$char['vocation']}, $health, $health, $exp, 0, 0, 0, 0, 136, 0, 10, $mana, $mana, 0, 100, 1, 0, 0, 0, 1000, 1)");
}
echo 'Done';
?>
