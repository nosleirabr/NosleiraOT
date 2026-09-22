# AI Kit — Skills e Rules

Fonte única de **skills** e **rules** para Cursor e Antigravity.  
Faz parte do monorepo [`nosleirabr/Oteserver7.4`](https://github.com/nosleirabr/Oteserver7.4).

## Layout

```
AGENTS.md              # índice mestre (leia primeiro)
skills/<name>/SKILL.md # 20 skills (ver AGENTS.md para catálogo)
rules/*.mdc|*.md       # coding-standards, git-workflow, strict-scope, auto-push
architecture/ cpp/ lua/ security/ uuix/   # referências (C++, Lua, OWASP, UI)
agents/                # opcional (map-* agents)
task-observer/         # observador de sessão + hooks
project_skillz.md      # contexto consolidado do projeto (OTC/C++17/Lua)
```

## Instalação

As skills já vêm junto com o clone do monorepo principal:

```powershell
git clone https://github.com/nosleirabr/Oteserver7.4.git D:\Server
```

- **Cursor** lê `.cursor/skills` e `.cursor/rules`
- **Antigravity** lê `.agents/skills` e `.agents/rules` (não use `.antigravity/`)

Atualizar (via monorepo):

```powershell
# Na raiz do repo
git pull origin main
```

## Skills

Ver pastas em `skills/` (20 skills). Índice e ordem de leitura: [`AGENTS.md`](AGENTS.md).
Catálogo no workspace: [`docs/SKILLS.md`](../docs/SKILLS.md).

Skills novas neste ciclo: `otserver-client-otcv8`, `otserver-testing-ci`,
`otserver-infra-cloud`, `otserver-release-process`.
