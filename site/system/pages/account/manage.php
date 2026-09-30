<?php
/**
 * Account management
 *
 * @package   MyAAC
 * @author    Gesior <jerzyskalski@wp.pl>
 * @author    Slawkens <slawkens@gmail.com>
 * @copyright 2019 MyAAC
 * @link      https://my-aac.org
 */
defined('MYAAC') or die('Direct access not allowed!');

$title = 'Account Management';
require __DIR__ . '/login.php';
require __DIR__ . '/base.php';

if(!$logged) {
	return;
}

if(isset($_REQUEST['redirect']))
{
	$redirect = urldecode($_REQUEST['redirect']);

	// should never happen, unless hacker modify the URL
	if (!str_starts_with($redirect, BASE_URL)) {
		error('Fatal error: Cannot redirect outside the website.');
		return;
	}

	$twig->display('account.redirect.html.twig', array(
		'redirect' => $redirect
	));
	return;
}

csrfProtect();

$groups = new OTS_Groups_List();

/**
 * @var OTS_Account $account_logged
 */
$premDays = $account_logged->getPremDays();
$dayOrDays = ($premDays == 1 ? 'day' : 'days');

$vipSystemEnabled = isset($config['lua']['vipSystemEnabled']) && getBoolean($config['lua']['vipSystemEnabled']);
$premiumLabel = $vipSystemEnabled ? 'VIP' : 'Premium Account';

// Intenção: resumo Premium centralizado (dias restantes, expiração, status verde/vermelho)
$premium_summary = function_exists('get_account_premium_summary') ? get_account_premium_summary($account_logged->getId()) : array('is_premium' => false, 'remaining' => 0, 'premdays' => 0, 'expires_at' => 0);
$is_premium_account = !empty($premium_summary['is_premium']);
$prem_remaining = isset($premium_summary['remaining']) ? (int)$premium_summary['remaining'] : (int)$premDays;
$prem_expires_at = isset($premium_summary['expires_at']) ? (int)$premium_summary['expires_at'] : 0;
if ($prem_remaining <= 0) {
	$prem_remaining = (int)$premDays;
	$is_premium_account = ($account_logged->isPremium() && $premDays > 0 && $premDays != OTS_Account::GRATIS_PREMIUM_DAYS);
}
$dayOrDaysRemaining = ($prem_remaining == 1 ? 'dia' : 'dias');

if (!$is_premium_account) {
	$account_status = '<b><span style="color: red">Free Account</span></b>';
	$premium_status_class = 'free';
} else {
	$expiry_text = $prem_expires_at > 0 ? ' • expira em ' . date('d/m/Y', $prem_expires_at) : '';
	$account_status = '<b><span style="color: green">' . $premiumLabel . ' • ' . $prem_remaining . ' ' . $dayOrDaysRemaining . ' restantes' . $expiry_text . '</span></b>';
	$premium_status_class = 'premium';
}

$account_coins = (int)$account_logged->getCustomField('premium_points');

$acc_id = (int)$account_logged->getId();
$acc_name = (USE_ACCOUNT_NAME ? $account_logged->getName() : (USE_ACCOUNT_NUMBER ? $account_logged->getNumber() : $account_logged->getId()));

$stripe_donations = $db->query("SELECT * FROM `myaac_donations` WHERE (`account_id` = " . $acc_id . " OR `account_name` = " . $db->quote($acc_name) . ") AND `payment_method` = 'stripe' ORDER BY `id` DESC LIMIT 20")->fetchAll();
$pix_donations = $db->query("SELECT * FROM `myaac_donations` WHERE (`account_id` = " . $acc_id . " OR `account_name` = " . $db->quote($acc_name) . ") AND `payment_method` = 'pix' ORDER BY `id` DESC LIMIT 20")->fetchAll();
$tc_donations = $db->query("SELECT * FROM `myaac_donations` WHERE (`account_id` = " . $acc_id . " OR `account_name` = " . $db->quote($acc_name) . ") AND `payment_method` = 'tibia_coins' ORDER BY `id` DESC LIMIT 20")->fetchAll();

