<?php
/**
 * Spells Page - Reformulado para Tibia 7.4
 *
 * @package   MyAAC
 * @author    NosleiraOT Team & Gesior/Slawkens
 * @copyright 2026 NosleiraOT
 * @link      https://my-aac.org
 */

use MyAAC\Models\Spell;

defined('MYAAC') or die('Direct access not allowed!');
$title = 'Spells (Magias)';

// Carrega metadados fieis do 7.4
$curatedSpells = require __DIR__ . '/spells_data.php';

// Filtro de vocação inicial via GET/POST
$selectedVocation = isset($_REQUEST['vocation']) ? strtolower(trim($_REQUEST['vocation'])) : 'all';
if (isset($_REQUEST['vocation_id']) && $_REQUEST['vocation_id'] !== 'all') {
    $vocId = (int)$_REQUEST['vocation_id'];
    if (isset($config['vocations'][$vocId])) {
        $selectedVocation = strtolower($config['vocations'][$vocId]);
        if (str_contains($selectedVocation, 'sorcerer')) $selectedVocation = 'sorcerer';
        elseif (str_contains($selectedVocation, 'druid')) $selectedVocation = 'druid';
        elseif (str_contains($selectedVocation, 'paladin')) $selectedVocation = 'paladin';
        elseif (str_contains($selectedVocation, 'knight')) $selectedVocation = 'knight';
    }
}

// Mapeamento e contagens
$spells = [];
$counts = [
    'all' => 0,
    'instant' => 0,
    'rune' => 0,
    'conjure' => 0,
];

foreach ($curatedSpells as $spell) {
    // Lista de vocações em minúsculo para filtro
    $vocList = array_map('strtolower', $spell['vocations']);
    $isAll = count($spell['vocations']) >= 4;
    
    // Classes CSS e badges
    $vocBadges = [];
    if ($isAll) {
        $vocBadges[] = '<span class="voc-badge voc-all">Todas</span>';
    } else {
        foreach ($spell['vocations'] as $v) {
            $vLower = strtolower($v);
            $class = 'voc-default';
            if (str_contains($vLower, 'sorcerer')) $class = 'voc-sorcerer';
            elseif (str_contains($vLower, 'druid')) $class = 'voc-druid';
            elseif (str_contains($vLower, 'paladin')) $class = 'voc-paladin';
            elseif (str_contains($vLower, 'knight')) $class = 'voc-knight';
            $vocBadges[] = '<span class="voc-badge ' . $class . '">' . htmlspecialchars($v) . '</span>';
        }
    }
    $spell['vocations_html'] = implode(' ', $vocBadges);
    $spell['voc_filter'] = implode(' ', $vocList) . ($isAll ? ' all sorcerer druid paladin knight' : '');

    // Para runas, adiciona vocações de uso ao voc_filter
    if ($spell['type'] === 'rune' && isset($spell['use_vocations'])) {
        $useList = array_map('strtolower', $spell['use_vocations']);
        $spell['voc_filter'] .= ' ' . implode(' ', $useList);
        if (str_contains(implode(' ', $useList), 'todas')) {
            $spell['voc_filter'] .= ' all sorcerer druid paladin knight';
        }
    }

    $spell['type_tab'] = $spell['type'];
    $counts['all']++;
    if (isset($counts[$spell['type']])) {
        $counts[$spell['type']]++;
    }

    $spells[] = $spell;
}

$twig->display('spells.html.twig', array(
    'spells' => $spells,
    'counts' => $counts,
    'selected_vocation' => $selectedVocation,
    'base_url' => BASE_URL,
    'item_path' => setting('core.item_images_url') ?? 'https://item-images.ots.me/772/',
));
