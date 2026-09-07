# Fluxo agentic (Kanban) — Stable OT 7.4

Tracker: [GitHub Project #1 — Stable OT 7.4](https://github.com/users/matosnathan/projects/1)  
Repo: [matosnathan/otserver](https://github.com/matosnathan/otserver)  
Ordem de entrega: [`docs/ROADMAP.md`](ROADMAP.md)  
Skill: [`.cursor/skills/otserver-agentic-kanban/SKILL.md`](../.cursor/skills/otserver-agentic-kanban/SKILL.md)

Fonte canônica do fluxo Kanban agentic. **Sem pipeline CI para mover cards** — Status de PR/merge vem dos **Workflows nativos do Project**.

---

## Status do board

| Status | Significado | Quem move |
|--------|-------------|-----------|
| **Backlog** | No radar; **não** puxar | Triagem humana |
| **Ready** | Próximo a puxar; escopo na description | Triagem |
| **In progress** | Trabalho ativo (código ou Manual QA), ainda sem PR de review | **Agente** ao iniciar |
| **In review** | Existe PR linkado à issue | **Project Workflow** (nativo) |
| **Done** | Issue fechada / PR merged | **Project Workflow** (nativo) |

**Priority** = urgência (P0/P1/P2). **Status** = se está na fila agora.

Regra: agentes **só** puxam **Ready**. Nunca Backlog.

---

## Seleção da próxima tarefa

1. Items do Project com Status **Ready** + issue **OPEN**.
2. Ordenar: Priority P0 → P1 → P2; depois milestone M1→M2→…; depois número da issue ASC.
3. Override só se o humano pedir uma issue específica (e autorizar se não estiver Ready).
4. Anunciar com **link** + ler a **description** como contrato.

---

## Ciclo (código) — GitHub nativo no Status

```
Ready
  → agente: assign + In progress + branch linkada
  → PR com Closes #N  →  Workflow Project: In review
  → merge na main     →  issue fecha + Workflow: Done
```

O agente **não** precisa (e não deve depender de Action) para In review / Done.

### Ao iniciar (agente)

1. Issue Ready; anunciá-la.
2. `gh issue edit <N> --add-assignee @me`
3. Status → **In progress** (único Status que o agente seta no fluxo de código).
4. Criar branch **linkada** à issue (ver [Branch + link](#branch--link-automático-com-a-issue)).
5. Escopo = description; testes = [`TESTING.md`](TESTING.md).
6. Abrir PR para `main` com **`Closes #<N>`** no body ([`GIT_WORKFLOW.md`](GIT_WORKFLOW.md)).

### In review / Done

Configurados nos **Workflows do Project** (abaixo). Se o card não mover, checar: PR linkado em Development? `Closes #N` presente? Workflows ligados?

---

## Ciclo Manual QA (`[Manual QA]`)

Sem PR → workflows de PR não aplicam. O agente move Status.

```
Ready → avisar usuário + link → In progress
     → perguntas de AC ao terminar
     → OK: fechar issue → Done (workflow “item closed”)
     → falhas: criar/linkar issues novas
```

---

## Branch + link automático com a issue

O GitHub **não** parseia milestone no nome da branch para o painel Development. O link confiável vem de:

1. **Criar a branch a partir da issue** (UI: issue → *Development* → *Create a branch*), **ou**
2. PR / commits com keyword **`Closes #<N>`** / `Fixes #<N>` (fecha e linka ao merge em `main`), **ou**
3. Link manual em Development (fallback).

### Convenção de nome (compatível com link)

Número da issue **no início** (padrão que ferramentas e o “Create a branch” do GitHub reconhecem):

```
<ticketid>-<summary-title>
```

Opcional incluir milestone **depois** do id (não antes):

```
<ticketid>-m<N>-<summary-title>
```

| Exemplo | Issue |
|---------|--------|
| `81-remove-ghost-npcs` | #81 |
| `81-m1-remove-ghost-npcs` | #81 (M1) |
| `102-m1-combat-balance-matrix` | #102 |
| `37-m2-levers-actionids` | #37 |

**Evitar** `M1/81-…` como forma principal — o `/` e o prefixo atrapalham reconhecimento automático do id.

**Procedimento preferido (agente):**

```powershell
# 1) Preferir branch criada na UI da issue (já vem linkada), OU:
git checkout main
git pull origin main
git checkout -b 81-m1-remove-ghost-npcs

# 2) No PR, obrigatório:
# Closes #81
```

Se criar a branch só no git local, ao abrir o PR o `Closes #81` estabelece o link que os Workflows do Project usam.

---

## Automação no GitHub Project (obrigatório — sem pipeline)

**Não** use Action/`workflows/*.yml` para mover Status. Use só:

[Project #1 → ⋯ → Workflows](https://github.com/users/matosnathan/projects/1)

### Ligar e configurar

| Workflow (nome típico na UI) | Configurar | Status alvo |
|------------------------------|------------|-------------|
| **Item closed** / Issue closed | ON | **Done** |
| **Pull request merged** | ON | **Done** (no item do PR, se o PR estiver no Project) |
| **Pull request linked to issue** (ou equivalente “quando PR está linkado”) | ON | **In review** |

Notas:

- O workflow “PR linked to issue” (changelog GitHub 2025) costuma defaultar para “In progress”. Na tela **Edit**, mude **Set status** para **In review** se a UI permitir.
- Se a UI **não** deixar escolher In review e só oferecer In progress: ou renomeie a coluna de review no board para o valor que o workflow seta, ou aceite que “PR aberto” = coluna que o GitHub seta — o importante é **não** reintroduzir pipeline.
- Merge em `main` + `Closes #N` → issue **closed** → workflow **Item closed** → **Done** na issue do board.

### Auto-add (opcional)

- **Auto-add to project**: PRs do repo `matosnathan/otserver` (filtro `is:pr`) — útil se quiser o card do PR no board.
- Issues novas: só se quiser; hoje o board é alimentado na triagem.

### IDs (referência; só para agente se precisar fallback)

| Status | Option ID |
|--------|-----------|
| Backlog | `f75ad846` |
| Ready | `61e4505c` |
| In progress | `47fc9ee4` |
| In review | `df73e18b` |
| Done | `98236657` |

Project `PVT_kwHOAP0SW84Bhofc` · Status field `PVTSSF_lAHOAP0SW84BhofczhgjhIw`

Agente **só** usa GraphQL para: Ready→**In progress** no start, e Manual QA→fechar issue (Done via workflow).

---

## Anti-padrões

- Pipeline CI para mover cards
- Puxar Backlog
- Branch sem id da issue no começo / PR sem `Closes #N`
- Agente setar In review ou Done no fluxo de código (deixar o Project)
- Marcar Manual QA Done sem perguntas de AC
- Merge sem pedido explícito do humano