// Intenção: enriquecer histórico com nome do pacote PA e dias de Premium (organizado)
$enrich_premium_history = function($rows) {
	if (empty($rows) || !is_array($rows)) {
		return array();
	}
	foreach ($rows as &$r) {
		$r['premium_days_display'] = function_exists('get_donation_premium_days') ? (int)get_donation_premium_days($r) : (int)$r['coins'];
		$r['package_name_display'] = function_exists('get_donation_package_name') ? get_donation_package_name($r) : ('PA (' . (int)$r['coins'] . ' dias)');
	}
	unset($r);
	return $rows;
};
$stripe_donations = $enrich_premium_history($stripe_donations);
$pix_donations = $enrich_premium_history($pix_donations);
$tc_donations = $enrich_premium_history($tc_donations);

$recovery_key = $account_logged->getCustomField('key');
if(empty($recovery_key))
	$account_registered = '<b><span style="color: red">No</span></b>';
else
{
	if(setting('core.account_generate_new_reckey') && setting('core.mail_enabled'))
		$account_registered = '<b><span style="color: green">Yes ( <a href="' . getLink('account/register-new') . '"> Buy new Recovery Key </a> )</span></b>';
	else
		$account_registered = '<b><span style="color: green">Yes</span></b>';
}

$account_created = $account_logged->getCreated();
$account_email = $account_logged->getEMail();
$email_new_time = $account_logged->getCustomField("email_new_time");
if($email_new_time > 1)
	$email_new = $account_logged->getCustomField("email_new");
$account_rlname = $account_logged->getRLName();
$account_location = $account_logged->getLocation();
if($account_logged->isBanned())
	if($account_logged->getBanTime() > 0)
		$welcome_message = '<span style="color: red">Your account is banished until '.date("j F Y, G:i:s", $account_logged->getBanTime()).'!</span>';
	else
		$welcome_message = '<span style="color: red">Your account is banished FOREVER!</span>';
else
	$welcome_message = 'Welcome to your account!';

$email_change = '';
$email_request = false;
if($email_new_time > 1)
{
	if($email_new_time < time())
		$email_change = '<br>(You can accept <b>'.$email_new.'</b> as a new email.)';
	else
	{
		$email_change = ' <br>You can accept <b>new e-mail after '.date("j F Y", $email_new_time).".</b>";
		$email_request = true;
	}
}

$actions = array();
foreach($account_logged->getActionsLog(0, 1000) as $action) {
	$actions[] = array('action' => $action['action'], 'date' => $action['date'], 'ip' => $action['ip'] != 0 ? long2ip($action['ip']) : inet_ntop($action['ipv6']));
}

$players = array();
/** @var OTS_Players_List $account_players */
$account_players = $account_logged->getPlayersList();
$account_players->orderBy('id');

$twig->display('account.management.html.twig', array(
	'welcome_message' => $welcome_message,
	'recovery_key' => $recovery_key,
	'email_change' => $email_change,
	'email_request' => $email_request,
	'email_new_time' => $email_new_time,
	'email_new' => isset($email_new) ? $email_new : '',
	'account' => (USE_ACCOUNT_NAME ? $account_logged->getName() : (USE_ACCOUNT_NUMBER ? $account_logged->getNumber() : $account_logged->getId())),
	'account_email' => $account_email,
	'account_coins' => $account_coins,
	'account_created' => $account_created,
	'account_status' => $account_status,
	'is_premium_account' => $is_premium_account,
	'premium_status_class' => $premium_status_class,
	'premium_remaining' => $prem_remaining,
	'premium_expires_at' => $prem_expires_at,
	'premium_expires_br' => $prem_expires_at > 0 ? date('d/m/Y', $prem_expires_at) : '',
	'premium_label' => $premiumLabel,
	'account_registered' => $account_registered,
	'account_rlname' => $account_rlname,
	'account_location' => $account_location,
	'actions' => $actions,
	'players' => $account_players,
	'stripe_donations' => $stripe_donations,
	'pix_donations' => $pix_donations,
	'tc_donations' => $tc_donations
));
