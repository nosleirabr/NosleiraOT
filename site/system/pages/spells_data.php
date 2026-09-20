<?php
/**
 * Tabela e Metadados Oficiais de Spells do Tibia 7.4 para MyAAC
 * Dados sincronizados com o TibiaWiki e ícones oficiais.
 */

defined('MYAAC') or die('Direct access not allowed!');

return array (
  0 => 
  array (
    'id' => 1,
    'name' => 'Light Healing',
    'short_name' => '',
    'words' => 'exura',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Cura',
    'maglevel' => 1,
    'maglevel_display' => 'ML 1',
    'maglevel_sort' => 1,
    'mana' => 25,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
      3 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/light_healing.gif',
    'effect' => 'Restaura uma pequena quantidade de <span class="effect-heal">vida (HP)</span> do conjurador.',
  ),
  1 => 
  array (
    'id' => 2,
    'name' => 'Intense Healing',
    'short_name' => '',
    'words' => 'exura gran',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Cura',
    'maglevel' => 2,
    'maglevel_display' => 'ML 2',
    'maglevel_sort' => 2,
    'mana' => 40,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/intense_healing.gif',
    'effect' => 'Restaura uma quantidade média de <span class="effect-heal">vida (HP)</span> com boa eficiência.',
  ),
  2 => 
  array (
    'id' => 3,
    'name' => 'Ultimate Healing',
    'short_name' => '',
    'words' => 'exura vita',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Cura',
    'maglevel' => 8,
    'maglevel_display' => 'ML 8',
    'maglevel_sort' => 8,
    'mana' => 80,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/ultimate_healing.gif',
    'effect' => 'Restaura grande quantidade ou o total de <span class="effect-heal">vida (HP)</span> instantaneamente.',
  ),
  3 => 
  array (
    'id' => 4,
    'name' => 'Heal Friend',
    'short_name' => 'Sio',
    'words' => 'exura sio "nome',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Cura',
    'maglevel' => 7,
    'maglevel_display' => 'ML 7',
    'maglevel_sort' => 7,
    'mana' => 70,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/heal_friend.gif',
    'effect' => 'Cura intensamente os <span class="effect-heal">pontos de vida</span> de um aliado a distância pelo nome.',
  ),
  4 => 
  array (
    'id' => 5,
    'name' => 'Mass Healing',
    'short_name' => 'Mas Res',
    'words' => 'exura gran mas res',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Cura',
    'maglevel' => 19,
    'maglevel_display' => 'ML 19',
    'maglevel_sort' => 19,
    'mana' => 150,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/mass_healing.gif',
    'effect' => 'Cura em área todos os jogadores aliados e invocações ao redor do Druida.',
  ),
  5 => 
  array (
    'id' => 6,
    'name' => 'Antidote',
    'short_name' => '',
    'words' => 'exana pox',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Cura',
    'maglevel' => 2,
    'maglevel_display' => 'ML 2',
    'maglevel_sort' => 2,
    'mana' => 30,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
      3 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/antidote.gif',
    'effect' => '<img src="images/spells/status/poisoned.gif" class="status-mini-icon" alt="Poison" /> Neutraliza e cura instantaneamente a condição de <span class="effect-poison">envenenamento (poison)</span>.',
  ),
  6 => 
  array (
    'id' => 7,
    'name' => 'Berserk',
    'short_name' => 'Exori',
    'words' => 'exori',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Ataque',
    'maglevel' => 5,
    'maglevel_display' => 'ML 5',
    'maglevel_sort' => 5,
    'mana' => 0,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/berserk.gif',
    'effect' => '<img src="images/spells/status/physical.gif" class="status-mini-icon" alt="Physical" /> Golpe giratório com a arma causando alto <span class="effect-phys">dano físico</span> em área (1 sqm ao redor).',
  ),
  7 => 
  array (
    'id' => 8,
    'name' => 'Fire Wave',
    'short_name' => '',
    'words' => 'exevo flam hur',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Ataque',
    'maglevel' => 7,
    'maglevel_display' => 'ML 7',
    'maglevel_sort' => 7,
    'mana' => 80,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'icon' => 'images/spells/wiki/fire_wave.gif',
    'effect' => '<img src="images/spells/status/burning.gif" class="status-mini-icon" alt="Fire" /> Dispara uma onda de chamas em cone até 4 sqm à frente com <span class="effect-fire">dano de fogo</span>.',
  ),
  8 => 
  array (
    'id' => 9,
    'name' => 'Energy Beam',
    'short_name' => '',
    'words' => 'exevo vis lux',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Ataque',
    'maglevel' => 10,
    'maglevel_display' => 'ML 10',
    'maglevel_sort' => 10,
    'mana' => 100,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'icon' => 'images/spells/wiki/energy_beam.gif',
    'effect' => '<img src="images/spells/status/electrified.gif" class="status-mini-icon" alt="Energy" /> Dispara um raio concentrado em linha reta até 5 sqm com <span class="effect-energy">dano de energia</span>.',
  ),
  9 => 
  array (
    'id' => 10,
    'name' => 'Great Energy Beam',
    'short_name' => '',
    'words' => 'exevo gran vis lux',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Ataque',
    'maglevel' => 14,
    'maglevel_display' => 'ML 14',
    'maglevel_sort' => 14,
    'mana' => 200,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'icon' => 'images/spells/wiki/great_energy_beam.gif',
    'effect' => '<img src="images/spells/status/electrified.gif" class="status-mini-icon" alt="Energy" /> Dispara um feixe maciço de energia em linha reta até 8 sqm com alto <span class="effect-energy">dano</span>.',
  ),
  10 => 
  array (
    'id' => 11,
    'name' => 'Energy Wave',
    'short_name' => '',
    'words' => 'exevo mort hur',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Ataque',
    'maglevel' => 20,
    'maglevel_display' => 'ML 20',
    'maglevel_sort' => 20,
    'mana' => 250,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'icon' => 'images/spells/wiki/energy_wave.gif',
    'effect' => '<img src="images/spells/status/electrified.gif" class="status-mini-icon" alt="Energy" /> Onda triangular de energia com grande abertura frontal e extremo <span class="effect-energy">dano</span>.',
  ),
  11 => 
  array (
    'id' => 12,
    'name' => 'Poison Storm',
    'short_name' => 'Mas Pox',
    'words' => 'exevo gran mas pox',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Ataque',
    'maglevel' => 28,
    'maglevel_display' => 'ML 28',
    'maglevel_sort' => 28,
    'mana' => 600,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/poison_storm.gif',
    'effect' => '<img src="images/spells/status/poisoned.gif" class="status-mini-icon" alt="Poison" /> Tempestade de <span class="effect-poison">veneno</span> em toda a tela causando envenenamento severo.',
  ),
  12 => 
  array (
    'id' => 13,
    'name' => 'Ultimate Explosion',
    'short_name' => 'UE',
    'words' => 'exevo gran mas vis',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Ataque',
    'maglevel' => 40,
    'maglevel_display' => 'ML 40',
    'maglevel_sort' => 40,
    'mana' => 800,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'icon' => 'images/spells/wiki/ultimate_explosion.gif',
    'effect' => '<img src="images/spells/status/physical.gif" class="status-mini-icon" alt="Physical" /> Explosão catastrófica de dano devastador atingindo quase todos os alvos da tela.',
  ),
  13 => 
  array (
    'id' => 14,
    'name' => 'Challenge',
    'short_name' => 'Exeta',
    'words' => 'exeta res',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 4,
    'maglevel_display' => 'ML 4',
    'maglevel_sort' => 4,
    'mana' => 30,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Elite Knight',
    ),
    'icon' => 'images/spells/wiki/challenge.gif',
    'effect' => 'Provoca e força criaturas adjacentes a mudarem o foco e atacarem o Knight conjurador.',
  ),
  14 => 
  array (
    'id' => 15,
    'name' => 'Haste',
    'short_name' => 'Hur',
    'words' => 'utani hur',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 4,
    'maglevel_display' => 'ML 4',
    'maglevel_sort' => 4,
    'mana' => 60,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
      3 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/haste.gif',
    'effect' => '<img src="images/spells/status/strengthened.gif" class="status-mini-icon" alt="Speed" /> Aumenta a <span class="effect-speed">velocidade de movimento</span> do conjurador por 33 segundos.',
  ),
  15 => 
  array (
    'id' => 16,
    'name' => 'Strong Haste',
    'short_name' => 'Gran Hur',
    'words' => 'utani gran hur',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 8,
    'maglevel_display' => 'ML 8',
    'maglevel_sort' => 8,
    'mana' => 100,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/strong_haste.gif',
    'effect' => '<img src="images/spells/status/strengthened.gif" class="status-mini-icon" alt="Speed" /> Aumento extremo na <span class="effect-speed">velocidade de movimento</span> dos magos por 20 segundos.',
  ),
  16 => 
  array (
    'id' => 17,
    'name' => 'Magic Shield',
    'short_name' => 'Utamo',
    'words' => 'utamo vita',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 4,
    'maglevel_display' => 'ML 4',
    'maglevel_sort' => 4,
    'mana' => 50,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/magic_shield.gif',
    'effect' => '<img src="images/spells/status/magic_shield.gif" class="status-mini-icon" alt="Shield" /> Escudo místico onde todo o dano recebido é absorvido pela Mana em vez da Vida.',
  ),
  17 => 
  array (
    'id' => 18,
    'name' => 'Invisibility',
    'short_name' => 'Utana',
    'words' => 'utana vid',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 15,
    'maglevel_display' => 'ML 15',
    'maglevel_sort' => 15,
    'mana' => 210,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/invisibility.gif',
    'effect' => 'Torna o personagem <span class="effect-invis">invisível</span> para monstros comuns e jogadores por 200 segundos.',
  ),
  18 => 
  array (
    'id' => 19,
    'name' => 'Summon Creature',
    'short_name' => 'Utevo Res',
    'words' => 'utevo res "monstro',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 16,
    'maglevel_display' => 'ML 16',
    'maglevel_sort' => 16,
    'mana' => 'Var.',
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/summon_creature.gif',
    'effect' => 'Invoca uma criatura leal para lutar ao seu lado (ex: Monk, Demon Skeleton, Fire Devil).',
  ),
  19 => 
  array (
    'id' => 20,
    'name' => 'Creature Illusion',
    'short_name' => 'Illusion',
    'words' => 'utevo res ina "monstro',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 10,
    'maglevel_display' => 'ML 10',
    'maglevel_sort' => 10,
    'mana' => 100,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/creature_illusion.gif',
    'effect' => 'Transforma visualmente o conjurador na forma de uma criatura especificada por 3 minutos.',
  ),
  20 => 
  array (
    'id' => 21,
    'name' => 'Wild Growth',
    'short_name' => '',
    'words' => 'exevo grav vita',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 13,
    'maglevel_display' => 'ML 13',
    'maglevel_sort' => 13,
    'mana' => 220,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Elder Druid',
    ),
    'icon' => 'images/spells/wiki/wild_growth.gif',
    'effect' => 'Cria uma densa muralha vegetal que bloqueia a passagem de jogadores e monstros por 45s.',
  ),
  21 => 
  array (
    'id' => 22,
    'name' => 'Undead Legion',
    'short_name' => '',
    'words' => 'exana mas mort',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 15,
    'maglevel_display' => 'ML 15',
    'maglevel_sort' => 15,
    'mana' => 500,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/undead_legion.gif',
    'effect' => 'Reanima todos os corpos de monstros e humanos ao redor transformando-os em Esqueletos aliados.',
  ),
  22 => 
  array (
    'id' => 23,
    'name' => 'Levitate',
    'short_name' => '',
    'words' => 'exani hur "up / down',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 3,
    'maglevel_display' => 'ML 3',
    'maglevel_sort' => 3,
    'mana' => 50,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
      3 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/levitate.gif',
    'effect' => 'Permite levitar para subir (<span class="effect-info">up</span>) ou descer (<span class="effect-info">down</span>) andares de montanhas e penhascos.',
  ),
  23 => 
  array (
    'id' => 24,
    'name' => 'Magic Rope',
    'short_name' => '',
    'words' => 'exani tera',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 1,
    'maglevel_display' => 'ML 1',
    'maglevel_sort' => 1,
    'mana' => 20,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
      3 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/magic_rope.gif',
    'effect' => 'Funciona como uma corda mágica para subir buracos em rope spots sem precisar do item físico.',
  ),
  24 => 
  array (
    'id' => 25,
    'name' => 'Find Person',
    'short_name' => 'Exiva',
    'words' => 'exiva "nome',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 0,
    'maglevel_display' => 'ML 0',
    'maglevel_sort' => 0,
    'mana' => 20,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
      3 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/find_person.gif',
    'effect' => 'Revela a direção e distância aproximada de outro jogador no mapa.',
  ),
  25 => 
  array (
    'id' => 26,
    'name' => 'Light',
    'short_name' => '',
    'words' => 'utevo lux',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 0,
    'maglevel_display' => 'ML 0',
    'maglevel_sort' => 0,
    'mana' => 20,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
      3 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/light.gif',
    'effect' => 'Ilumina uma pequena área ao redor do personagem por 6 minutos.',
  ),
  26 => 
  array (
    'id' => 27,
    'name' => 'Great Light',
    'short_name' => '',
    'words' => 'utevo gran lux',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 3,
    'maglevel_display' => 'ML 3',
    'maglevel_sort' => 3,
    'mana' => 60,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
      3 => 'Knight',
    ),
    'icon' => 'images/spells/wiki/great_light.gif',
    'effect' => 'Ilumina uma grande área ao redor do personagem por 11 minutos.',
  ),
  27 => 
  array (
    'id' => 28,
    'name' => 'Ultimate Light',
    'short_name' => '',
    'words' => 'utevo vis lux',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 12,
    'maglevel_display' => 'ML 12',
    'maglevel_sort' => 12,
    'mana' => 140,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/ultimate_light.gif',
    'effect' => 'Ilumina intensamente toda a tela do jogador por 33 minutos.',
  ),
  28 => 
  array (
    'id' => 29,
    'name' => 'Cancel Invisibility',
    'short_name' => '',
    'words' => 'exana ina',
    'type' => 'instant',
    'type_label' => 'Instantânea',
    'group' => 'Suporte',
    'maglevel' => 12,
    'maglevel_display' => 'ML 12',
    'maglevel_sort' => 12,
    'mana' => 200,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'icon' => 'images/spells/wiki/cancel_invisibility.gif',
    'effect' => 'Dissipa a invisibilidade de todos os jogadores próximos na tela.',
  ),
  29 => 
  array (
    'id' => 30,
    'name' => 'Sudden Death',
    'short_name' => 'SD',
    'words' => 'adori vita vis',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Ataque',
    'maglevel' => 25,
    'maglevel_display' => 'ML 25 <span class="spell-ml-sub">Uso: ML 15</span>',
    'maglevel_sort' => 25,
    'mana' => 220,
    'charges' => '1x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/sudden_death.gif',
    'effect' => '<img src="images/spells/status/physical.gif" class="status-mini-icon" alt="Death" /> Dispara o mais letal ataque concentrado de <span class="effect-phys">dano de morte</span> do jogo.',
  ),
  30 => 
  array (
    'id' => 31,
    'name' => 'Ultimate Healing Rune',
    'short_name' => 'UH',
    'words' => 'adura vita',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Cura',
    'maglevel' => 11,
    'maglevel_display' => 'ML 11 <span class="spell-ml-sub">Uso: ML 4</span>',
    'maglevel_sort' => 11,
    'mana' => 100,
    'charges' => '1x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/ultimate_healing_rune.gif',
    'effect' => 'Restaura quase toda a <span class="effect-heal">vida</span> do conjurador ou aliado. Runa sagrada dos Druidas no 7.4.',
  ),
  31 => 
  array (
    'id' => 32,
    'name' => 'Heavy Magic Missile',
    'short_name' => 'HMM',
    'words' => 'adori gran',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Ataque',
    'maglevel' => 3,
    'maglevel_display' => 'ML 3 <span class="spell-ml-sub">Uso: ML 4</span>',
    'maglevel_sort' => 3,
    'mana' => 70,
    'charges' => '5x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/heavy_magic_missile.gif',
    'effect' => '<img src="images/spells/status/electrified.gif" class="status-mini-icon" alt="Energy" /> Míssil pesado de <span class="effect-energy">energia</span> com 5 cargas de alta eficiência de caça.',
  ),
  32 => 
  array (
    'id' => 33,
    'name' => 'Great Fireball',
    'short_name' => 'GFB',
    'words' => 'adori gran flam',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Ataque',
    'maglevel' => 9,
    'maglevel_display' => 'ML 9 <span class="spell-ml-sub">Uso: ML 4</span>',
    'maglevel_sort' => 9,
    'mana' => 120,
    'charges' => '2x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/great_fireball.gif',
    'effect' => '<img src="images/spells/status/burning.gif" class="status-mini-icon" alt="Fire" /> Imensa bola de <span class="effect-fire">fogo</span> atingindo vasta área circular de até 37 sqm.',
  ),
  33 => 
  array (
    'id' => 34,
    'name' => 'Explosion',
    'short_name' => '',
    'words' => 'adevo mas hur',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Ataque',
    'maglevel' => 12,
    'maglevel_display' => 'ML 12 <span class="spell-ml-sub">Uso: ML 6</span>',
    'maglevel_sort' => 12,
    'mana' => 180,
    'charges' => '3x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/explosion.gif',
    'effect' => '<img src="images/spells/status/physical.gif" class="status-mini-icon" alt="Physical" /> Detonação de <span class="effect-phys">dano físico</span> em área 3x3 (9 sqm). Muito usada por Knights e Paladins.',
  ),
  34 => 
  array (
    'id' => 35,
    'name' => 'Fireball',
    'short_name' => 'FB',
    'words' => 'adori flam',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Ataque',
    'maglevel' => 5,
    'maglevel_display' => 'ML 5 <span class="spell-ml-sub">Uso: ML 2</span>',
    'maglevel_sort' => 5,
    'mana' => 60,
    'charges' => '3x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/fireball.gif',
    'effect' => '<img src="images/spells/status/burning.gif" class="status-mini-icon" alt="Fire" /> Dispara uma bola de fogo com dano moderado em área 3x3.',
  ),
  35 => 
  array (
    'id' => 36,
    'name' => 'Light Magic Missile',
    'short_name' => 'LMM',
    'words' => 'adori',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Ataque',
    'maglevel' => 1,
    'maglevel_display' => 'ML 1 <span class="spell-ml-sub">Uso: ML 0</span>',
    'maglevel_sort' => 1,
    'mana' => 40,
    'charges' => '10x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/light_magic_missile.gif',
    'effect' => '<img src="images/spells/status/electrified.gif" class="status-mini-icon" alt="Energy" /> Míssil leve de <span class="effect-energy">energia</span> com 10 cargas para iniciantes.',
  ),
  36 => 
  array (
    'id' => 37,
    'name' => 'Magic Wall',
    'short_name' => 'MW',
    'words' => 'adevo grav tera',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Suporte',
    'maglevel' => 14,
    'maglevel_display' => 'ML 14 <span class="spell-ml-sub">Uso: ML 9</span>',
    'maglevel_sort' => 14,
    'mana' => 250,
    'charges' => '3x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/magic_wall.gif',
    'effect' => 'Cria uma barreira mágica intransponível por 20 segundos para bloquear corredores e inimigos.',
  ),
  37 => 
  array (
    'id' => 38,
    'name' => 'Paralyze',
    'short_name' => '',
    'words' => 'adana ani',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Suporte',
    'maglevel' => 35,
    'maglevel_display' => 'ML 35 <span class="spell-ml-sub">Uso: ML 18</span>',
    'maglevel_sort' => 35,
    'mana' => 900,
    'charges' => '1x',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/paralyze.gif',
    'effect' => 'Reduz a velocidade de movimento do alvo a quase zero até que ele use uma magia de cura.',
  ),
  38 => 
  array (
    'id' => 39,
    'name' => 'Fire Field',
    'short_name' => '',
    'words' => 'adevo grav flam',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 3,
    'maglevel_display' => 'ML 3 <span class="spell-ml-sub">Uso: ML 1</span>',
    'maglevel_sort' => 3,
    'mana' => 60,
    'charges' => '3x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/fire_field.gif',
    'effect' => '<img src="images/spells/status/burning.gif" class="status-mini-icon" alt="Fire" /> Cria um campo de fogo em cruz de 5 sqm com dano por queimadura contínua.',
  ),
  39 => 
  array (
    'id' => 40,
    'name' => 'Fire Wall',
    'short_name' => '',
    'words' => 'adevo mas grav flam',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 13,
    'maglevel_display' => 'ML 13 <span class="spell-ml-sub">Uso: ML 6</span>',
    'maglevel_sort' => 13,
    'mana' => 200,
    'charges' => '4x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/fire_wall.gif',
    'effect' => '<img src="images/spells/status/burning.gif" class="status-mini-icon" alt="Fire" /> Muralha de fogo linear de 5 sqm causando dano severo a quem atravessar.',
  ),
  40 => 
  array (
    'id' => 41,
    'name' => 'Firebomb',
    'short_name' => '',
    'words' => 'adevo mas flam',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 9,
    'maglevel_display' => 'ML 9 <span class="spell-ml-sub">Uso: ML 5</span>',
    'maglevel_sort' => 9,
    'mana' => 150,
    'charges' => '2x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/firebomb.gif',
    'effect' => '<img src="images/spells/status/burning.gif" class="status-mini-icon" alt="Fire" /> Cria uma grande área 3x3 (9 sqm) coberta por chamas ardentes.',
  ),
  41 => 
  array (
    'id' => 42,
    'name' => 'Energy Field',
    'short_name' => '',
    'words' => 'adevo grav vis',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 5,
    'maglevel_display' => 'ML 5 <span class="spell-ml-sub">Uso: ML 3</span>',
    'maglevel_sort' => 5,
    'mana' => 80,
    'charges' => '3x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/energy_field.gif',
    'effect' => '<img src="images/spells/status/electrified.gif" class="status-mini-icon" alt="Energy" /> Cria um campo de energia em 1 sqm que eletrocuta criaturas que passem por ele.',
  ),
  42 => 
  array (
    'id' => 43,
    'name' => 'Energy Wall',
    'short_name' => '',
    'words' => 'adevo mas grav vis',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 18,
    'maglevel_display' => 'ML 18 <span class="spell-ml-sub">Uso: ML 9</span>',
    'maglevel_sort' => 18,
    'mana' => 250,
    'charges' => '4x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/energy_wall.gif',
    'effect' => '<img src="images/spells/status/electrified.gif" class="status-mini-icon" alt="Energy" /> Densa muralha de energia de 5 sqm com alto dano de eletrocussão.',
  ),
  43 => 
  array (
    'id' => 44,
    'name' => 'Energybomb',
    'short_name' => '',
    'words' => 'adevo mas vis',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 18,
    'maglevel_display' => 'ML 18 <span class="spell-ml-sub">Uso: ML 10</span>',
    'maglevel_sort' => 18,
    'mana' => 220,
    'charges' => '2x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/energybomb.gif',
    'effect' => '<img src="images/spells/status/electrified.gif" class="status-mini-icon" alt="Energy" /> Cria uma área 3x3 (9 sqm) com fortes campos de energia acumulada.',
  ),
  44 => 
  array (
    'id' => 45,
    'name' => 'Poison Field',
    'short_name' => '',
    'words' => 'adevo grav pox',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 2,
    'maglevel_display' => 'ML 2 <span class="spell-ml-sub">Uso: ML 0</span>',
    'maglevel_sort' => 2,
    'mana' => 50,
    'charges' => '3x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/poison_field.gif',
    'effect' => '<img src="images/spells/status/poisoned.gif" class="status-mini-icon" alt="Poison" /> Cria um campo de veneno de 1 sqm que envenena qualquer alvo.',
  ),
  45 => 
  array (
    'id' => 46,
    'name' => 'Poison Wall',
    'short_name' => '',
    'words' => 'adevo mas grav pox',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 11,
    'maglevel_display' => 'ML 11 <span class="spell-ml-sub">Uso: ML 5</span>',
    'maglevel_sort' => 11,
    'mana' => 160,
    'charges' => '4x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/poison_wall.gif',
    'effect' => '<img src="images/spells/status/poisoned.gif" class="status-mini-icon" alt="Poison" /> Cria uma barreira reta de veneno de 5 sqm causando dano constante.',
  ),
  46 => 
  array (
    'id' => 47,
    'name' => 'Poisonbomb',
    'short_name' => '',
    'words' => 'adevo mas pox',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Campo',
    'maglevel' => 8,
    'maglevel_display' => 'ML 8 <span class="spell-ml-sub">Uso: ML 4</span>',
    'maglevel_sort' => 8,
    'mana' => 130,
    'charges' => '2x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/poisonbomb.gif',
    'effect' => '<img src="images/spells/status/poisoned.gif" class="status-mini-icon" alt="Poison" /> Cria uma área 3x3 de veneno concentrado para controle de terreno.',
  ),
  47 => 
  array (
    'id' => 48,
    'name' => 'Soulfire',
    'short_name' => '',
    'words' => 'adevo res flam',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Ataque',
    'maglevel' => 13,
    'maglevel_display' => 'ML 13 <span class="spell-ml-sub">Uso: ML 7</span>',
    'maglevel_sort' => 13,
    'mana' => 150,
    'charges' => '2x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/soulfire.gif',
    'effect' => '<img src="images/spells/status/burning.gif" class="status-mini-icon" alt="Fire" /> Incendeia o alvo com queimadura prolongada que não se apaga facilmente.',
  ),
  48 => 
  array (
    'id' => 49,
    'name' => 'Envenom',
    'short_name' => '',
    'words' => 'adevo res pox',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Ataque',
    'maglevel' => 7,
    'maglevel_display' => 'ML 7 <span class="spell-ml-sub">Uso: ML 4</span>',
    'maglevel_sort' => 7,
    'mana' => 100,
    'charges' => '2x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/envenom.gif',
    'effect' => '<img src="images/spells/status/poisoned.gif" class="status-mini-icon" alt="Poison" /> Envenena diretamente um alvo causando dano gradativo de veneno.',
  ),
  49 => 
  array (
    'id' => 50,
    'name' => 'Intense Healing Rune',
    'short_name' => 'IH',
    'words' => 'adura gran',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Cura',
    'maglevel' => 4,
    'maglevel_display' => 'ML 4 <span class="spell-ml-sub">Uso: ML 1</span>',
    'maglevel_sort' => 4,
    'mana' => 60,
    'charges' => '1x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/intense_healing_rune.gif',
    'effect' => 'Runa de cura moderada para restaurar pontos de vida próprios ou de aliados.',
  ),
  50 => 
  array (
    'id' => 51,
    'name' => 'Antidote Rune',
    'short_name' => '',
    'words' => 'adana pox',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Cura',
    'maglevel' => 5,
    'maglevel_display' => 'ML 5 <span class="spell-ml-sub">Uso: ML 0</span>',
    'maglevel_sort' => 5,
    'mana' => 50,
    'charges' => '1x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/antidote_rune.gif',
    'effect' => '<img src="images/spells/status/poisoned.gif" class="status-mini-icon" alt="Cure" /> Runa portátil para curar e neutralizar envenenamento a distância.',
  ),
  51 => 
  array (
    'id' => 52,
    'name' => 'Destroy Field',
    'short_name' => '',
    'words' => 'adito grav',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Suporte',
    'maglevel' => 6,
    'maglevel_display' => 'ML 6 <span class="spell-ml-sub">Uso: ML 3</span>',
    'maglevel_sort' => 6,
    'mana' => 60,
    'charges' => '3x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/destroy_field.gif',
    'effect' => 'Remove e dissipa campos de fogo, energia ou veneno em 1 sqm à distância.',
  ),
  52 => 
  array (
    'id' => 53,
    'name' => 'Desintegrate',
    'short_name' => '',
    'words' => 'adito tera',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Suporte',
    'maglevel' => 8,
    'maglevel_display' => 'ML 8 <span class="spell-ml-sub">Uso: ML 4</span>',
    'maglevel_sort' => 8,
    'mana' => 100,
    'charges' => '3x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
      2 => 'Paladin',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/desintegrate.gif',
    'effect' => 'Desintegra e destrói permanentemente corpos ou itens jogados no chão adjacente.',
  ),
  53 => 
  array (
    'id' => 54,
    'name' => 'Convince Creature',
    'short_name' => '',
    'words' => 'adeta sio',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Suporte',
    'maglevel' => 10,
    'maglevel_display' => 'ML 10 <span class="spell-ml-sub">Uso: ML 5</span>',
    'maglevel_sort' => 10,
    'mana' => 100,
    'charges' => '1x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/convince_creature.gif',
    'effect' => 'Doma e convence um monstro selvagem a se tornar seu aliado leal.',
  ),
  54 => 
  array (
    'id' => 55,
    'name' => 'Chameleon',
    'short_name' => '',
    'words' => 'adevo ina',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Suporte',
    'maglevel' => 11,
    'maglevel_display' => 'ML 11 <span class="spell-ml-sub">Uso: ML 4</span>',
    'maglevel_sort' => 11,
    'mana' => 150,
    'charges' => '1x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Todas',
    ),
    'icon' => 'images/spells/wiki/chameleon.gif',
    'effect' => 'Camufla o conjurador na forma visual de qualquer objeto estático do cenário.',
  ),
  55 => 
  array (
    'id' => 56,
    'name' => 'Animate Dead',
    'short_name' => '',
    'words' => 'adana mort',
    'type' => 'rune',
    'type_label' => 'Runa',
    'group' => 'Runa de Suporte',
    'maglevel' => 7,
    'maglevel_display' => 'ML 7 <span class="spell-ml-sub">Uso: ML 4</span>',
    'maglevel_sort' => 7,
    'mana' => 300,
    'charges' => '1x',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'use_vocations' => 
    array (
      0 => 'Sorcerer',
      1 => 'Druid',
    ),
    'icon' => 'images/spells/wiki/animate_dead.gif',
    'effect' => 'Ergue um Esqueleto aliado permanente a partir de um cadáver fresco no chão.',
  ),
  56 => 
  array (
    'id' => 57,
    'name' => 'Create Food',
    'short_name' => '',
    'words' => 'exevo pan',
    'type' => 'conjure',
    'type_label' => 'Conjuração',
    'group' => 'Conjuração',
    'maglevel' => 0,
    'maglevel_display' => 'ML 0',
    'maglevel_sort' => 0,
    'mana' => 30,
    'charges' => '—',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Druid',
      1 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/create_food.gif',
    'effect' => '<img src="images/spells/status/hungry.gif" class="status-mini-icon" alt="Food" /> Conjura diversos alimentos para manter a regeneração de vida e mana ativa.',
  ),
  57 => 
  array (
    'id' => 58,
    'name' => 'Conjure Arrow',
    'short_name' => '',
    'words' => 'exevo con',
    'type' => 'conjure',
    'type_label' => 'Conjuração',
    'group' => 'Conjuração',
    'maglevel' => 2,
    'maglevel_display' => 'ML 2',
    'maglevel_sort' => 2,
    'mana' => 40,
    'charges' => '30x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/conjure_arrow.gif',
    'effect' => 'Conjura 30 flechas normais para arco instantaneamente.',
  ),
  58 => 
  array (
    'id' => 59,
    'name' => 'Conjure Bolt',
    'short_name' => '',
    'words' => 'exevo con mort',
    'type' => 'conjure',
    'type_label' => 'Conjuração',
    'group' => 'Conjuração',
    'maglevel' => 6,
    'maglevel_display' => 'ML 6',
    'maglevel_sort' => 6,
    'mana' => 70,
    'charges' => '20x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/conjure_bolt.gif',
    'effect' => 'Conjura 20 virotes pesados (bolts) para uso com besta (Crossbow).',
  ),
  59 => 
  array (
    'id' => 60,
    'name' => 'Explosive Arrow',
    'short_name' => '',
    'words' => 'exevo con flam',
    'type' => 'conjure',
    'type_label' => 'Conjuração',
    'group' => 'Conjuração',
    'maglevel' => 10,
    'maglevel_display' => 'ML 10',
    'maglevel_sort' => 10,
    'mana' => 120,
    'charges' => '10x',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/explosive_arrow.gif',
    'effect' => '<img src="images/spells/status/physical.gif" class="status-mini-icon" alt="Burst" /> Conjura 10 Burst Arrows com dano em área circular baseado em Magic Level.',
  ),
  60 => 
  array (
    'id' => 61,
    'name' => 'Poisoned Arrow',
    'short_name' => '',
    'words' => 'exevo con pox',
    'type' => 'conjure',
    'type_label' => 'Conjuração',
    'group' => 'Conjuração',
    'maglevel' => 5,
    'maglevel_display' => 'ML 5',
    'maglevel_sort' => 5,
    'mana' => 70,
    'charges' => '20x',
    'premium' => 0,
    'vocations' => 
    array (
      0 => 'Paladin',
    ),
    'icon' => 'images/spells/wiki/poisoned_arrow.gif',
    'effect' => '<img src="images/spells/status/poisoned.gif" class="status-mini-icon" alt="Poison" /> Conjura 20 flechas com ponta envenenada que infligem veneno no alvo.',
  ),
  61 => 
  array (
    'id' => 62,
    'name' => 'Power Bolt',
    'short_name' => '',
    'words' => 'exevo con vis',
    'type' => 'conjure',
    'type_label' => 'Conjuração',
    'group' => 'Conjuração',
    'maglevel' => 14,
    'maglevel_display' => 'ML 14',
    'maglevel_sort' => 14,
    'mana' => 200,
    'charges' => '2x',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Royal Paladin',
    ),
    'icon' => 'images/spells/wiki/power_bolt.gif',
    'effect' => 'Conjura 2 poderosos Power Bolts de alto impacto físico para Royal Paladins.',
  ),
  62 => 
  array (
    'id' => 63,
    'name' => 'Enchant Staff',
    'short_name' => '',
    'words' => 'exeta vis',
    'type' => 'conjure',
    'type_label' => 'Conjuração',
    'group' => 'Conjuração',
    'maglevel' => 22,
    'maglevel_display' => 'ML 22',
    'maglevel_sort' => 22,
    'mana' => 80,
    'charges' => '—',
    'premium' => 1,
    'vocations' => 
    array (
      0 => 'Master Sorcerer',
    ),
    'icon' => 'images/spells/wiki/enchant_staff.gif',
    'effect' => 'Encanta temporariamente um simples cajado de madeira (Staff) em uma arma mágica.',
  ),
);
