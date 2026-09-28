---
name: otserver-session
description: >-
  Bootstraps OT Server 7.4 work sessions. Reads README.md, docs/learnings/index.md,
  and layer README.md (server/site/client/docker/maps). Forces otserver-developer,
  otserver-agentic-kanban (board), and docs/learnings brain. Use at the start of any
  non-trivial task in this repo, when switching layers, or when context is unclear.
---

# OT Server Session Bootstrap

## When to use

- Start of any non-trivial task in this repository
- Before touching server, site, client, docker, or maps
- When resuming work after a break or context switch

## Start checklist

```
- [ ] Read README.md (phase, stack, login quirks, workflow)
- [ ] Read AGENTS.md (router + mandatory skills)
- [ ] If delivering from the board: apply otserver-agentic-kanban
      (Ready / issue the human named; assign; branch <id>-mN-summary;
       Closes #N; never merge without human)
      Canonical: docs/AGENTIC_KANBAN.md
- [ ] Read docs/learnings/index.md (catalog only — no full dumps)
- [ ] Open matching wiki pages from docs/learnings/wiki/
- [ ] Read layer README.md for the target area
- [ ] Before writing code: apply otserver-developer (docs/CODING.md)
- [ ] Apply otserver-74-fidelity if changing gameplay/content
```

## Mandatory skills (every non-trivial task)

| Role | Skill |
|------|--------|
| Session bootstrap | `otserver-session` (this) |
| Board / delivery | `otserver-agentic-kanban` |
| Coding standards | `otserver-developer` |
| Shared brain | `otserver-learnings-ingest` → **only** `docs/learnings/` |

Do **not** use a per-user home brain outside the repo for OT learnings.

## Layer routing

| Task area | Read |
|-----------|------|
| TFS, Lua, config, data | `server/README.md` |
| MyAAC, accounts, site | `site/README.md` |
| Client login/connect | `client/README.md` |
| Compose, ports, host ops | `docker/README.md` |
| OTBM, RME, teleports | `maps/README.md` |
| Capture learnings | `docs/learnings/README.md` |
| Board / next ticket | `docs/AGENTIC_KANBAN.md` + skill `otserver-agentic-kanban` |

## Phase awareness

- **Roadmap atual:** ver `docs/ROADMAP.md` + issues em `nosleirabr/Oteserver7.4`
- Preserve fidelidade 7.4; sem features modernas OT

## Paths

- Use **repo-relative** paths in docs, skills, and examples.
- Never write machine-absolute paths (`C:\Users\...`, `C:\Projetos\...`) into versioned files.

## End of session

- Leave issue/PR state honest (assignee, open PR, no silent merge)
- If a reusable learning was proven, invoke **otserver-learnings-ingest** into `docs/learnings/` only

## Quick commands (PowerShell)

```powershell
# From the repository root
docker compose up -d --build
docker compose logs -f tfs
```

Default dev login: account `1` / password `1` / character `[GOD] Nosleira`.
