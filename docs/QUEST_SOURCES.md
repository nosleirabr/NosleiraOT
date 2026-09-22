# Fontes do datapack de quests (fidelidade 7.4)

Data da pesquisa: 2026-08-24. Objetivo: encontrar `quests.xml` e Lua de quest para **Tibia 7.4** sem importar mecânicas 8.0 (rust remover, worms, áreas pós-7.4).

## Este repo (`nosleirabr/Oteserver7.4`)

| Branch | `quests.xml` |
|--------|----------------|
| `main` (única branch remota) | Era só Example Quest; agora 6 mission quests via `tools/extract-quests-74.ps1` (veja [`QUESTS_AND_FEATURES.md`](QUESTS_AND_FEATURES.md)) |
| `backup/*`, `recovery/*` | Só locais — não são datapacks de quest |

TFS upstream: [otland/forgottenserver v1.2](https://github.com/otland/forgottenserver/tree/v1.2) envia **só Example Quest** em `data/XML/quests.xml`.

## Referência TFS vanilla (Example Quest)

O datapack TFS 1.2 upstream traz só Example Quest. Clone local antigo fora deste repo **não** é fonte canônica.

## Referência RealMap 8.0 (não portar verbatim)

- `server/data/XML/quests.xml` — **33 quests**, ~1400 linhas (pack Global 8.0 RealMap)
- `actions/scripts/quest/` — **203** arquivos Lua (Yalahar, Inquisition, Postman, …)
- `actions.xml` liga `actionid 2000/2001` → `Quest/systems/system.lua` (storages 8.0 em `lib/core/storages.lua`)

**Não portável verbatim:** Explorer Society, Yalahar, Wrath of the Emperor, rust remover (9930), item ids pós-7.4.

## Nostalrius 7.72 ([Ezzz-dev/Nostalrius](https://github.com/Ezzz-dev/Nostalrius))

- **Sem `quests.xml`** em `data/XML/` (só commands, groups, stages, vocations)
- Baús de quest usam **Quest Chest Number** no RME + storage da engine — veja [OTLand 275549](https://otland.net/threads/7-72-nostalrius-quest-ids.275549/)
- Comportamento completo de quest em Lua/movements, não em um único catálogo XML

## TibiaCore 7.4 ([RCP91/TibiaCore](https://github.com/RCP91/TibiaCore))

- Fork OTLand da linhagem Nostalrius (mapa/sprites 7.4)
- Quest log / scripts ficam na árvore do datapack (não verificado nesta sessão — repo deu timeout no fetch da API)
- Trate como **candidato** a port de Lua 7.4; ainda exige revisão manual de item/aid

## O que importamos (camada segura)

| Artefato | Fonte | Notas |
|----------|--------|-------|
| `server/server/data/XML/quests.xml` | subset otserver800 | 6 nomes de mission de `tests/.../fixtures/quests-74-allowlist.txt` — **só UI do quest log** |
| [`docs/QUESTS_AND_FEATURES.md`](QUESTS_AND_FEATURES.md) | Miracle74 + TibiaWiki | Checklist completa de **99 quests**; divisão chest vs mission |
| `tests/.../fixtures/miracle74-quest-catalog.txt` | Miracle74 | Todos os nomes de quest para tracking de implementação |
| Testes L1/L2 | novo `QuestContractTests` | Baús, portas, sanidade do XML |
| Teste L4 | `God_can_open_quest_chest_via_system_lua` | Usa `quests/system.lua` existente + baú no OTBM |

Regenere o quest log:

```powershell
.\tools\extract-quests-74.ps1
```

## Ainda manual (D-019)

- **Lua** de quest para levers (aids 50001, 50004–50008, …) — não copie otserver800 por actionid ([quest-actionid-8-0-collision.md](learnings/wiki/quest-actionid-8-0-collision.md))
- Storages de diálogo de NPC para Djinn/Banshee/Ancient Tombs
- Correções no RME para teleports / walk-down / harbour ghostShip

## Rodar testes de quest

```powershell
dotnet test tests\Ot74.Gameplay.Tests\Ot74.Gameplay.Tests.csproj --filter "FullyQualifiedName~QuestContractTests"

$env:OT74_L4 = '1'
dotnet test tests\Ot74.Gameplay.Tests\Ot74.Gameplay.Tests.csproj --filter "FullyQualifiedName~RuntimeContractTests.God_can_open_quest"
```
