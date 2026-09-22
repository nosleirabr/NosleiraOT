---
name: otserver-backup-agente
description: >-
  Procedimento de backup e restauração da configuração do Antigravity (pasta
  ~/.gemini) para o OneDrive, garantindo que memória e skills sobrevivam a
  uma formatação de PC.
---

# Backup do Antigravity — Procedimento

## Contexto

A "memória" do agente está distribuída em dois lugares:

| O que | Localização | Já versionado? |
|---|---|---|
| Código do server | raiz do monorepo | ✅ Sim (git) |
| Skills do projeto | `.agents/` | ✅ Sim (git) |
| AGENTS.md / regras | `AGENTS.md` | ✅ Sim (git) |
| Config do Antigravity | `$HOME/.gemini` (fora do repo) | ⚠️ Backup manual |

> Nunca escreva paths absolutos de máquina (`C:\Users\...`) em arquivos
> versionados. Use `$env:USERPROFILE` / `$HOME` nos comandos abaixo.

## Fazer Backup

Quando o usuário pedir para salvar a memória/configuração do agente, execute:

```powershell
Copy-Item -Recurse -Force "$env:USERPROFILE\.gemini" "$env:USERPROFILE\OneDrive\Desktop\Backup\.gemini"
```

Confirme o sucesso listando:

```powershell
Get-ChildItem "$env:USERPROFILE\OneDrive\Desktop\Backup\.gemini" | Select-Object Name, LastWriteTime
```

## Restaurar após formatação

Após formatar e reinstalar o Antigravity, restaure com:

```powershell
Copy-Item -Recurse -Force "$env:USERPROFILE\OneDrive\Desktop\Backup\.gemini" "$env:USERPROFILE\.gemini"
```

## Quando usar esta skill

- Quando o usuário mencionar "formatar PC", "backup do agente", "salvar memória", "reinstalar".
- Quando o usuário pedir "salvar pra mim" em contexto de configuração do agente.
