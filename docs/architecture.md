# Arquitetura — OpenTibia-740

Workspace multi-repo. Compose na raiz; cada serviço builda a partir do sibling correspondente.

## Visão geral

```
+----------------------------+     +---------------------------+
| Host (Windows)             |     | Docker (compose)          |
| - client/ (OTC 7.4)        |     | - mysql                   |
| - tools/map-editor (otmap) |     | - tfs  (server/Dockerfile)|
+-------------+--------------+     | - myaac (site/Dockerfile) |
              | TCP/HTTP           +-------------+-------------+
              v                                  |
         7171/7172/8080                          v
                                    maps/build/world.otbm (volume)
```

## Fluxos

| Fluxo | Caminho |
|-------|---------|
| Login 7171 | Client → TFS → MySQL → TFS → Client |
| Game 7172 | Client → TFS ↔ MySQL |
| Site 8080 | Browser → MyAAC → MySQL |

MyAAC lê `config.lua` do server via mount read-only.

## Serviços Docker (nomes na rede)

| Serviço | Hostname interno |
|---------|------------------|
| MariaDB | `mysql` |
| TFS | `tfs` |
| MyAAC | `myaac` |

## Dados no host

| Path | Uso |
|------|-----|
| `server/server/data/` | Datapack TFS (mount no container) |
| `maps/build/world.otbm` | Mapa baked (mount no TFS) |
| `maps/world-spawn.xml`, `world-house.xml` | Spawn/casas |
| `maps/src/` | Fonte YAML (map-as-code) |
| `client/` | Client Windows + assets `.dat/.spr` |
| `tools/map-editor/` | CLI `otmap` + viewer (não vai ao container) |

## Map-as-code

Ver [`MAP_AS_CODE_FLOW.md`](MAP_AS_CODE_FLOW.md). Resumo: `maps/src` → `otmap build --from-source` → `maps/build/world.otbm`.

## Repositórios GitLab

| Pasta local | Remote |
|-------------|--------|
| workspace (raiz) | `opentibia-740/workspace` |
| `server/` | `opentibia-740/server` |
| `maps/` | `opentibia-740/maps` |
| `tools/map-editor/` | `opentibia-740/tools/map_editor` |
| demais | ver [`README.md`](../README.md) |
