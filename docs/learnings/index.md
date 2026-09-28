# Nosleira OT 7.4 — memória do projeto

## O que o agente trata como verdade hoje

Servidor de jogo **TFS 1.2 (C++ / Lua)**, site **MyAAC** (`tibiacom`), mapa 7.4, client clássico. Repo: [nosleirabr/Oteserver7.4](https://github.com/nosleirabr/Oteserver7.4).

Pilares inegociáveis no trabalho **atual**:

1. **Alma 7.4** — PvP, PvE e mecânicas de 2004. Sem shop web, roulette, mounts, stamina moderna.
2. **Stack que roda** — Docker Compose, TFS, MariaDB, MyAAC. Não “trocar o motor” no meio de um ticket de datapack/site.
3. **Server-authoritative** — o servidor não confia no client.
4. **GitHub** — um monorepo, branch, PR. Sem GitLab.

## Icebox (não é o trabalho do dia)

Reescrita da engine em **C# / .NET** (pipelines, EF Core, etc.) é visão de longo prazo. **Não** use isso como mandato para alterar TFS, Lua ou o datapack. Experimentos C# só se o humano pedir, em pasta/issue próprias.

## Wiki

Páginas ingestidas: [`wiki/README.md`](wiki/README.md) · [`wiki/discord-repost-policy.md`](wiki/discord-repost-policy.md) · [`wiki/discord-admin-bypass.md`](wiki/discord-admin-bypass.md) · [`wiki/combat-boss-combos-74.md`](wiki/combat-boss-combos-74.md). Catálogo curto: este arquivo + `map-as-code.md` + `DICIONARIO_TECNICO.md`.

- [combat-boss-combos-74](wiki/combat-boss-combos-74.md) | 7.4 monsters lacked exhaust; 2000ms overlap enabled lethal boss combos. User approved keeping it | combat, 7.4, orshabaal, mechanics | high | 2026-09-24 | user-discussion
- [myaac-cache-clear-after-edit](wiki/myaac-cache-clear-after-edit.md) | Sempre limpar cache Twig + MyAAC após qualquer edição no site, senão o arquivo antigo continua sendo servido | cache, myaac, twig, site | high | 2026-09-28 | debug-session
- [myaac-backup-before-edit](wiki/myaac-backup-before-edit.md) | Sempre fazer backup do arquivo original em .backup/ antes de editar; perguntar ao usuário se quer restaurar após cada edição | backup, site, myaac, restauração | high | 2026-09-28 | debug-session
