# OpenTibia-740 (workspace)

Workspace multi-repo do stack **Tibia 7.4**. Este repositório só tem orquestração (Compose), docs genéricos e bootstrap.

## Comece por aqui

1. [`docs/BOOTSTRAP.md`](docs/BOOTSTRAP.md) — clones + stack
2. [`docs/README.md`](docs/README.md) — índice de documentação
3. [`AGENTS.md`](AGENTS.md) — roteamento para agentes
4. [`docs/MAP_AS_CODE_FLOW.md`](docs/MAP_AS_CODE_FLOW.md) — YAML → bake → TFS

## Repositórios (siblings)

| Pasta local | GitLab |
|-------------|--------|
| `server/` | `opentibia-740/server` |
| `site/` | `opentibia-740/site` |
| `client/` | `opentibia-740/client` |
| `maps/` | `opentibia-740/maps` |
| `tools/map-editor/` | `opentibia-740/tools/map_editor` |
| `infra/ci-templates/` | `opentibia-740/infra/ci-templates` |
| `.cursor/` / `.agents/` | `opentibia-740/ai` |

## Stack

- Server: TFS 1.2 (Docker build em `server/Dockerfile`)
- Site: MyAAC (`site/Dockerfile`)
- Maps: map-as-code (`maps/src` → `otmap build` → `maps/build/world.otbm`)
- Compose: **este** repo (`docker-compose.yml`)

## Skills

Repo [`opentibia-740/ai`](https://gitlab.com/opentibia-740/ai) clonado em `.cursor` e `.agents` (ver BOOTSTRAP). Catálogo: [`docs/SKILLS.md`](docs/SKILLS.md).

Brain local: pasta `brain/` (gitignored; ainda não versionada).
