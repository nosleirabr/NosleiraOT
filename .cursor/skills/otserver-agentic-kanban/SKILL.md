---
name: otserver-agentic-kanban
description: >-
  Agentic Kanban for Nosleira OT 7.4 on GitHub. Pick next Ready (never
  Backlog) by Priority, assign, branch <id>-mN-summary, PR with Closes #N.
  Never merge unless the human asks. Manual QA with user AC questions.
  Use at session start for delivery work or "what's next".
---

# OT Server — Agentic Kanban

Canonical: [`docs/AGENTIC_KANBAN.md`](../../../docs/AGENTIC_KANBAN.md)  
Repo: `nosleirabr/Oteserver7.4`  
Issues: https://github.com/nosleirabr/Oteserver7.4/issues

## Hard rules

1. Only pull **Ready** / what the human asked — never Backlog inventado.
2. Scope = issue description.
3. Branch: `<ticketid>-<summary>` or `<ticketid>-m<N>-<summary>` (issue id **first**).
4. GitHub **Pull Request** to `main` with `Closes #<N>`. No GitLab / no MR.
5. Never merge PR unless human asks.
6. Manual QA: warn user + link before starting; AC questions before closing.

## Pick next

Open issues → sort P0→P1→P2 → issue number. Announce URL.

## Start (code)

```text
- [ ] Assign @me
- [ ] Prefer: create branch from issue Development UI (auto-linked)
- [ ] Else: git checkout -b 47-m6-release-docs
- [ ] Work + tests (TESTING.md)
- [ ] PR to main with Closes #47 + GIT_WORKFLOW body
- [ ] Stop — wait for human to merge
```

## Manual QA

Inform user → AC questions → `gh issue close` on pass or create linked fix issues on fail.
