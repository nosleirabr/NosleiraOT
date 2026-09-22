---
name: strict-scope-isolation
description: Regra absoluta de isolamento de escopo. NUNCA alterar arquivos ou sistemas que não foram explicitamente autorizados pelo usuário.
---

# REGRA ABSOLUTA: ISOLAMENTO DE ESCOPO E AUTORIZAÇÃO

1. **SÓ MEXA NO QUE FOI AUTORIZADO:** Se o usuário mandar mexer no `rules`, você mexe APENAS no `rules`. Se mandar mexer no template, mexe APENAS no template.
2. **ZERO EFEITOS COLATERAIS:** É terminantemente proibido que uma alteração em um sistema (ex: template) quebre ou afete outros sistemas não relacionados (ex: download, server, character, guild, house).
3. **NÃO FAÇA "MELHORIAS" NÃO SOLICITADAS:** Se você vir algo que "parece" que precisa de conserto em um arquivo fora do escopo da tarefa atual, NÃO MEXA. Foque apenas no problema atual.
4. **EM CASO DE DÚVIDA, PARE:** Se a alteração de um arquivo exigir mudar algo em outro lugar, peça permissão expressa do usuário ANTES de fazer qualquer alteração.
