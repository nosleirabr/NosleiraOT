# Aprendizado: Política de Postagens Limpas no Discord (No-Edit Policy)

- **Data**: 2026-09-23
- **Contexto**: Padronização visual profissional da comunidade e canais do Discord do NosleiraOT.

## O Que Foi Aprendido e Fixado

1. **Tag `(editado)` no Discord**:
   - Quando um bot ou admin edita uma mensagem pré-existente via API ou interface, o Discord adiciona a tag `(editado)`, expondo histórico de rascunhos e quebrando o visual polido de anúncios oficiais.
2. **Procedimento Padrão Obrigatório**:
   - Sempre que for realizada qualquer melhoria, ajuste de texto ou correção em canais fixos (`regras`, `ranks`, `links`, `atualizações`, `comunidade`, `comandos-geral`, `ticket-br`), o fluxo deve ser:
     1. Obter/ajustar os novos embeds.
     2. Deletar as mensagens antigas do canal (`limparCanal`).
     3. Enviar a mensagem nova do zero (`channel.send`).
3. **Fila e Prioridades de Tickets**:
   - A fila de suporte segue estritamente a ordem de **Prioridade (P1 a P9)** e nunca apenas a ordem cronológica de abertura.
   - P1 (Falar com o Dono) e P2 (Bugs Críticos) têm precedência total sobre P3 (Denúncias), P4/P5 (Financeiro/Donate), P6-P8 (Contas e Segurança) e P9 (Dúvidas Gerais).
