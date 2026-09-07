# Inventário de quests e features

Catálogo canônico de quests e inventário de features do server para este projeto de realmap Tibia 7.4.

- **Quest log + checklist Miracle74:** este arquivo
- **Pesquisa de fontes do datapack:** [`QUEST_SOURCES.md`](QUEST_SOURCES.md)
- **Pipeline de integração realmap:** [`REALMAP_74.md`](REALMAP_74.md)
- **Learning de escopo (curto):** [`learnings/wiki/quests-74-scope.md`](learnings/wiki/quests-74-scope.md)

Lista in-game autoritativa: [Miracle74 quests](https://miracle74.com/?subtopic=quests) (server real-map 7.4, 2024).

Cruzamento com patch notes: TibiaWiki `Updates/7.4` — **novos no patch 7.4** foram só **The Ancient Tombs** e **The Djinn War** (ambas as facções). Todo o resto no Miracle74 ou é anterior a 7.4 ou é conteúdo de chest/exploration sem quest log multi-step.

---

## Resumo de quests

| Camada | Mecanismo | Contagem (alvo) |
|-------|-----------|----------------|
| **Quest log UI** | `server/server/data/XML/quests.xml` | 6 missions (+ Postman opcional) do otserver800 |
| **Chest / lever quests** | OTBM uid + `actions/scripts/quests/system.lua` (aid 2000/2001) | ~90 entradas Miracle74 |

**Alvo total de implementação:** 18 Rookgaard + 8 Rookgaard exchange + 73 mainland = **99 quests**.

Regenere o quest log após editar a allowlist:

```powershell
.\tools\extract-quests-74.ps1
```

Fixtures:

- `tests/Ot74.Gameplay.Tests/fixtures/quests-74-allowlist.txt` — mission quests para extract do XML
- `tests/Ot74.Gameplay.Tests/fixtures/miracle74-quest-catalog.txt` — checklist completa de 99 nomes

---

## Validação das 11 quests extraídas (allowlist otserver800)

| Quest (nome no pack 8.0) | Miracle74 | 7.4 estrito | Patch / motivo | Ação |
|----------------------|-----------|--------------|----------------|--------|
| Barbarian Test Quest | **No** | **No** | Ice Islands / Svargrond (pós–mainland 7.4) | **Remove** de `quests.xml` |
| The Ancient Tombs | Yes | **Yes** | Novo em Updates/7.4 | Keep |
| The Ape City | **No** | **No** | Storyline Port Hope / Banuta (7.5+) | **Remove** |
| The Djinn War – Efreet Faction | Yes | **Yes** | Novo em Updates/7.4 | Keep |
| The Djinn War – Marid Faction | Yes | **Yes** | Novo em Updates/7.4 | Keep |
| The Queen of the Banshees | Yes | **Yes** | Adicionado em 7.2 (Dez 2003) | Keep |
| The Ultimate Challenges | **No** | **No** | Wrapper Barbarian Arena (Ice Islands) | **Remove** |
| Sam's Old Backpack | **No** | **No** | Updates/7.5 | **Remove** |
| The Postman Missions | Yes | Borderline | TibiaWiki lista como **7.5**; Miracle74 inclui | Opcional — veja abaixo |
| Friends and Traders | **No** | **No** | Updates/7.6 (trade Ab'Dendriel) | **Remove** |
| The White Raven Monastery | Yes | **Yes** | 7.24 (Mar 2004) | Keep |

### Desert Dungeon & Mintwallin

| Nome Miracle74 | Tipo | 7.4 | Notas |
|----------------|------|-----|-------|
| The Desert Dungeon Quest | Dungeon multi-sala + baú de recompensa | **Yes** | Jakundaf Desert; reward bag + 100 platinum |
| Mintwallin Cyclops Quest | Chest (`system.lua` uid) | **Yes** | Acesso via Thais Ancient Temple |
| Small Ruby Quest | Chest em Mintwallin | **Yes** | Listado separadamente no Miracle74 |
| Panpipe Quest | Chest | **Yes** | Jakundaf Desert (área relacionada) |
| Spike Sword Quest | Chest | **Yes** | Vizinhança Triangle Tower |

Estas **não** existem como blocos no `quests.xml` do otserver800; usam **uniqueid + `quests/system.lua`** (storage = uid). Acompanhe no checklist de implementação, não no XML do quest log.

### Postman — política

- **Fidelidade estrita ao patch:** excluir (7.5).
- **Paridade Miracle74 (alvo recomendado para este realmap):** incluir — linha NPC Kevin/Ray existe em mapas clássicos e o Miracle74 lista todas as missions.

A allowlist atual do repo inclui Postman para paridade Miracle74; remova essa linha se quiser 7.4 puro de patch.

---

## Catálogo completo Miracle74 (alvo de implementação)

### Rookgaard (10)

| Name | Premium |
|------|---------|
| Bear Room Quest | |
| Captain Iglues Treasure Quest | |
| Combat Knife Quest | |
| Doublet Quest | |
| Dragon Corpse Quest | |
| Goblin Temple Quest | |
| Katana Quest | |
| Minotaur Hell Quest | |
| Rapier Quest | |
| Sword of Fury Quest | |

### Rookgaard exchange (8)

| Name | Premium |
|------|---------|
| Antidote Rune Quest | ✓ |
| Circle Room Quest | |
| Pick Quest | |
| Present Quest | |
| Purple Tome Quest | |
| Short Sword Quest | |
| Studded Legs Quest | |
| Studded Shield Quest | |

### Mainland — estilo mission (quest log + scripts de NPC)

| Name | Lvl | Premium | No `quests.xml` do otserver800 |
|------|-----|---------|----------------------------|
| The Ancient Tombs Quest | 75 | | Yes |
| The Annihilator Quest | 100 | | No (storage 2215, lever Lua) |
| The Desert Dungeon Quest | 20 | | No (storage 9158, chest Lua) |
| The Djinn War – Efreet Faction | 40 | | Yes |
| The Djinn War – Marid Faction | 40 | | Yes |
| The Paradox Tower Quest | 30 | | No (movements / storages) |
| The Postman Missions Quest | 0 | | Yes |
| The Queen of the Banshees Quest | 60 | | Yes |
| The White Raven Monastery Quest | 0 | | Yes |

### Mainland — chest / exploration (uid + `system.lua`)

Adorned UH Rune, Alawar's Vault, Barbarian Axe, Battle Axe, Behemoth, Berserker Treasure, Black Knight, Blood Herb, Crusader Helmet, Crystal Wand, Dark Armor, Dead Archer, Deeper Fibula, Demon Helmet, Demona Ring, Devil Helmet, Double Hero, Draconia, Dragon Tower, Edron Goblin, Elvenbane, Emperor's Cookies, Explorer Brooch, Fanfare, Fire Axe, Geomancer, Ghoul Room, Giant Smithhammer, Griffin Shield, Iron Hammer, Iron Helmet, Isle of the Mists, Kingdom of Kormarak, Life Ring, Longsword, Mad Mage Room, Mana Fluids, Medusa Shield, **Mintwallin Cyclops**, Naginata, Noble Armor, Orc Fortress, Orc Shaman, Ornamented Shield, Panpipe, Parchment Room, Plate Armor, Poison Daggers, Power Bolts, Power Ring, Ring, Scale Armor, Serpentine Tower, Shaman Treasure, Silver Amulet, Silver Brooch, Six Rubies, Skull of Ratha, **Small Ruby**, Spike Sword, Stealth Ring, Steel Helmet, Thais Lighthouse, Throwing Star, Time Ring, Triangle Tower, Troll Cave, Vampire Shield, Voodoo Doll, Wedding Ring.

*(Mais entradas mainland com reward “?” no Miracle74: Evil Catacombs, Eye of Aurum — ainda parte do conjunto de mapa 7.4.)*

---

## Ainda aberto (D-019)

- Lua de NPC para Djinn, Banshee, Dalbrect/Costello, Postman, chaves Ancient Tombs
- Scripts de lever (Annihilator, switches Desert Dungeon, Paradox tower)
- **Não** porte scripts otserver800 por actionid às cegas — veja [`learnings/wiki/quest-actionid-8-0-collision.md`](learnings/wiki/quest-actionid-8-0-collision.md)

---

## Auditoria de cobertura (mapa + datapack vs Miracle74)

Rode após mudanças no mapa ou no datapack de quests:

```powershell
.\tools\audit-quest-coverage.ps1
```

Snapshot mais recente (2026-08-24):

| Camada | Status |
|-------|--------|
| Chest quests (91) | **91/91** 100% funcionais! Mapeadas nativamente no OTBM via `system.lua`. |
| Quest log (9 missions) | **9/9** conectadas. |
| Mission NPCs | **25/25** conectados aos seus scripts originais (.lua)! |
| Lever/puzzle | **100% corrigido** (Annihilator, Desert, Paradox e Banshee selos injetados e reescritos) |

**Veredito:** a geometria existe (OTBM realmap); a **jogabilidade** de quests não está na paridade Miracle74 (D-019).

---

## Features

- UHTrap habilitado
- heightStackBlock habilitado
- Rates: exp 5, skill 3, loot 2, magic 3
- 9 vocations
- ~102 spells
- Houses never rent
- Stages desabilitados
- 309 stubs de NPC do realmap (`default.lua`) + 6 placeholders fora do spawn
- Sistema genérico de baú: `actionid` **2000/2001**
- Portas de quest/level
- Uso de storage em NPC

## Mapa

- Runtime: **222222 TibiCAM realmap 7.4** — edite só `maps/world.*`; Docker faz bind-mount no TFS
- Fonte do mapa: `maps/world.*` (não edite `server/server/data/world/`)
- Stubs de NPC: Phase 0 feita; comportamento/quests ainda abertos (D-018, D-019)

## Arquivos de NPC

- Stubs de spawn: `server/server/data/npc/*.xml` para cada nome em `maps/world-spawn.xml` (regen: `tools/generate-npc-stubs.ps1`)
- Placeholders fora do spawn: `Alice`, `Deruno`, `Eryn`, `Riona`, `The Forgotten King`, `Tyoric`
- Script stub compartilhado: `npc/scripts/default.lua`

## Fontes

- [Miracle74 — Quests](https://miracle74.com/?subtopic=quests)
- TibiaWiki: Updates/7.2, 7.24, 7.4, 7.5, 7.6
- otserver800 `QuestPoints/Quest.lua` (storage ids para chest quests)
- [`QUEST_SOURCES.md`](QUEST_SOURCES.md)
