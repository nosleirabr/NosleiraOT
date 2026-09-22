# AI Kit — Skills e Rules

Fonte única de **skills** e **rules** para Cursor e Antigravity.  
Faz parte do monorepo [`nosleirabr/Oteserver7.4`](https://github.com/nosleirabr/Oteserver7.4).

## Layout

```
skills/<name>/SKILL.md
rules/*.mdc
agents/          # opcional (map-* agents)
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

Ver pastas em `skills/`. Catálogo no workspace: [`docs/SKILLS.md`](../docs/SKILLS.md).
