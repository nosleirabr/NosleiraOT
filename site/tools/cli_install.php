<?php
/**
 * Non-interactive MyAAC install for Docker.
 * Usage (inside container): php tools/cli_install.php
 */
if (PHP_SAPI !== 'cli') {
	fwrite(STDERR, "CLI only\n");
	exit(1);
}

putenv('CI=1');
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
$_SERVER['HTTP_HOST'] = '127.0.0.1:8080';
$_SERVER['REQUEST_URI'] = '/';
$_SERVER['SERVER_NAME'] = '127.0.0.1';

define('MYAAC_INSTALL', true);

require __DIR__ . '/../common.php';
require SYSTEM . 'functions.php';
require BASE . 'install/includes/functions.php';
require BASE . 'install/includes/locale.php';
require SYSTEM . 'clients.conf.php';

use MyAAC\Cache\Cache;
use MyAAC\DataLoader;
use MyAAC\Models\FAQ as ModelsFAQ;
use MyAAC\Models\News;
use MyAAC\Settings;

$adminAccount = getenv('MYAAC_ADMIN_ACCOUNT') ?: 'admin';
$adminPassword = getenv('MYAAC_ADMIN_PASSWORD') ?: 'admin123';
$adminEmail = getenv('MYAAC_ADMIN_EMAIL') ?: 'admin@localhost';
$adminPlayer = getenv('MYAAC_ADMIN_PLAYER') ?: 'Admin';
$siteUrl = getenv('MYAAC_SITE_URL') ?: 'http://127.0.0.1:8080/';
$serverPath = getenv('MYAAC_SERVER_PATH') ?: '/srv/';

if (file_exists(BASE . 'install/install.lock')) {
	echo "MyAAC already installed (install.lock present).\n";
	exit(0);
}

if (!is_file($serverPath . 'config.lua')) {
	fwrite(STDERR, "config.lua not found at {$serverPath}config.lua — mount server data to /srv\n");
	exit(1);
}

@mkdir(CACHE, 0777, true);
@mkdir(CACHE . 'twig', 0777, true);
@mkdir(BASE . 'images/guilds', 0777, true);
@mkdir(BASE . 'images/houses', 0777, true);
@mkdir(BASE . 'images/gallery', 0777, true);

$configToSave = [
	'env' => 'prod',
	'site_url' => $siteUrl,
	'server_path' => $serverPath,
	'gzip_output' => false,
	'cache_engine' => 'auto',
	'cache_prefix' => 'myaac_' . substr(md5('ot74'), 0, 8),
	'database_auto_migrate' => true,
];

$content = '';
$saved = Settings::saveConfig($configToSave, BASE . 'config.local.php', $content);
if (!$saved && !file_exists(BASE . 'config.local.php')) {
	fwrite(STDERR, "Failed to write config.local.php\n");
	fwrite(STDERR, $content);
	exit(1);
}
echo "Wrote config.local.php\n";

// Reload config
$config = [];
require BASE . 'config.local.php';
$config['server_path'] = $serverPath;
$config['lua'] = load_config_lua($serverPath . 'config.lua');

$_SESSION = [
	'var_site_url' => $siteUrl,
	'var_server_path' => $serverPath,
	'var_date_timezone' => 'America/Sao_Paulo',
	'var_client' => 740,
	'var_usage' => 0,
	'var_account' => $adminAccount,
	'var_password' => $adminPassword,
	'var_password_confirm' => $adminPassword,
	'var_email' => $adminEmail,
	'var_player_name' => $adminPlayer,
];

require_once SYSTEM . 'libs/pot/OTS.php';
$ots = POT::getInstance();
require SYSTEM . 'database.php';
if (!isset($db)) {
	fwrite(STDERR, "Database connection failed\n");
	if (isset($error)) {
		fwrite(STDERR, $error . "\n");
	}
	exit(1);
}

if (!$db->hasTable('accounts')) {
	fwrite(STDERR, "Table accounts missing — import server schema.sql first\n");
	exit(1);
}

if (!defined('USE_ACCOUNT_NAME')) {
	define('USE_ACCOUNT_NAME', $db->hasColumn('accounts', 'name'));
}

echo "Importing MyAAC schema...\n";
try {
	$db->exec(file_get_contents(BASE . 'install/includes/schema.sql'));
	echo "Schema imported\n";
} catch (PDOException $e) {
	// tolerate re-run on partial installs
	echo "Schema note: " . $e->getMessage() . "\n";
}

require BASE . 'install/includes/import_base_data.php';

