# Testes

Workspace multi-repo: rode os comandos na **raiz** do workspace (onde está `docker-compose.yml`).

## Categorias

| Cat. | Escopo | Comando | Stack? |
|------|--------|---------|--------|
| **L1** | Datapack estático (XML/Lua, crypto) | `dotnet test` no server | Não |
| **L2** | Mapa / OTBM / `otmap` | `dotnet test` no map-editor | Não |
| **L3** | Quests, travel, spawns, NPC | `dotnet test` no server | Não |
| **L4** | Protocolo TCP (login/game) | filtro `RuntimeContractTests` + `OT74_L4=1` | Sim |

**Antes de MR:** L1+L2+L3. L4 só se a mudança afetar runtime ou o humano pedir.

## L1+L2+L3 (local)

```powershell
# Gameplay / datapack (repo server)
dotnet test server\tests\Ot74.Gameplay.Tests\Ot74.Gameplay.Tests.csproj

# Toolchain de mapa (repo map-editor)
dotnet test tools\map-editor\tests\Ot74.Map.Tests\Ot74.Map.Tests.csproj
```

O projeto de gameplay monta o workspace (procura `docker-compose.yml`) e usa `maps/build/world.otbm` quando existir.

Inventário de falhas de mapa/datapack (gerado): [`maps/docs/MAP_DATAPACK_FIX_PLAN.md`](../maps/docs/MAP_DATAPACK_FIX_PLAN.md).

Validação quest YAML ↔ OTBM: `otmap validate-quests` → [`maps/docs/MAP_QUEST_VALIDATION.md`](../maps/docs/MAP_QUEST_VALIDATION.md).

## L4 (opt-in)

```powershell
docker compose up -d
$env:OT74_L4 = "1"
dotnet test server\tests\Ot74.Gameplay.Tests\Ot74.Gameplay.Tests.csproj --filter "FullyQualifiedName~RuntimeContractTests"
```

Variáveis opcionais: `OT74_MYSQL`, `OT74_L4_HOST`, `OT74_L4_LOGIN_PORT`, `OT74_L4_GAME_PORT`.

## CI (GitLab)

Cada repo tem `.gitlab-ci.yml` que inclui `opentibia-740/infra/ci-templates`. Jobs montam o workspace via `CI_JOB_TOKEN`, rodam L1–L3 e **excluem L4**. Merge em `main` exige pipeline verde.

## Smoke manual

```powershell
docker compose up -d --build
```

Portas: 7171/7172 (TFS), 8080 (site). Login dev: account `1` / `admin123` / character `Admin`.
