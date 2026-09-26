<?php
$db = new PDO('mysql:host=database_server;dbname=database', 'database', 'mv%ybJvh^^ZQ14rPoRYVZw!baT0G8%RI');
$stmt = $db->query("SELECT id FROM players WHERE account_id = 3");
while ($row = $stmt->fetch()) {
    $db->exec("INSERT IGNORE INTO player_experience (player_id, experience, date) VALUES ({$row['id']}, 0, 1790294400)");
    $db->exec("INSERT IGNORE INTO player_experience (player_id, experience, date) VALUES ({$row['id']}, 0, 1790208000)"); // 1 day ago
}
echo 'Done';
?>
