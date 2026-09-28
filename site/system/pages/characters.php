<?php
/**
 * Characters
 *
 * @package   MyAAC
 * @author    Gesior <jerzyskalski@wp.pl>
 * @author    Slawkens <slawkens@gmail.com>
 * @copyright 2019 MyAAC
 * @link      https://my-aac.org
 */

use MyAAC\Models\PlayerDeath;

defined('MYAAC') or die('Direct access not allowed!');
$title = 'Characters';

$groups = new OTS_Groups_List();
function generate_search_form($autofocus = false)
{
	global $config, $twig;
	return $twig->render('characters.form.html.twig', array(
		'link' => getLink('characters'),
		'autofocus' => $autofocus
	));
}

function retrieve_former_name($name)
{
	global $oldName, $db;

	if($db->hasTable('player_namelocks') && $db->hasColumn('player_namelocks', 'name')) {
		$newNameSql = $db->query('SELECT `name`, `new_name` FROM `player_namelocks` WHERE `name` = ' . $db->quote($name));
		if($newNameSql->rowCount() > 0) // namelocked
		{
			$newNameSql = $newNameSql->fetch();
			$oldName = ' (<small><b>Former name:</b> ' . $newNameSql['name'] . '</small>)';
			return $newNameSql['new_name'];
		}
	}

	return '';
}

$name = '';
if(isset($_REQUEST['name']))
	$name = urldecode(stripslashes(ucwords(strtolower($_REQUEST['name']))));

if(empty($name))
{
	echo 'Here you can get detailed information about a certain player on ' . $config['lua']['serverName'] . '.<br/>';
	echo generate_search_form(true);
	return;
}

$name = str_replace('/', '', $name);

$oldName = '';

$player = new OTS_Player();
$player->find($name);
if(!$player->isLoaded())
{
	$tmp_zmienna = "";
	$tmp_name = retrieve_former_name($name);
	while(!empty($tmp_name))
	{
		$tmp_zmienna = $tmp_name;
		$tmp_name = retrieve_former_name($tmp_zmienna);
	}

	if(!empty($tmp_zmienna))
		$player->find($tmp_zmienna);
}

