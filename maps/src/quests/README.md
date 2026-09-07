# maps/src/quests

Quests **assadas** no OTBM. Não use injectors Lua (removidos).

Manifesto e ordem: [`../world.map.yaml`](../world.map.yaml). Camada maps: [`../../README.md`](../../README.md). Toolchain: [`../../../tools/Ot74.Map/README.md`](../../../tools/Ot74.Map/README.md).

## O que vai aqui vs no server

| Responsabilidade | Onde |
|------------------|------|
| `aid` / `uid` / `contents` / alavancas / portas no mapa | YAML neste diretório → `otmap build --from-source` |
| Recompensa ao **abrir** baú (`aid` 2000) | `server/server/data/actions/scripts/quests/system.lua` (`questRewards[uid]`) |
| Use-action de alavanca/item | `actions.xml` + script Lua em `actions/scripts/` |
| Diálogo / storage de NPC | `server/server/data/npc/scripts/` (nunca foi injector) |
| HOTA basins → mystic flames | `globalevents/scripts/hota_mystic_flames.lua` (sem uid) |

## Schema (resumo)

```yaml
kind: quest
name: example
patches:
  - at: [x, y, z]
    aid: 2000          # system.lua chests
    uid: 10029         # único no mapa; comentar o nome da quest
    match: [1740, 1741]  # opcional; senão DefaultMatchIds do QuestPatcher
    id: 1740             # opcional; se não houver match, cria este item (como Game.createItem)
    contents:            # opcional; só se o container estiver vazio no bake
      - id: 2147
scans:                   # região: atribui uids x-então-y como o injector antigo
  - center: [x, y, z]
    radius: 10
    aid: 2000
    uids: [10010, 10015]
boxes:                   # retângulo: mesmo aid em vários itens (portas)
  - from: [x1, y1, z]
    to: [x2, y2, z]
    aid: 30052
    kind: door
```

Após editar: rebuild + restart TFS.

```powershell
dotnet exec tools\Ot74.Map\Ot74.Map.Cli\bin\Debug\net10.0\otmap.dll build --from-source
docker compose restart tfs
```

Validar bake vs YAML / `system.lua`:

```powershell
dotnet exec tools\Ot74.Map\Ot74.Map.Cli\bin\Debug\net10.0\otmap.dll validate-quests
# → docs/MAP_QUEST_VALIDATION.md + QuestBakeAuditTests
```

## Regras para agentes

1. **Todo** uid/aid novo: comentário com nome da quest.
2. Não reutilizar UIDs (ver learnings Mintwallin / Small Ruby / Banshee remaps).
3. Dois itens no mesmo tile (ex. duas alavancas): dois patches; `QuestPatcher` prefere item ainda sem aid.
4. Alavancas só decorativas: `decorative_levers.yaml` + aid `50999` + `decorative_lever.lua`.
5. Annihilator porta aid `1100` = levelDoor (nível ≥ 100), não storage quest.
6. Listar ficheiro novo em `world.map.yaml` `quests:`.

## Ficheiros atuais

Migrados dos 14 injectors + `decorative_levers.yaml`. Histórico Lua: git history; pasta `quest_injectors/` só tem README.
