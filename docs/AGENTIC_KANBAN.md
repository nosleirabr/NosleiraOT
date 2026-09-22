# Fluxo agentic (Kanban) — Nosleira OT 7.4

Tracker: [Issues do GitHub](https://github.com/nosleirabr/Oteserver7.4/issues)  
Repo: [nosleirabr/Oteserver7.4](https://github.com/nosleirabr/Oteserver7.4)  
Ordem de entrega: [`docs/ROADMAP.md`](ROADMAP.md)  
Skill: [`.cursor/skills/otserver-agentic-kanban/SKILL.md`](../.cursor/skills/otserver-agentic-kanban/SKILL.md)

Fonte canônica do fluxo. **Sem pipeline CI para “mover card”.** Código sobe por **Pull Request**. Merge na `main` só com autorização do humano.

Project board (Projects v2) é **opcional**. Se existir e o token `gh` tiver `read:project`, use Status Ready/In progress. Sem isso, use **issues abertas + labels** (`P0-Critico`, `P1-Grave`, `P2-Menor`) e o que o humano pedir.

---

## Status

| Status | Significado | Quem move |
|--------|-------------|-----------|
| **Backlog** | No radar; **não** puxar | Triagem humana |
| **Ready** | Próximo a puxar; escopo na description da issue | Triagem / humano |
| **In progress** | Trabalho ativo | **Agente** ao iniciar (assignee) |
| **In review** | Existe PR linkado (`Closes #N`) | PR aberto |
| **Done** | Issue fechada / PR merged | Fechar issue ou merge |

**Priority** = urgência (P0/P1/P2 nas labels). **Status** = se está na fila agora.

Regra: agentes **só** puxam o que o humano autorizar ou issue **Ready**. Nunca inventar trabalho de Backlog.

---

## Seleção da próxima tarefa

1. Issues **OPEN** neste repo, preferindo labels P0 → P1 → P2, depois número ASC.
2. Override se o humano pedir uma issue específica.
3. Anunciar com **link** + ler a **description** como contrato.

---

## Ciclo (código)

```
issue aberta
  → agente: assign + branch linkada
  → PR com Closes #N
  → merge na main (humano autoriza) → issue fecha
```

### Ao iniciar (agente)

1. Anunciar a issue.
2. `gh issue edit <N> --add-assignee @me`
3. Criar branch **linkada** à issue (ver abaixo).
4. Escopo = description; testes = [`TESTING.md`](TESTING.md).
5. Abrir PR para `main` com **`Closes #<N>`** no body ([`GIT_WORKFLOW.md`](GIT_WORKFLOW.md)).
6. **Não** mergear.

### Manual QA (`[Manual QA]`)

```
avisar usuário + link
  → perguntas de AC ao terminar
  → OK: fechar issue
  → falhas: criar/linkar issues novas
```

---

## Branch + link com a issue

1. **Criar a branch a partir da issue** (UI: issue → *Development* → *Create a branch*), **ou**
2. PR / commits com **`Closes #<N>`** / `Fixes #<N>`.

```
<ticketid>-<summary-title>
<ticketid>-m<N>-<summary-title>
```

```powershell
git checkout main
git pull origin main
git checkout -b 47-m6-release-docs

# No PR:
# Closes #47
```

---

## Anti-padrões

- GitLab, MR, `.gitlab-ci.yml`, clones `opentibia-740/*`
- Push/merge sem pedido do humano
- Puxar Backlog
- Branch sem id da issue no começo / PR sem `Closes #N` (quando há issue)
- Marcar Manual QA Done sem perguntas de AC
