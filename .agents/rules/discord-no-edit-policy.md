# Política de Atualização de Mensagens e Canais no Discord (No-Edit Policy)

> **REGRA DE OURO DEFINIDA PELO DONO**:
> **NUNCA** editar mensagens existentes no Discord (`message.edit(...)`) em canais públicos de informação, regras, links, ranks, atualizações, comandos ou tickets.

## Diretriz Obrigatória

1. Ao atualizar o conteúdo ou layout de qualquer canal do Discord:
   - **Copie** o conteúdo/formato necessário.
   - **Delete** a mensagem antiga do canal (`await message.delete()`).
   - **Poste** uma nova mensagem do zero (`await channel.send(...)`).

2. **Motivo**:
   - Mensagens editadas exibem a tag `(editado)` no Discord, o que quebra a apresentação profissional e a padronização visual exigida para o servidor oficial.

3. **Escopo**:
   - Válido para todos os scripts de setup, bots, anúncios, embeds fixos e manutenções no Discord.