if($player->isLoaded() && !$player->isDeleted())
{
	$title = $player->getName() . ' - ' . $title;
	$account = $player->getAccount();
	$rows = 0;

	if($config['characters']['outfit'])
		$outfit = setting('core.outfit_images_url') . '?id=' . $player->getLookType() . ($db->hasColumn('players', 'lookaddons') ? '&addons=' . $player->getLookAddons() : '') . '&head=' . $player->getLookHead() . '&body=' . $player->getLookBody() . '&legs=' . $player->getLookLegs() . '&feet=' . $player->getLookFeet();

	$flag = '';
	if(setting('core.account_country')) {
		$flag = getFlagImage($account->getCountry());
	}

	$player_sex = 'Unknown';
	if(isset($config['genders'][$player->getSex()]))
		$player_sex = strtolower($config['genders'][$player->getSex()]);

	$marital_status = 'single';
	$marriage_id = $player->getMarriage();
	if($marriage_id > 0) {
		$marriage = new OTS_Player();
		$marriage->load($player->getMarriage(), array('id', 'name'), false);
		if($marriage->isLoaded()) {
			$marital_status = 'married to ' . getPlayerLink($marriage->getName());
		}
	}

	$frags_enabled = $db->hasTable('player_killers') && $config['characters']['frags'];
	$frags_count = 0;
	if($frags_enabled) {
		$query = $db->query(
			'SELECT COUNT(`player_id`) as `frags`' .
			'FROM `player_killers`' .
			'WHERE `player_id` = ' .$player->getId() . ' ' .
			'GROUP BY `player_id`' .
			'ORDER BY COUNT(`player_id`) DESC');

		if($query->rowCount() > 0)
		{
			$query = $query->fetch();
			$frags_count = $query['frags'];
		}
	}
	else if($config['characters']['frags'] && $db->hasTable('player_deaths') && $db->hasColumn('player_deaths', 'killed_by')) {
		// TFS sem tabela player_killers: conta pelas mortes registradas (servidor escreve de verdade)
		$query = $db->query(
			'SELECT COUNT(*) as `frags`' .
			'FROM `player_deaths`' .
			'WHERE `killed_by` = ' . $db->quote($player->getName()) . ' AND `is_player` = 1');
		if($query->rowCount() > 0)
		{
			$query = $query->fetch();
			$frags_count = (int)$query['frags'];
		}
	}

	$town_field = 'town';
	if($db->hasColumn('houses', 'town_id'))
		$town_field = 'town_id';
	else if($db->hasColumn('houses', 'townid'))
		$town_field = 'townid';
	else if(!$db->hasColumn('houses', 'town'))
		$town_field = false;

	if($db->hasColumn('houses', 'name')) {
		$house = $db->query('SELECT `id`, `paid`, `name`' . ($town_field != false ? ', `' . $town_field . '` as `town`' : '') . ' FROM `houses` WHERE `owner` = '.$player->getId())->fetch();
		if(isset($house['id']))
		{
			$add = '';
			if($house['paid'] > 0)
				$add = ' is paid until '.date("M d Y", $house['paid']);
		}
	}

	$rank_of_player = $player->getRank();
	if($rank_of_player->isLoaded()) {
		$guild = $rank_of_player->getGuild();
		if($guild->isLoaded()) {
			$guild_name = $guild->getName();
		}
	}

	$comment = $player->getComment();

	if($config['characters']['skills'])
	{
		if($db->hasColumn('players', 'skill_fist')) {// tfs 1.0+
			$skills_db = $db->query('SELECT `maglevel`, `skill_fist`, `skill_club`, `skill_sword`, `skill_axe`, `skill_dist`, `skill_shielding`, `skill_fishing` FROM `players` WHERE `id` = ' . $player->getId())->fetch();

			$skill_ids = array(
				POT::SKILL_MAGIC => 'maglevel',
				POT::SKILL_FIST => 'skill_fist',
				POT::SKILL_CLUB => 'skill_club',
				POT::SKILL_SWORD => 'skill_sword',
				POT::SKILL_AXE => 'skill_axe',
				POT::SKILL_DIST => 'skill_dist',
				POT::SKILL_SHIELD => 'skill_shielding',
				POT::SKILL_FISH => 'skill_fishing',
			);

			$skills = array();
			foreach($skill_ids as $skillid => $field_name) {
				$skills[] = array('skillid' => $skillid, 'value' => $skills_db[$field_name]);
			}
		}
		else {
			$skills_db = $db->query('SELECT `skillid`, `value` FROM `player_skills` WHERE `player_id` = ' . $player->getId() . ' LIMIT 7');
			$skills = $skills_db->fetchAll();
		}

		foreach($skills as &$skill) {
			$skill['name'] = getSkillName($skill['skillid']);
		}
	}

	$quests_enabled = $config['characters']['quests'] && !empty($config['quests']);
	if($quests_enabled) {
		$quests = $config['quests'];
		$sql_query_in = '';
		$i = 0;
		foreach($quests as $quest_name => $quest_storage)
		{
			if($i != 0)
				$sql_query_in .= ', ';

			$sql_query_in .= $quest_storage;
			$i++;
		}

		$storage_sql = $db->query('SELECT `key`, `value` FROM `player_storage` WHERE `player_id` = '.$player->getId().' AND `key` IN (' . $sql_query_in . ')');
		$player_storage = array();
		foreach($storage_sql as $storage)
			$player_storage[$storage['key']] = $storage['value'];

		foreach($quests as &$storage) {
			$storage = isset($player_storage[$storage]) && $player_storage[$storage] > 0;
		}
		unset($storage);
	}

	if ($db->hasTableAndColumns('player_items', ['pid', 'sid', 'itemtype'])) {
		$eq_sql = $db->query('SELECT `pid`, `itemtype` FROM player_items WHERE player_id = '.$player->getId().' AND (`pid` >= 1 and `pid` <= 10)');
				$equipment_details = [];
		for($i = 1; $i <= 10; $i++) {
			$equipment_details[$i] = false;
		}
		foreach($eq_sql as $eq) {
			$item_id = $eq['itemtype'];
			$item_desc = '';
			try {
				$item_desc = \MyAAC\Items::getDescription($item_id, 1);
			} catch (Exception $e) {}
			$img_src = config('item_images_url') . $item_id . '.gif';
			$equipment_details[$eq['pid']] = [
				'id' => $item_id,
				'name' => getItemNameById($item_id),
				'desc' => $item_desc,
				'html' => '<img src="' . $img_src . '" alt="item"/>'
			];
		}
	}

	$skulls = [
		1 => 'yellow_skull',
		2 => 'green_skull',
		3 => 'white_skull',
		4 => 'red_skull',
		5 => 'black_skull',
	];

	$dead_add_content = '';
	$deaths = array();
	if($db->hasTable('killers')) {
		$player_deaths = $db->query('SELECT `id`, `date`, `level` FROM `player_deaths` WHERE `player_id` = '.$player->getId().' ORDER BY `date` DESC LIMIT 0,10;')->fetchAll();
		if(count($player_deaths))
		{
			$number_of_rows = 0;
			foreach($player_deaths as $death)
			{
				$killers = $db->query("SELECT environment_killers.name AS monster_name, players.name AS player_name, players.deleted AS player_exists FROM killers LEFT JOIN environment_killers ON killers.id = environment_killers.kill_id
LEFT JOIN player_killers ON killers.id = player_killers.kill_id LEFT JOIN players ON players.id = player_killers.player_id
WHERE killers.death_id = '".$death['id']."' ORDER BY killers.final_hit DESC, killers.id ASC")->fetchAll();

				$description = '';
				$i = 0;
				$count = count($killers);
				foreach($killers as $killer)
				{
					$i++;
					if($killer['player_name'] != "")
					{
						if($i == 1)
							$description .= "Killed at level <b>".$death['level']."</b>";
						else if($i == $count)
							$description .= " and";
						else
							$description .= ",";

						$description .= " by ";
						if($killer['monster_name'] != "")
							$description .= $killer['monster_name']." summoned by ";

						if($killer['player_exists'] == 0)
							$description .= getPlayerLink($killer['player_name']);
						else
							$description .= $killer['player_name'];
					}
					else
					{
						if($i == 1)
							$description .= "Died at level <b>".$death['level']."</b>";
						else if($i == $count)
							$description .= " and";
						else
							$description .= ",";

						$description .= " by ".$killer['monster_name'];
					}
				}

				$deaths[] = array('time' => $death['date'], 'description' => $description . '.');
			}
		}
	} else if ($db->hasColumn('player_deaths', 'time') && $db->hasColumn('player_deaths', 'level') && $db->hasColumn('player_deaths', 'killed_by') && $db->hasColumn('player_deaths', 'is_player')) {
		$mostdamage = '';
		if($db->hasColumn('player_deaths', 'mostdamage_by'))
			$mostdamage = ', `mostdamage_by`, `mostdamage_is_player`, `unjustified`, `mostdamage_unjustified`';
		$deaths_db = $db->query('SELECT
				`player_id`, `time`, `level`, `killed_by`, `is_player`' . $mostdamage . '
				FROM `player_deaths`
				WHERE `player_id` = ' . $player->getId() . ' ORDER BY `time` DESC LIMIT 10;')->fetchAll();

		if(count($deaths_db)) {
			$number_of_rows = 0;
			foreach($deaths_db as $death)
			{
				$lasthit = ($death['is_player']) ? getPlayerLink($death['killed_by']) : $death['killed_by'];
				$description =  'Killed at level ' . $death['level'] . ' by ' . $lasthit;
				if($death['unjustified']) {
					$description .=  ' <span style="color: red; font-style: italic;">(unjustified)</span>';
				}

				$mostdmg = ($death['mostdamage_by'] !== $death['killed_by']) ? true : false;
				if($mostdmg)
				{
					$mostdmg = ($death['mostdamage_is_player']) ? getPlayerLink($death['mostdamage_by']) : $death['mostdamage_by'];
					$description .=  ' and by ' . $mostdmg;

					if ($death['mostdamage_unjustified']) {
						$description .=  ' <span style="color: red; font-style: italic;">(unjustified)</span>';
					}
				}
				else {
					$description .=  " (soloed)";
				}

				$deaths[] = array('time' => $death['time'], 'description' => $description);
			}
		}
	}

	$frags = array();
	$frags_justified = array();
	$frags_unjustified = array();
	$frag_add_content = '';
	if (true) {
		$frags_limit = 20; // frags limit to show
		$pronoun = ($player->getSex() == 0 ? 'She' : 'He');

		if ($db->hasTable('killers')) {
			$player_frags = $db->query('SELECT `player_deaths`.*, `players`.`name`, `killers`.`unjustified` FROM `player_deaths` LEFT JOIN `killers` ON `killers`.`death_id` = `player_deaths`.`id` LEFT JOIN `player_killers` ON `player_killers`.`kill_id` = `killers`.`id` LEFT JOIN `players` ON `players`.`id` = `player_deaths`.`player_id` WHERE `player_killers`.`player_id` = ' . $player->getId() . ' ORDER BY `date` DESC LIMIT 0,' . $frags_limit . ';')->fetchAll();
			if (count($player_frags)) {
				foreach ($player_frags as $frag) {
					$is_unjustified = ($frag['unjustified'] != 0);
					$desc = $pronoun . ' fragged <a href="' . getPlayerLink($frag['name'], false) . '"><b>' . $frag['name'] . '</b></a> at level ' . $frag['level'] . '. ' . ($is_unjustified ? '(<span style="color: red;">Unjustified</span>)' : '(<span style="color: green;">Justified</span>)');
					$item = array('time' => $frag['date'], 'description' => $desc, 'unjustified' => $is_unjustified);
					$frags[] = $item;
					if ($is_unjustified) {
						$frags_unjustified[] = $item;
					} else {
						$frags_justified[] = $item;
					}
				}
			}
		}
		else if($db->hasTable('player_deaths') && $db->hasColumn('player_deaths', 'killed_by')) {
			$player_frags = PlayerDeath::where('player_deaths.killed_by', $player->getName())
				->join('players', 'players.id', '=', 'player_deaths.player_id')
				->limit($frags_limit)
				->selectRaw('players.name, player_deaths.*')
				->orderBy('player_deaths.time', 'DESC')
				->get();

			if ($player_frags->count()) {
				foreach ($player_frags as $frag) {
					$is_unjustified = ($frag->unjustified != 0);
					$desc = $pronoun . ' fragged <a href="' . getPlayerLink($frag->name, false) . '"><b>' . $frag->name . '</b></a> at level ' . $frag->level . '. ' . ($is_unjustified ? '(<span style="color: red;">Unjustified</span>)' : '(<span style="color: green;">Justified</span>)');
					$item = array('time' => $frag->time, 'description' => $desc, 'unjustified' => $is_unjustified);
					$frags[] = $item;
					if ($is_unjustified) {
						$frags_unjustified[] = $item;
					} else {
						$frags_justified[] = $item;
					}
				}
			}
		}
	}

	// signature
	if(setting('core.signature_enabled')) {
		$signature_url = BASE_URL . (setting('core.friendly_urls') ? '' : 'index.php/') . urlencode($player->getName()) . '.png';
	}

	$hide = $player->isHidden();
	$is_banished = false;
	$gm_ban_info = null;
	if(!$hide) {
		if($db->hasTable('player_bans')) {
			$pBan = $db->query('SELECT `reason`, `banned_at`, `expires_at`, `banned_by` FROM `player_bans` WHERE `player_id` = ' . $player->getId() . ' AND (`expires_at` > ' . time() . ' OR `expires_at` = -1) LIMIT 1')->fetch();
			if ($pBan) {
				$is_banished = true;
				$staffName = 'Staff';
				$staffColor = '#0066FF';
				if ((int)$pBan['banned_by'] > 0) {
					$st = $db->query('SELECT `name`, `group_id` FROM `players` WHERE `id` = ' . (int)$pBan['banned_by'])->fetch();
					if ($st) {
						$staffName = $st['name'];
						$gid = (int)$st['group_id'];
						if ($gid == 6 || stripos($staffName, 'god') !== false) {
							$staffColor = '#008000';
						} elseif ($gid == 5) {
							$staffColor = '#E60000';
						} elseif ($gid == 4 || stripos($staffName, 'gm') !== false) {
							$staffColor = '#0066FF';
						}
					}
				}
				$expText = ($pBan['expires_at'] == -1 || $pBan['expires_at'] >= 2000000000) ? 'Permanent' : date('d.M.Y H:i:s', $pBan['expires_at']);
				$gm_ban_info = [
					'banned_by' => $staffName,
					'role_color' => $staffColor,
					'reason' => $pBan['reason'],
					'expires_at' => $expText,
				];
			}
		}
		if(!$is_banished && $db->hasTable('account_bans')) {
			$aBan = $db->query('SELECT `reason`, `banned_at`, `expires_at`, `banned_by` FROM `account_bans` WHERE `account_id` = ' . $account->getId() . ' AND (`expires_at` > ' . time() . ' OR `expires_at` = -1) LIMIT 1')->fetch();
			if ($aBan) {
				$is_banished = true;
				$staffName = 'Staff';
				$staffColor = '#0066FF';
				if ((int)$aBan['banned_by'] > 0) {
					$st = $db->query('SELECT `name`, `group_id` FROM `players` WHERE `id` = ' . (int)$aBan['banned_by'])->fetch();
					if ($st) {
						$staffName = $st['name'];
						$gid = (int)$st['group_id'];
						if ($gid == 6 || stripos($staffName, 'god') !== false) {
							$staffColor = '#008000';
						} elseif ($gid == 5) {
							$staffColor = '#E60000';
						} elseif ($gid == 4 || stripos($staffName, 'gm') !== false) {
							$staffColor = '#0066FF';
						}
					}
				}
				$expText = ($aBan['expires_at'] == -1 || $aBan['expires_at'] >= 2000000000) ? 'Permanent' : date('d.M.Y H:i:s', $aBan['expires_at']);
				$gm_ban_info = [
					'banned_by' => $staffName,
					'role_color' => $staffColor,
					'reason' => $aBan['reason'],
					'expires_at' => $expText,
				];
			}
		}

		$account_players = array();
		$query = $db->query('SELECT `id` FROM `players` WHERE `account_id` = ' . $account->getId() . ' ORDER BY `name`')->fetchAll();
		foreach($query as $p) {
			$_player = new OTS_Player();
			$fields = array('id', 'name', 'vocation', 'level', 'online', 'deleted', 'hide', 'looktype', 'lookhead', 'lookbody', 'looklegs', 'lookfeet', 'lookaddons');
			$_player->load($p['id'], $fields, false);
			if($_player->isLoaded() && !$_player->isHidden()) {
				$outfit_url = setting('core.outfit_images_url') . '?id=' . (int)$_player->getCustomField('looktype') . '&head=' . (int)$_player->getCustomField('lookhead') . '&body=' . (int)$_player->getCustomField('lookbody') . '&legs=' . (int)$_player->getCustomField('looklegs') . '&feet=' . (int)$_player->getCustomField('lookfeet');
				$account_players[] = array(
					'player' => $_player,
					'name' => $_player->getName(),
					'isDeleted' => $_player->isDeleted(),
					'isOnline' => $_player->isOnline(),
					'outfit' => $outfit_url,
					'level' => $_player->getLevel(),
					'vocation' => $_player->getVocationName()
				);
			}
		}
	}

	// Faixa de cargo para personagens da staff (imagens em images/staff/)
	$staff_banners = array(6 => 'admin', 5 => 'cm', 4 => 'gm', 3 => 'senior', 2 => 'tutor');
	$staff_banner = null;
	try {
		$gid = $player->getGroup()->getId();
		if(isset($staff_banners[$gid])) {
			$staff_banner = 'images/staff/' . $staff_banners[$gid] . '.png';
		}
	} catch(Exception $e) {}

	$player_ranks = array();
	$player_id = $player->getId();
	if (!$player->isHidden() && !$player->isDeleted() && $player->getGroup()->getId() < 4) {
		$cacheKey = 'player_top_ranks';
		$cache = \MyAAC\Cache\Cache::getInstance();
		$top_ranks = array();
		if ($cache->enabled() && $cache->fetch($cacheKey, $tmp)) {
			$top_ranks = unserialize($tmp);
		} else {
			$delCol = 'deleted';
			if ($db->hasColumn('players', 'deletion')) $delCol = 'deletion';
			
			$q_lvl = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `level` DESC, `experience` DESC LIMIT 1");
			$top_ranks['level'] = $q_lvl ? $q_lvl->fetchColumn() : null;
			
			$q_ml = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `maglevel` DESC, `manaspent` DESC LIMIT 1");
			$top_ranks['ml'] = $q_ml ? $q_ml->fetchColumn() : null;
			
			$q_sword = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `skill_sword` DESC, `skill_sword_tries` DESC LIMIT 1");
			$top_ranks['sword'] = $q_sword ? $q_sword->fetchColumn() : null;
			
			$q_axe = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `skill_axe` DESC, `skill_axe_tries` DESC LIMIT 1");
			$top_ranks['axe'] = $q_axe ? $q_axe->fetchColumn() : null;
			
			$q_club = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `skill_club` DESC, `skill_club_tries` DESC LIMIT 1");
			$top_ranks['club'] = $q_club ? $q_club->fetchColumn() : null;
			
			$q_fist = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `skill_fist` DESC, `skill_fist_tries` DESC LIMIT 1");
			$top_ranks['fist'] = $q_fist ? $q_fist->fetchColumn() : null;
			
			$q_dist = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `skill_dist` DESC, `skill_dist_tries` DESC LIMIT 1");
			$top_ranks['distance'] = $q_dist ? $q_dist->fetchColumn() : null;
			
			$q_shield = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `skill_shielding` DESC, `skill_shielding_tries` DESC LIMIT 1");
			$top_ranks['shield'] = $q_shield ? $q_shield->fetchColumn() : null;
			
			$q_fish = $db->query("SELECT `id` FROM `players` WHERE `group_id` < 4 AND `$delCol` = 0 ORDER BY `skill_fishing` DESC, `skill_fishing_tries` DESC LIMIT 1");
			$top_ranks['fish'] = $q_fish ? $q_fish->fetchColumn() : null;
			
			$q_ms = $db->query("SELECT `id` FROM `players` WHERE `vocation` IN (1, 5) AND `group_id` < 4 AND `$delCol` = 0 ORDER BY `level` DESC, `experience` DESC LIMIT 1");
			$top_ranks['ms'] = $q_ms ? $q_ms->fetchColumn() : null;
			
			$q_ed = $db->query("SELECT `id` FROM `players` WHERE `vocation` IN (2, 6) AND `group_id` < 4 AND `$delCol` = 0 ORDER BY `level` DESC, `experience` DESC LIMIT 1");
			$top_ranks['ed'] = $q_ed ? $q_ed->fetchColumn() : null;
			
			$q_rp = $db->query("SELECT `id` FROM `players` WHERE `vocation` IN (3, 7) AND `group_id` < 4 AND `$delCol` = 0 ORDER BY `level` DESC, `experience` DESC LIMIT 1");
			$top_ranks['rp'] = $q_rp ? $q_rp->fetchColumn() : null;
			
			$q_ek = $db->query("SELECT `id` FROM `players` WHERE `vocation` IN (4, 8) AND `group_id` < 4 AND `$delCol` = 0 ORDER BY `level` DESC, `experience` DESC LIMIT 1");
			$top_ranks['ek'] = $q_ek ? $q_ek->fetchColumn() : null;
			
			if ($cache->enabled()) {
				$cache->set($cacheKey, serialize($top_ranks), 60);
			}
		}

		if (isset($top_ranks['level']) && $top_ranks['level'] == $player_id) $player_ranks[] = array('title' => 'TOP LEVEL', 'offset' => 0);
		if ($top_ranks['ml'] == $player_id) $player_ranks[] = array('title' => 'TOP ML', 'offset' => 84);
		if ($top_ranks['sword'] == $player_id) $player_ranks[] = array('title' => 'TOP SWORD', 'offset' => 168);
		if ($top_ranks['axe'] == $player_id) $player_ranks[] = array('title' => 'TOP AXE', 'offset' => 252);
		if ($top_ranks['club'] == $player_id) $player_ranks[] = array('title' => 'TOP CLUB', 'offset' => 336);
		if ($top_ranks['fist'] == $player_id) $player_ranks[] = array('title' => 'TOP FIST', 'offset' => 420);
		if ($top_ranks['distance'] == $player_id) $player_ranks[] = array('title' => 'TOP DISTANCE', 'offset' => 504);
		if ($top_ranks['shield'] == $player_id) $player_ranks[] = array('title' => 'TOP SHIELD', 'offset' => 588);
		if ($top_ranks['fish'] == $player_id) $player_ranks[] = array('title' => 'TOP FISH', 'offset' => 672);
		if ($top_ranks['ms'] == $player_id) $player_ranks[] = array('title' => 'TOP MS', 'offset' => 756);
		if ($top_ranks['ed'] == $player_id) $player_ranks[] = array('title' => 'TOP ED', 'offset' => 840);
		if ($top_ranks['rp'] == $player_id) $player_ranks[] = array('title' => 'TOP RP', 'offset' => 924);
		if ($top_ranks['ek'] == $player_id) $player_ranks[] = array('title' => 'TOP EK', 'offset' => 1008);
	}

	$is_god_admin = false;
	if (isset($account_logged) && $account_logged->isLoaded()) {
		if (superAdmin() || (int)$account_logged->getCustomField('type') >= 6 || (int)$account_logged->getGroupId() >= 6) {
			$is_god_admin = true;
		} else {
			$godCheck = $db->query('SELECT 1 FROM `players` WHERE `account_id` = ' . (int)$account_logged->getId() . ' AND `group_id` >= 6 LIMIT 1')->fetch();
			if ($godCheck) {
				$is_god_admin = true;
			}
		}
	}

	$twig->display('characters.html.twig', array(
		'player_ranks' => $player_ranks,
		'outfit' => isset($outfit) ? $outfit : null,
		'player' => $player,
		'staff_banner' => $staff_banner,
		'account' => $account,
		'flag' => $flag,
		'oldName' => $oldName,
		'sex' => $player_sex,
		'marriage_enabled' => $config['characters']['marriage_info'] && $db->hasColumn('players', 'marriage'),
		'marital_status' => $marital_status,
		'vocation' => $player->getVocationName(),
		'frags_enabled' => $frags_enabled,
		'frags_count' => $frags_count,
		'town' => isset($config['towns'][$player->getTownId()]) ? $config['towns'][$player->getTownId()] : null,
		'house' => array(
			'found' => isset($house['id']),
			'add' => isset($house['id']) ? $add : null,
			'name' => isset($house['id']) ? (isset($house['name']) ? $house['name'] : $house['id']) : null,
			'town' => isset($house['town']) ? ' (' . $config['towns'][$house['town']] . ')' : ''
		),
		'guild' => array(
			'rank' => isset($guild_name) ? $rank_of_player->getName() : null,
			'link' => isset($guild_name) ? getGuildLink($guild_name) : null
		),
		'comment' => !empty($comment) ? nl2br($comment) : null,
		'skills' => isset($skills) ? $skills : null,
		'quests_enabled' => $quests_enabled,
		'quests' => isset($quests) ? $quests : null,
		'equipment_details' => isset($equipment_details) ? $equipment_details : null,
		'skull' => $player->getSkullTime() > 0 && ($player->getSkull() == 4 || $player->getSkull() == 5) ? $skulls[$player->getSkull()] : null,
		'deaths' => $deaths,
		'frags' => $frags,
		'frags_justified' => $frags_justified,
		'frags_unjustified' => $frags_unjustified,
		'signature_url' => isset($signature_url) ? $signature_url : null,
		'player_link' => getPlayerLink($player->getName(), false),
		'hide' => $hide,
		'hidden' => $hide,
		'is_banished' => $is_banished,
		'gm_ban_info' => $gm_ban_info,
		'is_god_admin' => $is_god_admin,
		'admin_account_id' => $player->getAccountId(),
		'account_players' => isset($account_players) ? $account_players : null,
		'search_form' => generate_search_form(),
		'canEdit' => hasFlag(FLAG_CONTENT_PLAYERS) || superAdmin()
	));
} else {
	$search_errors[] = 'Character <b>' . $name . '</b> does not exist or has been deleted.';
	$twig->display('error_box.html.twig', array('errors' => $search_errors));
	$search_errors = array();

	$promotion = '';
	if($db->hasColumn('players', 'promotion'))
		$promotion = ', `promotion`';

	$deleted = 'deleted';
	if($db->hasColumn('players', 'deletion'))
		$deleted = 'deletion';

	$query = $db->query('SELECT `name`, `level`, `vocation`' . $promotion . ' FROM `players` WHERE `name` LIKE  ' . $db->quote('%' . $name . '%') . ' AND ' . $deleted . ' != 1 LIMIT ' . (int)setting('core.characters_search_limit') . ';');
	if($query->rowCount() > 0) {
		echo 'Did you mean:<ul>';
		foreach($query as $player) {
			if(isset($player['promotion'])) {
				if((int)$player['promotion'] > 0)
					$player['vocation'] += ($player['promotion'] * $config['vocations_amount']);
			}
			echo '<li>' . getPlayerLink($player['name']) . ' (<small><strong>level ' . $player['level'] . ', ' . $config['vocations'][$player['vocation']] . '</strong></small>)</li>';
		}
		echo '</ul>';
	}

	echo generate_search_form(true);
}

if(!empty($search_errors))
	$twig->display('error_box.html.twig', array('errors' => $search_errors));


