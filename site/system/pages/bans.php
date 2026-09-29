<?php
/**
 * Bans
 *
 * @package   MyAAC
 * @author    Gesior <jerzyskalski@wp.pl>
 * @author    Slawkens <slawkens@gmail.com>
 * @copyright 2019 MyAAC
 * @link      https://my-aac.org
 */
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Bans list';

if (!function_exists('generate_search_form')) {
	function generate_search_form($autofocus = false) {
		global $twig;
		return $twig->render('characters.form.html.twig', [
			'link' => getLink('characters'),
			'autofocus' => $autofocus
		]);
	}
}

$configBansPerPage = (int)setting('core.bans_per_page');
if ($configBansPerPage <= 0) {
	$configBansPerPage = 20;
}

$_page = $_GET['page'] ?? 1;
if (!is_numeric($_page) || $_page < 1 || $_page > PHP_INT_MAX) {
	$_page = 1;
}

$offset = ($_page - 1) * $configBansPerPage;

/**
 * @var OTS_DB_MySQL $db
 */
$configBans = [];
$configBans['hasType'] = false;
$configBans['hasReason'] = false;

$limit = 'LIMIT ' . ($configBansPerPage + 1) . ' OFFSET ' . $offset;
$queries = [];
if ($db->hasTable('player_bans')) {
	$queries[] = 'SELECT "player" AS `ban_type`, `player_id` AS `target_id`, `reason`, `banned_at`, `expires_at`, `banned_by` FROM `player_bans`';
}
if ($db->hasTable('account_bans')) {
	$queries[] = 'SELECT "account" AS `ban_type`, `account_id` AS `target_id`, `reason`, `banned_at`, `expires_at`, `banned_by` FROM `account_bans`';
}
if ($db->hasTable('ip_bans')) {
	$queries[] = 'SELECT "ip" AS `ban_type`, `ip` AS `target_id`, `reason`, `banned_at`, `expires_at`, `banned_by` FROM `ip_bans`';
}

if (!empty($queries)) {
	$queryStr = implode(' UNION ALL ', $queries) . ' ORDER BY `banned_at` DESC ' . $limit;
	$rawBans = $db->query($queryStr)->fetchAll(PDO::FETCH_ASSOC);
}
else if ($db->hasTable('bans') && $db->hasColumn('bans', 'active')) {
	$rawBans = $db->query('SELECT * FROM `bans` WHERE `active` = 1 ORDER BY `added` DESC ' . $limit)->fetchAll(PDO::FETCH_ASSOC);
	$configBans['hasType'] = true;
	$configBans['hasReason'] = true;
}
else {
	echo 'Bans list is not supported in your distribution.';
	return;
}

if (empty($rawBans)) {
	$twig->display('bans.html.twig', [
		'bans' => [],
		'page' => $_page,
		'nextPage' => false,
	]);
	return;
}

$nextPage = false;
$i = 0;
$bans = [];

$delCol = $db->hasColumn('players', 'deletion') ? '`deletion` = 0' : ($db->hasColumn('players', 'deleted') ? '`deleted` = 0' : '1=1');

