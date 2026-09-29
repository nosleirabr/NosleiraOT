---
name: Manual Commit and Push
description: Fluxo de commit e push manual, exigindo autorização explícita do usuário para commitar, dar push e fazer merge.
---

# Regra de Commit, Push e Merge (Autorização Explícita)

Sempre que o agente finalizar uma correção ou feature:

1. **NÃO faça commit** automaticamente.
2. **NÃO faça push** automaticamente para o GitHub ("site").
3. **NÃO faça merge** automaticamente.
4. Você deve **sempre pedir autorização explícita** do usuário antes de realizar qualquer operação de commit, push ou merge.
5. "Você só vai fazer commit e fazer merge quando eu autorizar."

## O que NÃO fazer (proibido)
- NUNCA fazer commit sem a permissão do usuário ("não é para você commitar nada do site a hora que bem quiser").
- NUNCA fazer push sem a permissão do usuário.
- NUNCA fazer merge com a `main` automaticamente.
- NUNCA commitar diretamente na `main`.

## Resumo do fluxo

```
Fix concluído -> PEDIR AUTORIZAÇÃO -> (com autorização) commit -> push -> PR -> (com autorização) merge
```
