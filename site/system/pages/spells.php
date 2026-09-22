<?php
/**
 * Spells Page - Reformulado e Sincronizado 100% com OT Server 7.4
 *
 * @package   MyAAC
 * @author    NosleiraOT Team
 * @copyright 2026 NosleiraOT
 * @link      https://my-aac.org
 */

use MyAAC\Models\Spell;

defined('MYAAC') or die('Direct access not allowed!');
$title = 'Spells (Magias & Runas 7.4)';

// Carrega metadados 100% sincronizados com o spells.xml do servidor
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

// Função auxiliar para renderizar badges de vocação
function buildVocBadges(array $vocs): string {
    if (count($vocs) >= 4) {
        return '<span class="voc-badge voc-all">Todas</span>';
    }
    $html = [];
    foreach ($vocs as $v) {
        $vLower = strtolower($v);
        $class = 'voc-default';
        if (str_contains($vLower, 'sorcerer')) $class = 'voc-sorcerer';
        elseif (str_contains($vLower, 'druid')) $class = 'voc-druid';
        elseif (str_contains($vLower, 'paladin')) $class = 'voc-paladin';
        elseif (str_contains($vLower, 'knight')) $class = 'voc-knight';
        $html[] = '<span class="voc-badge ' . $class . '">' . htmlspecialchars($v) . '</span>';
    }
    return implode(' ', $html);
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
    $vocList = array_map('strtolower', $spell['vocations']);
    $isAll = count($spell['vocations']) >= 4;

    // Badges de criação / conjuração
    $spell['vocations_html'] = buildVocBadges($spell['vocations']);

    // Para runas: monta também quem usa
    if ($spell['type'] === 'rune' && isset($spell['use_vocations'])) {
        $spell['use_vocations_html'] = buildVocBadges($spell['use_vocations']);
        
        $vocFilterParts = ['all'];
        foreach (['sorcerer', 'druid', 'paladin', 'knight'] as $vName) {
            $inMakers = false;
            foreach ($spell['vocations'] as $mv) {
                if (str_contains(strtolower($mv), $vName)) { $inMakers = true; break; }
            }
            $inUsers = false;
            foreach ($spell['use_vocations'] as $uv) {
                if (strtolower($uv) === 'todas' || str_contains(strtolower($uv), $vName)) { $inUsers = true; break; }
            }
            if ($inMakers || $inUsers) {
                $vocFilterParts[] = $vName;
            }
        }
        $spell['voc_filter'] = implode(' ', array_unique($vocFilterParts));
    } else {
        $vocFilterParts = ['all'];
        if ($isAll) {
            $vocFilterParts = ['all', 'sorcerer', 'druid', 'paladin', 'knight'];
        } else {
            foreach ($spell['vocations'] as $v) {
                $vLower = strtolower($v);
                if (str_contains($vLower, 'sorcerer')) $vocFilterParts[] = 'sorcerer';
                elseif (str_contains($vLower, 'druid')) $vocFilterParts[] = 'druid';
                elseif (str_contains($vLower, 'paladin')) $vocFilterParts[] = 'paladin';
                elseif (str_contains($vLower, 'knight')) $vocFilterParts[] = 'knight';
            }
        }
        $spell['voc_filter'] = implode(' ', array_unique($vocFilterParts));
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