foreach ($rawBans as $ban) {
	if (++$i > $configBansPerPage) {
		$nextPage = true;
		break;
	}

	$banType = $ban['ban_type'] ?? 'account';
	$targetId = (int)($ban['target_id'] ?? ($ban['account_id'] ?? ($ban['player_id'] ?? ($ban['value'] ?? 0))));
	$ip = ($banType === 'ip') ? (int)($ban['target_id'] ?? ($ban['ip'] ?? 0)) : 0;
	$bannedAt = (int)($ban['banned_at'] ?? ($ban['added'] ?? 0));
	$expiresAt = (int)($ban['expires_at'] ?? ($ban['expires'] ?? 0));
	$bannedBy = (int)($ban['banned_by'] ?? ($ban['admin_id'] ?? 0));
	$reason = $ban['reason'] ?? '';

	$playerName = '';
	$playerLevel = null;
	$playerVocation = null;
	$outfitUrl = setting('core.outfit_images_url') . '?id=128&head=0&body=0&legs=0&feet=0';
	$isAccountNumber = false;

	// Buscar dados do jogador/conta/IP banido
	if ($banType === 'player' && $targetId > 0) {
		$pQuery = $db->query('SELECT `id`, `name`, `level`, `vocation`, `looktype`, `lookhead`, `lookbody`, `looklegs`, `lookfeet` FROM `players` WHERE `id` = ' . $targetId)->fetch();
		if ($pQuery) {
			$playerName = $pQuery['name'];
			$playerLevel = $pQuery['level'];
			$playerVocation = OTS_Toolbox::getVocationName($pQuery['vocation']);
			$outfitUrl = setting('core.outfit_images_url') . '?id=' . (int)$pQuery['looktype'] . '&head=' . (int)$pQuery['lookhead'] . '&body=' . (int)$pQuery['lookbody'] . '&legs=' . (int)$pQuery['looklegs'] . '&feet=' . (int)$pQuery['lookfeet'];
		} else {
			$playerName = 'Player #' . $targetId;
			$isAccountNumber = true;
		}
	} else if ($banType === 'account' && $targetId > 0) {
		$pQuery = $db->query('SELECT `id`, `name`, `level`, `vocation`, `looktype`, `lookhead`, `lookbody`, `looklegs`, `lookfeet`, `lookaddons` FROM `players` WHERE `account_id` = ' . $targetId . ' AND ' . $delCol . ' ORDER BY `lastlogin` DESC, `level` DESC LIMIT 1')->fetch();
		if ($pQuery) {
			$playerName = $pQuery['name'];
			$playerLevel = $pQuery['level'];
			$playerVocation = OTS_Toolbox::getVocationName($pQuery['vocation']);
			$outfitUrl = setting('core.outfit_images_url') . '?id=' . (int)$pQuery['looktype'] . '&head=' . (int)$pQuery['lookhead'] . '&body=' . (int)$pQuery['lookbody'] . '&legs=' . (int)$pQuery['looklegs'] . '&feet=' . (int)$pQuery['lookfeet'];
		} else {
			$playerName = 'Account #' . $targetId;
			$isAccountNumber = true;
		}
	} else if ($banType === 'ip' && $targetId > 0) {
		$ipAddress = long2ip($targetId);
		$pQuery = $db->query('SELECT `id`, `name`, `level`, `vocation`, `looktype`, `lookhead`, `lookbody`, `looklegs`, `lookfeet` FROM `players` WHERE `lastip` = ' . $targetId . ' AND ' . $delCol . ' ORDER BY `lastlogin` DESC LIMIT 1')->fetch();
		if ($pQuery) {
			$playerName = $pQuery['name'] . ' (IP)';
			$playerLevel = $pQuery['level'];
			$playerVocation = OTS_Toolbox::getVocationName($pQuery['vocation']);
			$outfitUrl = setting('core.outfit_images_url') . '?id=' . (int)$pQuery['looktype'] . '&head=' . (int)$pQuery['lookhead'] . '&body=' . (int)$pQuery['lookbody'] . '&legs=' . (int)$pQuery['looklegs'] . '&feet=' . (int)$pQuery['lookfeet'];
		} else {
			$playerName = 'IP: ' . $ipAddress;
			$isAccountNumber = true;
		}
	} else {
		$playerName = getPlayerNameByAccount($targetId);
		if (empty($playerName)) {
			$playerName = 'Target #' . $targetId;
			$isAccountNumber = true;
		}
	}

	// Tipo de Ban e Estilo do Badge
	$typeLabel = 'Player Ban';
	$typeBadgeBg = '#A81C1C';
	if ($banType === 'account') {
		$typeLabel = 'Account Ban';
		$typeBadgeBg = '#8B0000';
	} else if ($banType === 'ip') {
		$typeLabel = 'IP Ban';
		$typeBadgeBg = '#6A1B9A';
	} else if ($banType === 'namelock') {
		$typeLabel = 'Namelock';
		$typeBadgeBg = '#B8860B';
	}

	// Datas e Expiração
	$addedDate = format_date_br($bannedAt);
	$addedTime = date('H:i:s', $bannedAt);

	$isPermanent = ($expiresAt === -1 || $expiresAt >= 2000000000);
	$expiresDate = '';
	$expiresTime = '';
	$durationLabel = '';
	$statusBadge = '';

	if ($isPermanent) {
		$expiresDate = 'Permanente';
		$expiresTime = 'Nunca';
		$statusBadge = '<span style="background: #7B1113; color: #FFFFFF; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; display: inline-block;">Permanente</span>';
	} else {
		$expiresDate = format_date_br($expiresAt);
		$expiresTime = date('H:i:s', $expiresAt);
		$diff = $expiresAt - time();
		if ($diff > 0) {
			$days = ceil($diff / 86400);
			if ($days > 1) {
				$durationLabel = $days . ' dias restantes';
			} else {
				$hours = max(1, ceil($diff / 3600));
				$durationLabel = $hours . ' hora' . ($hours > 1 ? 's' : '') . ' restante' . ($hours > 1 ? 's' : '');
			}
			$statusBadge = '<span style="background: #C0392B; color: #FFFFFF; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; display: inline-block;">Ativo</span>';
		} else {
			$durationLabel = 'Expirado';
			$statusBadge = '<span style="background: #7F8C8D; color: #FFFFFF; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; display: inline-block;">Expirado</span>';
		}
	}

	// Membro da Staff que baniu
	$staffName = 'Autoban';
	$staffTag = '[System] ';
	$staffColor = '#666666';
	if ($bannedBy > 0) {
		$staff = $db->query('SELECT `name`, `group_id` FROM `players` WHERE `id` = ' . $bannedBy)->fetch();
		if ($staff) {
			$staffName = $staff['name'];
			$staffGid = (int)$staff['group_id'];
			if ($staffGid == 6 || stripos($staffName, 'god') !== false || stripos($staffName, 'admin') !== false) {
				$staffRole = 'GOD';
				$staffColor = '#008000';
			} elseif ($staffGid == 5 || stripos($staffName, 'cm') !== false) {
				$staffRole = 'CM';
				$staffColor = '#E60000';
			} elseif ($staffGid == 4 || stripos($staffName, 'gm') !== false) {
				$staffRole = 'GM';
				$staffColor = '#0066FF';
			} elseif ($staffGid == 3) {
				$staffRole = 'Senior Tutor';
				$staffColor = '#E6A100';
			} elseif ($staffGid == 2) {
				$staffRole = 'Tutor';
				$staffColor = '#9933FF';
			} else {
				$staffRole = 'Staff';
				$staffColor = '#004294';
			}

			if (strpos($staffName, '[') === 0) {
				$staffTag = '';
			} else {
				$staffTag = '[' . $staffRole . '] ';
			}
		} else {
			$staffName = 'Staff Member';
			$staffTag = '[GM] ';
			$staffColor = '#0066FF';
		}
	}

	$bans[] = [
		'i' => $i,
		'playerName' => $playerName,
		'playerLevel' => $playerLevel,
		'playerVocation' => $playerVocation,
		'outfit' => $outfitUrl,
		'is_account_number' => $isAccountNumber,
		'type_label' => $typeLabel,
		'type_badge_bg' => $typeBadgeBg,
		'is_permanent' => $isPermanent,
		'expiresDate' => $expiresDate,
		'expiresTime' => $expiresTime,
		'duration_label' => $durationLabel,
		'status_badge' => $statusBadge,
		'reason' => $reason,
		'staff_name' => $staffName,
		'staff_tag' => $staffTag,
		'staff_color' => $staffColor,
		'addedDate' => $addedDate,
		'addedTime' => $addedTime,
	];
}

$twig->display('bans.html.twig', [
	'bans' => $bans,
	'page' => $_page,
	'nextPage' => $nextPage,
]);
