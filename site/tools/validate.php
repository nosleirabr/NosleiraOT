<?php
/**
 * Ajax validator
 * Returns json with result
 *
 * @package   MyAAC
 * @author    Slawkens <slawkens@gmail.com>
 * @copyright 2019 MyAAC
 * @link      https://my-aac.org
 */

use MyAAC\CreateCharacter;
use MyAAC\Models\Account;

const IGNORE_SET_LAST_VISIT = true;

// we need some functions
require '../common.php';
require SYSTEM . 'functions.php';
require SYSTEM . 'init.php';
require SYSTEM . 'login.php';

$error = '';
// Senha e PII só via POST — nunca em URL (logs de acesso vazam query string).
if(isset($_POST['account']))
{
	$account = $_POST['account'];
	if(USE_ACCOUNT_NAME) {
		if(!Validator::accountName($account)) {
			error_(Validator::getLastError());
		}
	}
	else if(!Validator::accountId($account)) {
		error_(Validator::getLastError());
	}

	$_account = new OTS_Account();
	if(USE_ACCOUNT_NAME || USE_ACCOUNT_NUMBER) {
		$_account->find($account);
	} else {
		$_account->load($account);
	}

	$accountNameOrNumber = (USE_ACCOUNT_NAME ? ' name' : 'number');
	if($_account->isLoaded()) {
		error_("Account with this $accountNameOrNumber already exist.");
	}

	success_("Good account $accountNameOrNumber ($account).");
}
else if(isset($_POST['email']))
{
	$email = $_POST['email'];
	if(!Validator::email($email)) {
		error_(Validator::getLastError());
	}

	if(setting('core.account_mail_unique')) {
		if(Account::where('email', '=', $email)->exists())
			error_('Account with this e-mail already exist.');
	}

	success_(1);
}
else if(isset($_POST['name']))
{
	$name = trim(stripslashes($_POST['name']));

	if(!Validator::characterName($name)) {
		error_(Validator::getLastError());
	}

	if(!admin() && !Validator::newCharacterName($name)) {
		error_(Validator::getLastError());
	}

	$createCharacter = new CreateCharacter();
	if (!$createCharacter->checkName($name, $errors)) {
		error_($errors['name']);
	}

	$extraText = '';
	if (admin()) {
		$extraText = "<br/>Note: You are logged in as admin, so you can create almost any name without rules.";
	}

	success_("Good. Your name will be:<br /><b>$name</b>$extraText");
}
else if(isset($_POST['password']) && isset($_POST['password_confirm'])) {
	$password = $_POST['password'];
	$password_confirm = $_POST['password_confirm'];

	if(!isset($password[0])) {
		error_('Please enter the password for your new account.');
	}

	if(!Validator::password($password)) {
		error_(Validator::getLastError());
	}

	if($password != $password_confirm) {
		error_('Passwords are not the same.');
	}

	success_(1);
}
else {
	error_('Error: no input specified.');
}

/**
 * Output message & exit.
 *
 * @param string $desc Description
 */
function success_($desc) {
	echo json_encode(array(
		'success' => $desc
	));
	exit();
}
function error_($desc) {
	echo json_encode(array(
		'error' => $desc
	));
	exit();
}
