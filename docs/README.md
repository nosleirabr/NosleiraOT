# Documentação — Nosleira OT Server 7.4

Índice dos docs **neste repositório** ([nosleirabr/Oteserver7.4](https://github.com/nosleirabr/Oteserver7.4)). Docs de camada ficam nas pastas `server/`, `maps/`, `site/`, `client/`.

## Começar

| Doc | Conteúdo |
|-----|----------|
| [`BOOTSTRAP.md`](BOOTSTRAP.md) | Clone GitHub, LFS, stack, viewer |
| [`MAP_AS_CODE_FLOW.md`](MAP_AS_CODE_FLOW.md) | YAML → bake → TFS (fluxo canônico) |
| [`TESTING.md`](TESTING.md) | L1–L4, comandos na raiz |
| [`GIT_WORKFLOW.md`](GIT_WORKFLOW.md) | Branch, PR, CI no GitHub |
| [`guides/fork-and-variants.md`](guides/fork-and-variants.md) | Como forkar e criar variantes customizadas |

## Engenharia

| Doc | Conteúdo |
|-----|----------|
| [`CODING.md`](CODING.md) | Estilo e padrões de código |
| [`architecture.md`](architecture.md) | Compose, portas, volumes |
| [`ROADMAP.md`](ROADMAP.md) | Milestones e prioridades |
| [`SKILLS.md`](SKILLS.md) | Catálogo de skills neste repo |

## Planejamento / defeitos

| Doc | Conteúdo |
|-----|----------|
| [`AGENTIC_KANBAN.md`](AGENTIC_KANBAN.md) | Issues GitHub (planejamento) |
| [`KNOWN_DEFECTS.md`](KNOWN_DEFECTS.md) | Índice → `server/docs/` |

## Camadas (ler o README de cada uma)

| Pasta | Docs principais |
|-------|-----------------|
| `server/` | `server/docs/QUESTS_AND_FEATURES.md`, `KNOWN_DEFECTS.md` |
| `maps/` | `maps/README.md`, `maps/docs/` (relatórios gerados) |
| `tools/map-editor/` | `tools/map-editor/README.md`, `viewer/README.md` |
| `.github/workflows/` | GitHub Actions (L1–L4, lint) |
