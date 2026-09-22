---
name: otserver-developer
description: >-
  Mandatory coding standards for this OT 7.4 repo: subfunctions, intention
  comments in Portuguese, named/commented IDs (ItemIds groups ARMORS/HELMETS/…),
  early returns, extend existing files over new ones, consistent project patterns,
  tests before new ifs. Use whenever writing or changing server/client/site/test code.
---

# OT Server Developer

## When to use

- Any non-trivial code change (Lua datapack, C++, OTCv8 modules, MyAAC PHP, tests)
- Before inventing a new file, helper, or “cleaner” pattern that diverges from the repo
- When reviewing your own diff for readability and ID hygiene

Canonical: [`docs/CODING.md`](../../../docs/CODING.md). Always-on rule: `.cursor/rules/coding-standards.mdc`.

## Checklist

```
- [ ] Prefer the existing conventional path/file over creating a parallel one
- [ ] Subfunctions with intention names; early return / inverted if; no deep nests
- [ ] Intention comments in **Portuguese** on non-obvious blocks (what/why), not line-by-line noise
- [ ] Every numeric item/action/unique/storage ID named or commented (comment text in Portuguese)
- [ ] Shared item IDs: extend ItemIds in server/server/data/lib/core/constants.lua
- [ ] New if/branch: extract if needed → old tests green unchanged → new test
- [ ] Repo-relative paths only in docs/skills/examples (no C:\Users\... / C:\Projetos\...)
- [ ] Apply otserver-74-fidelity for gameplay/content changes
```

## Pattern over cleverness

**More valuable: average code that matches project conventions than several “good” codes in different styles.**

Do not sprinkle one-off `if`s into existing flows to bolt on rules. Extract, reuse helpers, or extend the canonical table/constant.

## IDs

```lua
-- Preferir grupos partilhados
if item:getId() == ItemIds.ARMORS.CROWN_ARMOR then
	-- ...
end

-- Ou local + comentário em português
local crownArmorId = 2487 -- armadura de coroa
```

Extend `ItemIds` in `server/server/data/lib/core/constants.lua`. Verify new IDs against `items.xml` before adding.

## Comments language

All code comments (**must** be Portuguese). Identifier names may stay English when that matches the file.

## After coding

- Run the relevant tests from `docs/TESTING.md` before PR.
- If a reusable finding was proven, use `otserver-learnings-ingest` into `docs/learnings/` only.
