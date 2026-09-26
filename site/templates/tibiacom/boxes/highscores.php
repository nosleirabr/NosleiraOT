<?php

$topPlayers = getTopPlayers(5);
foreach($topPlayers as &$player) {
	$outfit_url = '';
	if (setting('core.online_outfit')) {
		$outfit_url = setting('core.outfit_images_url') . '?id=' . $player['looktype']	. (!empty
			($player['lookaddons']) ? '&addons=' . $player['lookaddons'] : '') . '&head=' . $player['lookhead'] . '&body=' . $player['lookbody'] . '&legs=' . $player['looklegs'] . '&feet=' . $player['lookfeet'];

		$player['outfit'] = $outfit_url;
	}
	$player['vocation_name'] = config('vocations')[$player['vocation']] ?? 'None';
	if(isset($player['promotion']) && $player['promotion'] > 0) {
		$player['vocation_name'] = config('vocations_promoted')[$player['promotion']][$player['vocation']] ?? $player['vocation_name'];
	}
}

$twig->display('highscores.html.twig', array(
	'topPlayers' => $topPlayers
));
