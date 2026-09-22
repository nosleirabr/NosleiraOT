# Changelog — Nosleira OT Server 7.4

Todas as mudanças notáveis neste projeto são documentadas aqui.

Issues históricas linkadas a `matosnathan/otserver` abaixo são arquivo de um tracker anterior.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).
Versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/) adaptado para milestones.

---

## [Unreleased] — M2 Conteúdo 7.4

### Em progresso

- Baús de quest restantes (uma story por quest) — [#82](https://github.com/matosnathan/otserver/issues/82)
- NPCs de quest (stubs → scripts completos) — [#36](https://github.com/matosnathan/otserver/issues/36)
- Levers e actionids ligados a scripts — [#37](https://github.com/matosnathan/otserver/issues/37)
- Portas / storage / aids sem colisão 8.0 — [#38](https://github.com/matosnathan/otserver/issues/38)

---

## [1.0.0-m1] — M1 Jogabilidade Núcleo *(quase concluído)*

### Adicionado

- Sistema de travel: barcos e carpetes entre cidades com scripts e `TravelContractTests` verdes
- Oracle funcional com vocações e towns 7.4 (`The Oracle.lua`)
- Cambistas (money exchange) sem banco virtual
- Healers e temples por cidade (`healer.lua`)
- Worms e fishing clássico 7.4 (sem item `3976`) — [#31](https://github.com/matosnathan/otserver/issues/31)
- Rates clássicos 1x configurados como perfil base (`config.lua`)
- Mission quests (umbrella) — [#35](https://github.com/matosnathan/otserver/issues/35) com split por quest [#66](https://github.com/matosnathan/otserver/issues/66)–[#79](https://github.com/matosnathan/otserver/issues/79)

### Em aberto (P0 — bloqueiam fechamento de M1)

- NPCs fantasma no spawn — [#81](https://github.com/matosnathan/otserver/issues/81)
- Smoke manual + contratos L3 — [#33](https://github.com/matosnathan/otserver/issues/33)
- Shops stubs (`default.lua`) — [#80](https://github.com/matosnathan/otserver/issues/80)
- Balanceamento 7.4 (vocações/skills/combate) — [#101](https://github.com/matosnathan/otserver/issues/101)
- Manual QA: travel, cambistas, Oracle, NPCs core, combate — [#83](https://github.com/matosnathan/otserver/issues/83)–[#86](https://github.com/matosnathan/otserver/issues/86), [#109](https://github.com/matosnathan/otserver/issues/109)

---

## [0.1.0-m0] — M0 Fundação do Stack

### Adicionado

- Stack Docker Compose completo: TFS 1.2 + MyAAC + MariaDB
- Login de account numérica (`uint32`) funcionando no client clássico
- Realmap 7.4 (222222) carregado como world
- Teleports críticos corrigidos (D-007, D-015)
- Bootstrap documentado (`docs/BOOTSTRAP.md`)
- Suite de testes L1–L4 inicial (`docs/TESTING.md`)
- Skills de agentes, board Kanban e docs de learnings

### Corrigido

- Workflow C++ CI para build sem `cotire` no Ubuntu 22.04
- Mapa: buracos de Z e teleports quebrados (D-004, D-015)

---

> **Como atualizar este arquivo:** ao fechar uma issue ou epic, mova-a da seção `[Unreleased]` para a seção do milestone correspondente. Use os prefixos: **Adicionado**, **Corrigido**, **Removido**, **Alterado**, **Segurança**.
