<?php
ini_set('display_errors', 1); error_reporting(E_ALL);
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Ranking of Powergamers';

$limit = 55;

// We need to calculate the exp difference for the last 7 days and today for all players
// We can use the player_experience table

$query = $db->query("SELECT `id`, `name`, `level`, (SELECT 1 FROM `players_online` WHERE `players_online`.`player_id` = `players`.`id` LIMIT 1) as online FROM `players` WHERE `group_id` < 3 AND `deletion` = 0");
$players = $query->fetchAll();

$exp_data = array();
if($db->hasTable('player_experience')) {
	$history_raw = $db->query("SELECT `player_id`, `experience`, `date` FROM `player_experience`")->fetchAll();
	
	$history_by_player = array();
	foreach($history_raw as $h) {
		$history_by_player[$h['player_id']][date('Y-m-d', $h['date'])] = $h['experience'];
	}
	
	$today_date = date('Y-m-d');
	
	foreach($players as $p) {
		$pid = $p['id'];
		$current_exp = 0;
		$current_exp_sql = $db->query("SELECT `experience` FROM `players` WHERE `id` = $pid")->fetch();
		if($current_exp_sql) $current_exp = $current_exp_sql['experience'];
		
		$today_start_exp = isset($history_by_player[$pid][$today_date]) ? $history_by_player[$pid][$today_date] : $current_exp;
		$exp_today = $current_exp - $today_start_exp;
		
		$player_days = array();
		$week_total = $exp_today;
		
		for($i = 1; $i <= 7; $i++) {
			$d1 = date('Y-m-d', strtotime("-$i days"));
			$d2 = date('Y-m-d', strtotime("-" . ($i - 1) . " days"));
			
			$exp1 = isset($history_by_player[$pid][$d1]) ? $history_by_player[$pid][$d1] : 0;
			$exp2 = isset($history_by_player[$pid][$d2]) ? $history_by_player[$pid][$d2] : 0;
			
			$diff = 0;
			if($exp1 > 0 && $exp2 > 0) {
				$diff = $exp2 - $exp1;
			}
			$player_days[] = $diff;
			$week_total += $diff;
		}
		
		if($week_total > 0 || $exp_today > 0) {
			$exp_data[] = array(
				'name' => $p['name'],
				'level' => $p['level'],
				'online' => $p['online'] ? 1 : 0,
				'week' => $week_total,
				'today' => $exp_today,
				'days' => $player_days
			);
		}
	}
}

// Sort by week_total descending
usort($exp_data, function($a, $b) {
	return $b['week'] - $a['week'];
});

$exp_data = array_slice($exp_data, 0, $limit);

$twig->display('exphist.html.twig', array(
	'exp_data' => $exp_data
));
?>