// Account columns (same as tools/5-database.php)
$alters = [];
if (!$db->hasColumn('accounts', 'email')) {
	$alters[] = "ALTER TABLE `accounts` ADD `email` varchar(255) NOT NULL DEFAULT ''";
}
if ($db->hasColumn('accounts', 'key')) {
	$alters[] = "ALTER TABLE `accounts` MODIFY `key` VARCHAR(64) NOT NULL DEFAULT ''";
} else {
	$alters[] = "ALTER TABLE `accounts` ADD `key` VARCHAR(64) NOT NULL DEFAULT '' AFTER `email`";
}
if (!$db->hasColumn('accounts', 'created')) {
	$alters[] = "ALTER TABLE `accounts` ADD `created` INT(11) NOT NULL DEFAULT 0";
}
if (!$db->hasColumn('accounts', 'rlname')) {
	$alters[] = "ALTER TABLE `accounts` ADD `rlname` VARCHAR(255) NOT NULL DEFAULT ''";
}
if (!$db->hasColumn('accounts', 'location')) {
	$alters[] = "ALTER TABLE `accounts` ADD `location` VARCHAR(255) NOT NULL DEFAULT ''";
}
if (!$db->hasColumn('accounts', 'country')) {
	$alters[] = "ALTER TABLE `accounts` ADD `country` VARCHAR(3) NOT NULL DEFAULT ''";
}
if (!$db->hasColumn('accounts', 'web_lastlogin')) {
	$alters[] = "ALTER TABLE `accounts` ADD `web_lastlogin` INT(11) NOT NULL DEFAULT 0";
}
if (!$db->hasColumn('accounts', 'web_flags')) {
	$alters[] = "ALTER TABLE `accounts` ADD `web_flags` INT(11) NOT NULL DEFAULT 0";
}
if (!$db->hasColumn('accounts', 'email_verified')) {
	$alters[] = "ALTER TABLE `accounts` ADD `email_verified` TINYINT(1) NOT NULL DEFAULT 0";
}
if (!$db->hasColumn('accounts', 'email_new')) {
	$alters[] = "ALTER TABLE `accounts` ADD `email_new` VARCHAR(255) NOT NULL DEFAULT ''";
}
if (!$db->hasColumn('accounts', 'email_new_time')) {
	$alters[] = "ALTER TABLE `accounts` ADD `email_new_time` INT(11) NOT NULL DEFAULT 0";
}
if (!$db->hasColumn('accounts', 'email_code')) {
	$alters[] = "ALTER TABLE `accounts` ADD `email_code` VARCHAR(255) NOT NULL DEFAULT ''";
}
if (!$db->hasColumn('accounts', 'email_next')) {
	$alters[] = "ALTER TABLE `accounts` ADD `email_next` INT(11) NOT NULL DEFAULT 0";
}
if (!$db->hasColumn('accounts', 'premium_points')) {
	$alters[] = "ALTER TABLE `accounts` ADD `premium_points` INT(11) NOT NULL DEFAULT 0";
}

foreach ($alters as $sql) {
	try {
		$db->query($sql);
	} catch (Throwable $e) {
		echo "Alter skip: " . $e->getMessage() . "\n";
	}
}

if ($db->hasTable('players') && !$db->hasColumn('players', 'created')) {
	try {
		$db->query("ALTER TABLE `players` ADD `created` INT(11) NOT NULL DEFAULT 0");
	} catch (Throwable $e) {
	}
}
if ($db->hasTable('players') && !$db->hasColumn('players', 'hide')) {
	try {
		$db->query("ALTER TABLE `players` ADD `hide` TINYINT(1) NOT NULL DEFAULT 0");
	} catch (Throwable $e) {
	}
}
if ($db->hasTable('players') && !$db->hasColumn('players', 'comment')) {
	try {
		$db->query("ALTER TABLE `players` ADD `comment` TEXT NOT NULL");
	} catch (Throwable $e) {
	}
}

echo "Creating admin account...\n";
require SYSTEM . 'init.php';

$password = $adminPassword;
$account_db = new OTS_Account();
$account_db->find($adminAccount);

$player_db = new OTS_Player();
$player_db->find($adminPlayer);
$groups = new OTS_Groups_List();

if ($account_db->isLoaded()) {
	$account_db->setPassword(encrypt($password));
	$account_db->setEMail($adminEmail);
	$account_db->save();
	$account_used = $account_db;
} else {
	$new_account = new OTS_Account();
	$new_account->create($adminAccount);
	$new_account->setPassword(encrypt($password));
	$new_account->setEMail($adminEmail);
	$new_account->save();
	$new_account->setCustomField('created', time());
	$account_used = $new_account;
}

