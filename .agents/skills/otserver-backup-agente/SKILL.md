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

| O que | Localização | Já no OneDrive? |
|---|---|---|
| Código do server | `Desktop\Server` | ✅ Sim |
| Skills do projeto | `Desktop\Server\.agents` | ✅ Sim |
| AGENTS.md / regras | `Desktop\Server\AGENTS.md` | ✅ Sim |
| Config do Antigravity | `C:\Users\ariel\.gemini` | ⚠️ Backup manual |

## Fazer Backup

Quando o usuário pedir para salvar a memória/configuração do agente, execute:

```powershell
Copy-Item -Recurse -Force "C:\Users\ariel\.gemini" "C:\Users\ariel\OneDrive\Desktop\Backup\.gemini"
```

Confirme o sucesso listando:

```powershell
Get-ChildItem "C:\Users\ariel\OneDrive\Desktop\Backup\.gemini" | Select-Object Name, LastWriteTime
```

## Restaurar após formatação

Após formatar e reinstalar o Antigravity, restaure com:

```powershell
Copy-Item -Recurse -Force "C:\Users\ariel\OneDrive\Desktop\Backup\.gemini" "C:\Users\ariel\.gemini"
```

## Quando usar esta skill

- Quando o usuário mencionar "formatar PC", "backup do agente", "salvar memória", "reinstalar".
- Quando o usuário pedir "salvar pra mim" em contexto de configuração do agente.
