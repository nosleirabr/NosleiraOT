<?php
/**
 * Team
 *
 * @package   MyAAC
 * @author    Gesior <jerzyskalski@wp.pl>
 * @author    Slawkens <slawkens@gmail.com>
 * @copyright 2019 MyAAC
 * @link      https://my-aac.org
 */
defined('MYAAC') or die('Direct access not allowed!');
$title = 'Support in game';

if(setting('core.account_country'))
	require SYSTEM . 'countries.conf.php';

$groups = new OTS_Groups_List();
if(!$groups->count())
{
	echo 'Error while reading groups.xml';
	return;
}

$outfit_addons = false;
$outfit = '';
if(setting('core.team_outfit')) {
	$outfit = ', lookbody, lookfeet, lookhead, looklegs, looktype';
	if($db->hasColumn('players', 'lookaddons')) {
		$outfit .= ', lookaddons';
		$outfit_addons = true;
	}
}

$groupMember = array();
$groupList = $groups->getGroups();
foreach($groupList as $id => $group)
{
	if($id <= 1)
		continue;

	$group_members = $group->getPlayersList();
	if(!count($group_members))
		continue;

	$members = array();
	foreach($group_members as $member)
	{
		/** @var OTS_Player $member */
		if(!admin() && $member->isHidden())
			continue;

		$lastLogin = 'Never.';
		if($member->isOnline()) {
			$lastLogin = 'Logado';
		} elseif($member->getLastLogin() > 0) {
			$lastLogin = date("d/m/Y, H:i:s", $member->getLastLogin());
		}

		$members[] = array(
			'group_name' => $group->getName(),
			'player' => $member,
			'outfit' => setting('core.outfit_images_url') . '?id=' . $member->getLookType() . ($outfit_addons ? '&addons=' . $member->getLookAddons() : '') . '&head=' . $member->getLookHead() . '&body=' . $member->getLookBody() . '&legs=' . $member->getLookLegs() . '&feet=' . $member->getLookFeet(),
			'status' => $member->isOnline(),
			'link' => getPlayerLink($member->getName()),
			'flag_image' => setting('core.account_country') ? getFlagImage($member->getAccount()->getCountry()) : null,
			'world_name' => getWorldName(0),
			'last_login' => $lastLogin
		);
	}

	$groupMember[] = array(
		'group_name' => $group->getName(),
		'members' => $members
	);
}

$twig->display('team.html.twig', array(
	'groupmember' => $groupMember
));
