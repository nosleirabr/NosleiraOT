<?php
/**
 * Server info
 *
 * @package   MyAAC
 * @author    Gesior <jerzyskalski@wp.pl>
 * @author    Slawkens <slawkens@gmail.com>
 * @author    whiteblXK
 * @copyright 2019 MyAAC
 * @link      https://my-aac.org
 */
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Server info';

if(isset($config['lua']['experience_stages']))
    $config['lua']['experienceStages'] = $config['lua']['experience_stages'];

if(isset($config['lua']['min_pvp_level']))
    $config['lua']['protectionLevel'] = $config['lua']['min_pvp_level'];

$rent = trim(strtolower($config['lua']['houseRentPeriod']));
if($rent != 'yearly' && $rent != 'monthly' && $rent != 'weekly' && $rent != 'daily')
    $rent = 'never';

if(isset($config['lua']['houseCleanOld']))
    $cleanOld = (int)(eval('return ' . $config['lua']['houseCleanOld'] . ';') / (24 * 60 * 60));

if(isset($config['lua']['rate_exp']))
    $config['lua']['rateExp'] = $config['lua']['rate_exp'];
if(isset($config['lua']['rateExperience']))
    $config['lua']['rateExp'] = $config['lua']['rateExperience'];
if(isset($config['lua']['rate_mag']))
    $config['lua']['rateMagic'] = $config['lua']['rate_mag'];
if(isset($config['lua']['rate_skill']))
    $config['lua']['rateSkill'] = $config['lua']['rate_skill'];
if(isset($config['lua']['rate_loot']))
    $config['lua']['rateLoot'] = $config['lua']['rate_loot'];
if(isset($config['lua']['rate_spawn']))
    $config['lua']['rateSpawn'] = $config['lua']['rate_spawn'];

$house_level = NULL;
if(isset($config['lua']['levelToBuyHouse']))
    $house_level = $config['lua']['levelToBuyHouse'];
else if(isset($config['lua']['house_level']))
    $house_level = $config['lua']['house_level'];

if(isset($config['lua']['in_fight_duration']))
    $config['lua']['pzLocked'] = $config['lua']['in_fight_duration'];

$pzLocked = eval('return ' . $config['lua']['pzLocked'] . ';');
$whiteSkullTime = isset($config['lua']['whiteSkullTime']) ? $config['lua']['whiteSkullTime'] : NULL;
if(!isset($whiteSkullTime) && isset($config['lua']['unjust_skull_duration']))
    $whiteSkullTime = $config['lua']['unjust_skull_duration'];

if(isset($whiteSkullTime))
    $whiteSkullTime = eval('return ' . $whiteSkullTime . ';');

$redSkullLength = isset($config['lua']['redSkullLength']) ? $config['lua']['redSkullLength'] : NULL;
if(!isset($redSkullLength) && isset($config['lua']['red_skull_duration']))
    $redSkullLength = $config['lua']['red_skull_duration'];

if(isset($redSkullLength))
    $redSkullLength = eval('return ' . $redSkullLength . ';');

$blackSkull = false;
$blackSkullLength = NULL;
if(isset($config['lua']['killsToBlackSkull']) || isset($config['lua']['blackSkullLength']) || (isset($config['lua']['useBlackSkull']) && getBoolean($config['lua']['useBlackSkull'])))
{
    $blackSkullLength = isset($config['lua']['blackSkullLength']) ? eval('return (' . $config['lua']['blackSkullLength'] . ');') : 45 * 24 * 60 * 60;
    $blackSkull = true;
}

$clientVersion = '7.4';

// Custom DB Stats
$dbStats = array();
$dbStats['accounts'] = $db->query('SELECT COUNT(*) FROM `accounts`')->fetchColumn();
$dbStats['players'] = $db->query('SELECT COUNT(*) FROM `players`')->fetchColumn();
$dbStats['guilds'] = $db->query('SELECT COUNT(*) FROM `guilds`')->fetchColumn();
$dbStats['banned'] = $db->query('SELECT COUNT(*) FROM `account_bans`')->fetchColumn();
$dbStats['houses_free'] = $db->query('SELECT COUNT(*) FROM `houses` WHERE `owner` = 0')->fetchColumn();

// Last joined and Best Level
$dbStats['last_joined'] = $db->query('SELECT `name` FROM `players` ORDER BY `id` DESC LIMIT 1')->fetchColumn();
$best_level_query = $db->query('SELECT `name`, `level` FROM `players` WHERE `group_id` < 3 ORDER BY `level` DESC, `experience` DESC LIMIT 1')->fetch();
$dbStats['best_level_name'] = $best_level_query ? $best_level_query['name'] : 'None';
$dbStats['best_level'] = $best_level_query ? $best_level_query['level'] : 0;

