---
name: otserver-myaac-site
description: >-
  MyAAC site operations: install, config.local.php, numeric account creation for
  7.4, towns warning, admin panel, Docker workflow. Use for site bugs, registration,
  account/character creation flows, or MyAAC install issues.
---

# MyAAC Site Layer

## Layout

- Site root: `site/`
- PHP 8.2 in `ot74-myaac` container
- Server mount: `./server/server:/srv:ro` (reads `config.lua`, towns)
- Local secrets: `config.local.php` (**gitignored**)

Layer guide: `site/README.md`

## URLs

- Site: http://127.0.0.1:8080/
- Admin: http://127.0.0.1:8080/admin/

Default dev admin: account `1` / password `1`

## Install (CLI, non-interactive)

```powershell
docker compose exec myaac php tools/cli_install.php
```

Towns warning on install: see `docs/learnings/wiki/myaac-install-towns.md`
MyAAC reads towns from mounted `/srv/config.lua`.

## 7.4 account rule (D-002)

MyAAC may create **string** account names by default. Tibia 7.4 requires **numeric** names.

When fixing registration:

1. Ensure new accounts get numeric `accounts.name`
2. Test login via client (not just site session)
3. Cross-check DB: `SELECT id,name FROM accounts`

Learning: `docs/learnings/wiki/login-numeric-accounts-7-4.md`

## Common tasks

### Restart site after PHP/config change

```powershell
docker compose restart myaac
docker compose logs -f myaac
```

### Debug site errors

```powershell
docker compose logs -f myaac
```

Check: DB credentials match `.env`, `config.local.php` exists in container mount.

## Phase 2 note

Full site rebuild is **Phase 2** — do not scope-creep unless user requests.
Phase 1: fix account compatibility and install stability only.

## Related defects

- D-002: string account names
- D-003: towns/temples warning on install
਍