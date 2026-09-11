# Contribuindo com o OpenTibia 7.4

Obrigado por querer contribuir! Este guia define as regras da casa para manter o código limpo, a fidelidade 7.4 intacta e o histórico de commits legível.

---

## Índice

1. [Princípio fundamental](#princípio-fundamental)
2. [Antes de começar](#antes-de-começar)
3. [Fluxo de trabalho (Git)](#fluxo-de-trabalho-git)
4. [Convenções de código](#convenções-de-código)
5. [Testes](#testes)
6. [Commits](#commits)
7. [Pull Requests](#pull-requests)
8. [Issues e roadmap](#issues-e-roadmap)
9. [O que NÃO fazer](#o-que-não-fazer)

---

## Princípio fundamental

> **Fidelidade ao Tibia 7.4.** Qualquer mudança que introduza comportamento de versões posteriores (mounts, roulette, vocações 8.x, etc.) será recusada, a menos que esteja explicitamente no roadmap.

---

## Antes de começar

1. Leia [`docs/BOOTSTRAP.md`](docs/BOOTSTRAP.md) e suba o stack local: `docker compose up -d --build`
2. Leia [`docs/ROADMAP.md`](docs/ROADMAP.md) — entenda o milestone atual
3. Leia [`docs/CODING.md`](docs/CODING.md) — padrões obrigatórios de código
4. Leia [`docs/TESTING.md`](docs/TESTING.md) — como rodar e escrever testes L1–L4
5. Verifique se já existe uma issue para o que você quer fazer. Se não, crie antes do PR.

---

## Fluxo de trabalho (Git)

### Nunca commite direto na `main`

A `main` é protegida. Todo trabalho vai em branch separada.

### Nomenclatura de branch

```
<id-da-issue>-m<milestone>-<resumo-curto>
```

Exemplos:
```
81-m1-npcs-fantasma
37-m2-levers-actionids
39-m3-ci-gate
```

### Passos padrão

```bash
# 1. Crie a branch a partir da main atualizada
git checkout main
git pull --rebase origin main
git checkout -b 81-m1-npcs-fantasma

# 2. Faça as mudanças, rodando testes localmente
# 3. Commit com mensagem Conventional Commits (ver abaixo)
git add -p   # sempre revise o que está commitando
git commit -m "fix(server): corrige spawn de NPCs fantasma (#81)"

# 4. Sempre use rebase antes do push (nunca merge da main na sua branch)
git fetch origin
git rebase origin/main

# 5. Abra o PR via GitHub UI
```

> **Regra:** use sempre `git rebase`, nunca `git merge main` na sua branch de feature.

---

## Convenções de código

Consulte [`docs/CODING.md`](docs/CODING.md) para o guia completo. Resumo:

### Lua (datapack TFS)

```lua
-- Comentários de intenção SEMPRE em português
-- Subfunções com nomes de intenção, sem ninhos profundos
-- Early return para casos de erro

local function verificarJogadorValido(player)
    -- retorna cedo se jogador não existir
    if not player then
        return false
    end
    return player:getId() > 0
end

-- IDs numéricos sempre nomeados ou comentados
local ID_BAUL_FIBULA = 1234 -- baú da missão Fibula Quest (aid=1234)
```

- **Comentários:** sempre em português
- **Nomes de variáveis/funções:** inglês ou português (siga o arquivo existente)
- Estenda `ItemIds` em `server/server/data/lib/core/constants.lua`; não use literais espalhados

### PHP (MyAAC / site)

- Padrão PSR-12
- Comentários em português nos blocos de negócio

### C++ (TFS core)

- Siga o estilo do arquivo modificado
- Não introduza dependências novas sem discussão prévia

---

## Testes

Antes de abrir o PR, rode os testes relevantes:

```bash
# L1 — Testes unitários Lua (sem server)
# (ver docs/TESTING.md para o comando exato)

# L2 — Smoke do stack
docker compose up -d --build
docker compose logs tfs | grep -i error

# L3 — Contratos de integração
# (ver docs/TESTING.md)
```

> **Regra:** `[Manual QA]` é obrigatório para features que afetam gameplay. L3 automatizado ≠ aceitação manual.

---

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

| Prefixo | Quando usar |
|---------|-------------|
| `feat(camada):` | Nova funcionalidade |
| `fix(camada):` | Correção de bug |
| `refactor(camada):` | Refatoração sem mudar comportamento |
| `test(camada):` | Testes apenas |
| `docs(camada):` | Documentação apenas |
| `chore(camada):` | CI, configs, scripts de build |
| `maps(camada):` | OTBM, levers, teleports |

**Camadas:** `server`, `site`, `client`, `docker`, `maps`, `ci`, `docs`, `infra`

Exemplos:
```
feat(server): adiciona shop default.lua com itens 7.4 (#80)
fix(maps): corrige teleport quebrado no piso Z em Thais (#15)
docs: atualiza ROADMAP M1 com status dos shops
chore(ci): adiciona workflow de linting Lua
```

**Mensagem:** imperativo, em português ou inglês, ≤ 72 caracteres na primeira linha.

---

## Pull Requests

1. Título no formato `[Tipo] Descrição curta (#issue)` — ex: `[fix] Corrige NPCs fantasma no spawn (#81)`
2. Preencha **todo** o template do PR (`.github/pull_request_template.md`)
3. Marque a issue com `Closes #N` no corpo do PR
4. O CI (GitHub Actions) **deve estar verde** antes do review
5. Aguarde aprovação; não faça merge sem ok do mantenedor

---

## Issues e roadmap

- Antes de criar uma issue, verifique se já existe uma para o mesmo problema
- Use os templates disponíveis (`Bug Report`, `Feature Request`, `Manual QA`)
- Sempre associe a issue ao milestone correto
- Não pule prioridades: resolva P0 de M1 antes de P1 de M2

Roadmap canônico: [`docs/ROADMAP.md`](docs/ROADMAP.md)

---

## O que NÃO fazer

- ❌ Commitar direto na `main`
- ❌ Fazer `git merge main` na branch de feature (use `rebase`)
- ❌ Commitar secrets, `.env`, arquivos compilados, logs ou `.rar`
- ❌ Introduzir features de OT moderno (mounts, shop web, vocações 8.x, etc.)
- ❌ Usar IDs numéricos soltos sem nome/comentário
- ❌ Escrever comentários de código em inglês (use português)
- ❌ Abrir PR sem issue vinculada
- ❌ Fechar milestone sem `[Manual QA]` aprovado