// Count monsters and npcs
$monstersCount = 0;
$npcsCount = 0;
$spawnFile = $config['server_path'] . 'data/world/world-spawn.xml';
if (file_exists($spawnFile)) {
    $spawnContent = file_get_contents($spawnFile);
    $monstersCount = substr_count($spawnContent, '<monster ');
}

// Count NPCs from data/npc folder
$npcDir = $config['server_path'] . 'data/npc';
if (is_dir($npcDir)) {
    $npcsCount = count(glob($npcDir . '/*.xml'));
}

$twig->display('serverinfo.html.twig', array(
    'serverOnline' => isset($status['online']) ? $status['online'] : false,
    'serverPlayers' => isset($status['players']) ? $status['players'] : 0,
    'serverUptime' => isset($status['uptimeReadable']) ? $status['uptimeReadable'] : (isset($status['uptime']) ? $status['uptime'] : '0h 0m'),
    'monstersCount' => $monstersCount,
    'npcsCount' => $npcsCount,
    'experienceStages' => isset($config['lua']['experienceStages']) && getBoolean($config['lua']['experienceStages']) ? $config['lua']['experienceStages'] : null,
    'serverIp' => str_replace('/', '', str_replace('http://', '', $config['lua']['url'])),
    'clientVersion' => $clientVersion,
    'globalSaveHour' => isset($config['lua']['globalSaveEnabled']) && getBoolean($config['lua']['globalSaveEnabled']) ? $config['lua']['globalSaveHour'] : null,
    'protectionLevel' => $config['lua']['protectionLevel'],
    'houseRent' => $rent == 'never' ? 'disabled' : $rent,
    'houseOld' => isset($cleanOld) ? $cleanOld : null,
    'rateExp' => $config['lua']['rateExp'],
    'rateExpFromPlayers' => isset($config['lua']['rateExperienceFromPlayers']) ? $config['lua']['rateExperienceFromPlayers'] : null,
    'rateMagic' => $config['lua']['rateMagic'],
    'rateSkill' => $config['lua']['rateSkill'],
    'rateLoot' => $config['lua']['rateLoot'],
    'rateSpawn' => $config['lua']['rateSpawn'],
    'houseLevel' => $house_level,
    'pzLocked' => $pzLocked,
    'whiteSkullTime' => $whiteSkullTime,
    'redSkullLength' => $redSkullLength,
    'blackSkull' => $blackSkull,
    'blackSkullLength' => $blackSkullLength,
    'killsToRedSkull' => isset($config['lua']['killsToRedSkull']) ? $config['lua']['killsToRedSkull'] : null,
    'dailyFragsToRedSkull' => isset($config['lua']['dailyKillsToRedSkull']) ? $config['lua']['dailyKillsToRedSkull'] : null,
    'weeklyFragsToRedSkull' => isset($config['lua']['weeklyKillsToRedSkull']) ? $config['lua']['weeklyKillsToRedSkull'] : null,
    'monthlyFragsToRedSkull' => isset($config['lua']['monthlyKillsToRedSkull']) ? $config['lua']['monthlyKillsToRedSkull'] : null,
    'killsToBlackSkull' => isset($config['lua']['killsToBlackSkull']) ? $config['lua']['killsToBlackSkull'] : null,
    'dailyKillsToBanishment' => isset($config['lua']['dailyKillsToBanishment']) ? $config['lua']['dailyKillsToBanishment'] : null,
    'weeklyKillsToBanishment' => isset($config['lua']['weeklyKillsToBanishment']) ? $config['lua']['weeklyKillsToBanishment'] : null,
    'monthlyKillsToBanishment' => isset($config['lua']['monthlyKillsToBanishment']) ? $config['lua']['monthlyKillsToBanishment'] : null,
    'banishmentLength' => isset($config['lua']['banishment_length']) ? eval('return (' . $config['lua']['banishment_length'] . ') / (24 * 60 * 60);') : null,
    'finalBanishmentLength' => isset($config['lua']['final_banishment_length']) ? eval('return (' . $config['lua']['final_banishment_length'] . ') / (24 * 60 * 60);') : null,
    'ipBanishmentLength' => isset($config['lua']['ip_banishment_length']) ? eval('return (' . $config['lua']['ip_banishment_length'] . ') / (24 * 60 * 60);') : null,
    'dbStats' => $dbStats
));
