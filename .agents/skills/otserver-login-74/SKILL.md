---
name: otserver-login-74
description: >-
  Debugs Tibia 7.4 login issues (Invalid account, empty character list, SHA1).
  Covers numeric account IDs (uint32), MyAAC account creation, config.lua auth
  settings, and DB account rows. Use for login failures or account/site integration.
---

# Tibia 7.4 Login

## Critical fact

7.4 client sends account as **`uint32`**, not a string name. DB `accounts.name` must be a **numeric string** (e.g. `'1'`, not `'admin'`).

Full learning: `docs/learnings/wiki/login-numeric-accounts-7-4.md`

## Working dev credentials

| Field | Value |
|-------|-------|
| Account | `1` |
| Password | `1` |
| Character | `[GOD] Nosleira` |

## Diagnosis flow

```
Login fails?
├─ "Invalid account" ℧ check accounts.name is numeric in DB
├─ Wrong password   ℧ check passwordType = "sha1" in config.lua
├─ No characters    ℧ check players table, character name case
└─ Site-created acct ℧ likely D-002 (string name) — fix or patch MyAAC
```

## Config checks

File: `server/server/config.lua`

- `passwordType = "sha1"`
- `mysqlHost = "mysql"` (inside Docker)
- `ip = "127.0.0.1"` (or `SERVER_IP` from `.env`)

## Code references

- `server/src/protocollogin.cpp` — reads uint32 account
- `server/src/iologindata.cpp` — `WHERE name = <number>`

## MyAAC integration (D-002)

MyAAC defaults may create **string** account names. For 7.4:

- New accounts must get numeric names
- Site registration flow must align with protocol
- See `site/README.md` and defect D-002 in `docs/KNOWN_DEFECTS.md`

## Validation

1. `docker compose up -d`
2. Client ℧ 127.0.0.1:7171
3. Account `1`, password `1`
4. Character list shows `[GOD] Nosleira`

## DB inspect (inside mysql container)

```powershell
docker compose exec mysql mariadb -uot74 -pot74 ot74 -e "SELECT id,name FROM accounts;"
docker compose exec mysql mariadb -uot74 -pot74 ot74 -e "SELECT name,account_id FROM players;"
```
਍