# Validação quest ↔ OTBM baked

Gerado por `otmap validate-quests` / `QuestBakeAuditTests`.

**FAIL:** 0 · **WARN:** 2 · quests YAML: 17 · questRewards: 84

## Dívida conhecida

FAILs de **YAML patch sem match/item** e **Door box** são dívida de coords/boxes vs baked OTBM — documentados aqui; Facts de regressão cobrem paredes, rewards YAML presentes, Black Knight uid+actionId, e o write deste ficheiro. Keydoor `5010` sem `IsDoor` fica WARN.

## Índice

| Severity | Category | Count |
|----------|----------|------:|
| WARN | Black Knight chain | 1 |
| WARN | Chave sem porta | 1 |

## Non-chest quest containers

| Uid | ItemId | Coords |
|----:|-------:|--------|
| 2412 | 3058 | `32174,32149,11` |
| 2473 | 3058 | `32175,32145,11` |
| 10017 | 2720 | `32868,31955,11` |
| 10019 | 2720 | `32880,31955,11` |
| 10021 | 2720 | `32761,32013,7` |
| 10040 | 1409 | `33207,32897,14` |
| 10041 | 1409 | `33217,32897,14` |
| 10047 | 1386 | `32632,32228,8` |
| 10048 | 2720 | `32651,32244,7` |
| 10057 | 1770 | `32416,32217,15` |
| 10065 | 2720 | `32781,32327,7` |
| 20002 | 3058 | `32176,32132,9` |
| 54322 | 3104 | `32179,32224,9` |

## Black Knight chain (1)

| Sev | Onde | O quê |
|-----|------|-------|
| WARN | `key aid 5010` | Nenhuma porta IsDoor com actionid 5010 (keydoor pode ser nativo / fora do range). |

## Chave sem porta (1)

| Sev | Onde | O quê |
|-----|------|-------|
| WARN | `uid 10065 key aid 5010` | Nenhum item com esse actionid no OTBM (porta/keydoor). |
