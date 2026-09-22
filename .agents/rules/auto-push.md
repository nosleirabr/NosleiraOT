---
name: Auto-Push Fixes
description: Fluxo de commit e push automático após cada fix ou feature concluída
---

# Regra de Auto-Push e PR

Sempre que o agente finalizar 100% uma correção ou feature (NPC, quest, travel, lever, missão, bug de script, etc.):

1. **Criar branch** separada com nome descritivo (ex: `fix/npc-nome`, `feat/quest-nome`, `fix/travel-city`).
2. **Fazer commit** com mensagem clara em português descrevendo o que foi feito.
3. **Fazer push** da branch para o GitHub **automaticamente** — sem precisar pedir permissão ao usuário.
4. **Informar o usuário** com o link direto do PR no GitHub para ele revisar e aprovar.

## O que NÃO fazer (proibido)
- NUNCA fazer merge com a `main` automaticamente.
- NUNCA commitar diretamente na `main`.
- O merge só acontece quando o **usuário aprovar explicitamente** no GitHub ou pedir verbalmente.

## Resumo do fluxo

```
Fix concluído → commit → push → branch no GitHub → usuário aprova → merge na main
```

O agente cuida de tudo até o push. O merge é sempre decisão do usuário.
