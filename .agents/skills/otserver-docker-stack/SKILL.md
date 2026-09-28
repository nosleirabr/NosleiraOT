---
name: otserver-docker-stack
description: >-
  Operates the Docker Compose stack (mysql, tfs, myaac) on Windows via PowerShell.
  Use for compose up/down/logs, port checks, .env handling, container exec,
  and diagnosing "stack not starting" issues.
---

# Docker Stack Operations

## Host rules

- **PowerShell only** on Windows host — never Git Bash for repo commands
- Run `.sh` scripts **inside containers**, not on host
- See: `docs/learnings/wiki/docker-host-powershell.md`

## Services

| Service | Container | Ports | Mount |
|---------|-----------|-------|-------|
| mysql | ot74-mysql | 3306 | schema from `server/schema.sql` |
| tfs | ot74-tfs | 7171, 7172 | `./server/server:/srv` |
| myaac | ot74-myaac | 8080 | `./site` + `./server/server:/srv:ro` |

## Common commands

```powershell
cd C:\Projetos\otserver76

# First-time / after Dockerfile changes
docker compose up -d --build

# Status
docker compose ps

# Logs
docker compose logs -f tfs
docker compose logs -f myaac
docker compose logs -f mysql

# Restart one service
docker compose restart tfs

# Shell inside container
docker compose exec tfs sh
docker compose exec myaac bash
```

## Environment

- Copy `.env.template` ℧ `.env` (gitignored)
- Key vars: `MYSQL_*`, `SERVER_IP`, `LOGIN_PORT`, `GAME_PORT`, `SITE_PORT`
- MyAAC reads server config via `/srv/config.lua` mount

## Smoke test

1. `docker compose up -d --build`
2. Ports: 7171/7172 open, http://127.0.0.1:8080/ loads
3. Login client: account `1`, password `1`

## Troubleshooting

| Symptom | Check |
|---------|-------|
| TFS won't start | `docker compose logs tfs` — MySQL connection, map load errors |
| Site 500 | `docker compose logs myaac` — PHP, DB, missing `config.local.php` |
| Client can't connect | `SERVER_IP` in `.env`, `config.lua` ip field, firewall |
| MySQL not ready | Wait for healthcheck; `docker compose ps` |

## Rebuild TFS image

Required after C++ source changes in `server/src/`:

```powershell
docker compose build tfs --no-cache
docker compose up -d tfs
```
਍