$account_used->setCustomField('web_flags', FLAG_ADMIN + FLAG_SUPER_ADMIN);
$account_used->setCustomField('country', 'br');
$account_used->setCustomField('email_verified', 1);
if ($db->hasColumn('accounts', 'type')) {
	$account_used->setCustomField('type', 6);
}

if (!$player_db->isLoaded()) {
	$player = new OTS_Player();
	$player->setName($adminPlayer);
	$player->setGroupId($groups->getHighestId());
	$player->setAccountId($account_used->getId());
	$player->save();
} else {
	$player_db->setAccountId($account_used->getId());
	$player_db->setGroupId($groups->getHighestId());
	$player_db->save();
}

if (!News::all()->count()) {
	$player_id = 0;
	$tmpNewsPlayer = \MyAAC\Models\Player::where('name', $adminPlayer)->first();
	if ($tmpNewsPlayer) {
		$player_id = $tmpNewsPlayer->id;
	}
	News::create([
		'type' => 1,
		'date' => time(),
		'category' => 2,
		'title' => 'Hello!',
		'body' => 'MyAAC is ready — OT 7.4 stack.',
		'player_id' => $player_id,
		'comments' => '',
		'hide' => 0,
	]);
}

$settings = Settings::getInstance();
$settings->updateInDatabase('core', 'anonymous_usage_statistics', 'false');
$settings->updateInDatabase('core', 'date_timezone', 'America/Sao_Paulo');
$settings->updateInDatabase('core', 'client', '740');

echo "Running finish migrations...\n";
DataLoader::setLocale($locale);
DataLoader::load();
clearCache();

foreach ([17, 20, 22, 27, 30, 31, 45] as $mig) {
	$file = SYSTEM . "migrations/{$mig}.php";
	if (is_file($file)) {
		require_once $file;
		if (isset($up) && is_callable($up)) {
			$up();
		}
		unset($up);
	}
}

if (ModelsFAQ::count() == 0) {
	ModelsFAQ::create([
		'question' => 'What is this?',
		'answer' => 'Website for the Tibia 7.4 OT server powered by MyAAC.',
	]);
}

if ($db->hasTable('players')) {
	$deleted = $db->hasColumn('players', 'deletion') ? 'deletion' : 'deleted';
	$time = time();
	$samples = [
		['Rook Sample', 1, 0, 150, 150, 0, 128, 0, 0, 100, 400],
		['Sorcerer Sample', 8, 1, 185, 185, 4200, 128, 90, 90, 100, 470],
		['Druid Sample', 8, 2, 185, 185, 4200, 128, 90, 90, 100, 470],
		['Paladin Sample', 8, 3, 185, 185, 4200, 128, 90, 90, 100, 470],
		['Knight Sample', 8, 4, 185, 185, 4200, 128, 90, 90, 100, 470],
	];
	foreach ($samples as $s) {
		$q = $db->query('SELECT `id` FROM `players` WHERE `name` = ' . $db->quote($s[0]));
		if ($q->rowCount() == 0) {
			$db->query("INSERT INTO `players` (`name`, `group_id`, `account_id`, `level`, `vocation`, `health`, `healthmax`, `experience`, `lookbody`, `lookfeet`, `lookhead`, `looklegs`, `looktype`, `maglevel`, `mana`, `manamax`, `manaspent`, `soul`, `town_id`, `posx`, `posy`, `posz`, `conditions`, `cap`, `sex`, `lastlogin`, `lastip`, `save`, `lastlogout`, `balance`, `$deleted`, `created`, `hide`, `comment`) VALUES (" .
				$db->quote($s[0]) . ", 1, " . (int)$account_used->getId() . ", {$s[1]}, {$s[2]}, {$s[3]}, {$s[4]}, {$s[5]}, 69, 76, 78, 58, {$s[6]}, 0, {$s[7]}, {$s[8]}, 0, {$s[9]}, 1, 1000, 1000, 7, '', {$s[10]}, 1, $time, 2130706433, 1, $time, 0, 0, $time, 1, '')");
		}
	}
}

@unlink(CACHE . 'install.txt');
file_put_contents(
	BASE . 'install/install.lock',
	'This file is used to prevent the installation process from running again.'
);

$cache = Cache::getInstance();
if ($cache->enabled()) {
	$cache->delete('plugins_hooks');
}
clearCache();

echo "OK — MyAAC installed.\n";
echo "Site: {$siteUrl}\n";
echo "Admin account: {$adminAccount} / {$adminPassword}\n";
echo "Admin character: {$adminPlayer}\n";
echo "Admin panel: {$siteUrl}admin/\n";
exit(0);
