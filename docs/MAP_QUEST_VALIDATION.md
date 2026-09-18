# Validação quest ↔ OTBM baked

Gerado por `otmap validate-quests` / `QuestBakeAuditTests`.

**FAIL:** 7 · **WARN:** 3 · quests YAML: 17 · questRewards: 84

## Dívida conhecida

FAILs de **YAML patch sem match/item** e **Door box** são dívida de coords/boxes vs baked OTBM — documentados aqui; Facts de regressão cobrem paredes, rewards YAML presentes, Black Knight uid+actionId, e o write deste ficheiro. Keydoor `5010` sem `IsDoor` fica WARN.

## Índice

| Severity | Category | Count |
|----------|----------|------:|
| FAIL | YAML aid ausente no tile | 1 |
| FAIL | YAML patch sem match | 5 |
| FAIL | YAML uid ausente no OTBM | 1 |
| WARN | Uid sem reward path | 3 |

## Non-chest quest containers

| Uid | ItemId | Coords |
|----:|-------:|--------|
| 2198 | 3104 | `32244,32490,10` |
| 2213 | 3058 | `32233,32491,10` |
| 2412 | 3058 | `32174,32149,11` |
| 2430 | 3058 | `32256,32499,10` |
| 2473 | 3058 | `32175,32145,11` |
| 2528 | 3065 | `32238,32470,10` |
| 10016 | 2720 | `32813,31964,7` |
| 10017 | 2720 | `32868,31955,11` |
| 10019 | 2720 | `32880,31955,11` |
| 10021 | 2720 | `32761,32013,7` |
| 10040 | 1409 | `33207,32897,14` |
| 10041 | 1409 | `33217,32897,14` |
| 10047 | 1386 | `32632,32228,8` |
| 10048 | 2720 | `32651,32244,7` |
| 10057 | 1770 | `32416,32217,15` |
| 20002 | 3058 | `32176,32132,9` |
| 54322 | 3104 | `32179,32224,9` |

## Uid sem reward path (3)

| Sev | Onde | O quê |
|-----|------|-------|
| WARN | `uid 2475 @ 32239,32476,10` | Contentor aid 2000/2001 legado sem questRewards nem contents (não está no YAML). |
| WARN | `uid 2198 @ 32244,32490,10` | Contentor aid 2000/2001 legado sem questRewards nem contents (não está no YAML). |
| WARN | `uid 2430 @ 32256,32499,10` | Contentor aid 2000/2001 legado sem questRewards nem contents (não está no YAML). |

## YAML aid ausente no tile (1)

| Sev | Onde | O quê |
|-----|------|-------|
| FAIL | `small_chests @ 32146,32097,11` | aid 2000 não está no item matchado. |

## YAML patch sem match (5)

| Sev | Onde | O quê |
|-----|------|-------|
| FAIL | `rookgaard @ 32039,32121,13` | Esperado match ids [1738,1739,1740,1741,1745,1746,1747,1748] ou aid/uid do patch. |
| FAIL | `banshee @ 32215,31850,15` | Esperado match ids [1740] ou aid/uid do patch. |
| FAIL | `banshee @ 32216,31850,15` | Esperado match ids [1740] ou aid/uid do patch. |
| FAIL | `banshee @ 32217,31850,15` | Esperado match ids [1740] ou aid/uid do patch. |
| FAIL | `banshee @ 32218,31850,15` | Esperado match ids [1740] ou aid/uid do patch. |

## YAML uid ausente no OTBM (1)

| Sev | Onde | O quê |
|-----|------|-------|
| FAIL | `small_chests @ 32146,32097,11` | uid 52148 não encontrado no tile nem no índice global. |
