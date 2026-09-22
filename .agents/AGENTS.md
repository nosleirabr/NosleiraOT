# AGENTS.md — Índice Mestre de Skills

> Fonte única de skills para este monorepo (`nosleirabr/Oteserver7.4`).
> **Antigravity** lê `.agents/skills` · **Cursor** lê `.cursor/skills` (espelho).
> Encoding padrão: **UTF-8 sem BOM**. Paths sempre **repo-relative**.

## Como usar (ordem de leitura)

1. **Início de sessão** → `otserver-session` (bootstrap obrigatório)
2. **Antes de codar** → `otserver-developer` (padrões) + `otserver-74-fidelity` (se mexe em gameplay/conteúdo)
3. **Entregando pelo board** → `otserver-agentic-kanban`
4. **Fim de sessão** → `otserver-learnings-ingest` (só se houve aprendizado reutilizável comprovado)

## Skills obrigatórias (toda tarefa não-trivial)

| Papel | Skill |
|-------|-------|
| Bootstrap da sessão | [`skills/otserver-session/SKILL.md`](skills/otserver-session/SKILL.md) |
| Board / entrega | [`skills/otserver-agentic-kanban/SKILL.md`](skills/otserver-agentic-kanban/SKILL.md) |
| Padrões de código | [`skills/otserver-developer/SKILL.md`](skills/otserver-developer/SKILL.md) |
| Cérebro compartilhado | [`skills/otserver-learnings-ingest/SKILL.md`](skills/otserver-learnings-ingest/SKILL.md) → só `docs/learnings/` |

## Catálogo por área

### Sessão e entrega
- [`otserver-session`](skills/otserver-session/SKILL.md) — bootstrap: README, learnings, layer README, roteamento por camada.
- [`otserver-agentic-kanban`](skills/otserver-agentic-kanban/SKILL.md) — pegar próximo Ready (nunca Backlog), branch `<id>-mN-resumo`, PR com `Closes #N`, nunca merge sem humano.
- [`otserver-learnings-ingest`](skills/otserver-learnings-ingest/SKILL.md) — capturar aprendizados comprovados em `docs/learnings/wiki/` + atualizar `index.md`.
- [`otserver-defect-triage`](skills/otserver-defect-triage/SKILL.md) — corrigir defeitos de `docs/KNOWN_DEFECTS.md` um por vez, com evidência e escopo mínimo.

### Código e padrões
- [`otserver-developer`](skills/otserver-developer/SKILL.md) — subfunções, comentários de intenção em português, IDs nomeados/comentados, early returns, estender arquivos existentes, testes antes de novos `if`s.
- [`otserver-itemids`](skills/otserver-itemids/SKILL.md) — grupos `ItemIds` compartilhados (`ARMORS`, `HELMETS`, …), sem hardcoding, conferir com `items.xml`.
- [`otserver-74-fidelity`](skills/otserver-74-fidelity/SKILL.md) — guarda de autenticidade 7.4: bloqueia features modernas (shop, mounts, stamina…).
- [`otserver-client-otcv8`](skills/otserver-client-otcv8/SKILL.md) — OTCv8: C++17 (`unique_ptr`, `scoped_lock`), Lua (`table.create`, eventos em vez de polling), OWASP, UI minimalista.

### Server (TFS 1.2)
- [`otserver-tfs-server`](skills/otserver-tfs-server/SKILL.md) — `config.lua`, `data/` (npc, actions, spells, items), rebuild C++, logs do TFS.
- [`otserver-login-74`](skills/otserver-login-74/SKILL.md) — debug de login 7.4 (conta inválida, charlist vazia, SHA1, IDs numéricos).
- [`otserver-skillhandler`](skills/otserver-skillhandler/SKILL.md) — adicionar/remover skills e experience (`.addskill`, treinadores NPC, progressão).
- [`otserver-talkactions`](skills/otserver-talkactions/SKILL.md) — criar/modificar talkactions, sysmessages padronizadas.

### Conteúdo e QA
- [`otserver-npc-qa`](skills/otserver-npc-qa/SKILL.md) — validar XML/Lua de NPCs: `script=`, diálogo, storage keys, hooks de quest.
- [`otserver-map-qa`](skills/otserver-map-qa/SKILL.md) — RME, alinhamento `items.otb`, destinos de teleport, versão OTBM, backup de spawns.

### Site (MyAAC)
- [`otserver-myaac-site`](skills/otserver-myaac-site/SKILL.md) — install, `config.local.php`, contas numéricas 7.4, painel admin, fluxo Docker.

### Infra e operação
- [`otserver-docker-stack`](skills/otserver-docker-stack/SKILL.md) — operar o compose (mysql, tfs, myaac) via PowerShell: up/down/logs, portas, `.env`, exec.
- [`otserver-infra-cloud`](skills/otserver-infra-cloud/SKILL.md) — containers, Kubernetes, AWS/GCP, backups, monitoramento e health checks.
- [`otserver-backup-agente`](skills/otserver-backup-agente/SKILL.md) — backup/restauração da config do Antigravity (`~/.gemini`) no OneDrive.

### Qualidade e release
- [`otserver-testing-ci`](skills/otserver-testing-ci/SKILL.md) — testes Lua (LuaUnit/busted), CI (Actions), cobertura mínima, testes antes do PR.
- [`otserver-release-process`](skills/otserver-release-process/SKILL.md) — semver, fluxo branch → PR → test → tag → deploy, changelog, rollback.

## Pastas de referência (não-skills)

| Pasta | Conteúdo |
|-------|----------|
| [`architecture/`](architecture/clean-architecture.md) | Clean Architecture / DDD aplicado ao OTClient |
| [`cpp/`](cpp/smart-pointers-config.md) | Smart pointers e concorrência C++17 |
| [`lua/`](lua/table-optimization.md) | `table.create`, weak tables, eventos vs polling |
| [`security/`](security/owasp-config.md) | OWASP: SQLi, validação de pacotes, XSS/CSRF, RCE |
| [`uuix/`](uuix/minimalist-ui.md) | UI minimalista (feedback instantâneo, hairlines, whitespace) |
| [`rules/`](rules/) | `coding-standards.mdc`, `git-workflow.mdc`, `strict-scope.md`, `auto-push.md` (alwaysApply no Cursor) |
| [`agents/`](agents/) | Agentes de mapa (`map-compiler`, `map-docs`, `map-explorer`, `map-extractor`, `map-tester`) |
| [`task-observer/`](task-observer/SKILL.md) | Observador de sessão + hooks/scripts |

## Regras de contribuição (skills)

- [ ] Um `SKILL.md` por pasta em `skills/<nome>/`, com frontmatter (`name`, `description`).
- [ ] Encoding **UTF-8 sem BOM** (nunca UTF-16 — o GitHub mostra como binário).
- [ ] Paths **repo-relative** (`server/...`, `docs/...`) — nunca `C:\Users\...`.
- [ ] Comentários de código em **português**; identificadores podem ficar em inglês.
- [ ] Espelhar skills novas em `.cursor/skills/` (paridade Cursor/Antigravity).
- [ ] Canônico de código: [`../docs/CODING.md`](../docs/CODING.md) · catálogo workspace: [`../docs/SKILLS.md`](../docs/SKILLS.md).
