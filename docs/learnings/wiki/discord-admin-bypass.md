# Discord Bot: Passe Livre do Administrador e Limite Estrito de Tickets

## Contexto
Durante a fase de testes e operação do bot de Discord (`NosleiraOT-BOT`), os administradores precisam testar múltiplos fluxos simultâneos de tickets, comandos e interações sem serem bloqueados por regras criadas para usuários finais.

## Padrões Estabelecidos

1. **Bypass Total de Staff/Admin (`ehStaff(member)` / ID `494190671310356490`)**:
   - Zero cooldowns em consultas de rank, trocas de vocação e comandos gerais.
   - Zero limites de tickets concorrentes ou verificações anti-duplicidade em chamados.
   - Zero bloqueios de moderação por envio de links.

2. **Limite de 1 Ticket por Usuário Comum**:
   - Cada player só pode manter **1 atendimento ativo** por vez dentro de `【🔴】𝗧𝗶𝗰𝗸𝗲𝘁-𝗕𝗥`.
   - Tentativas adicionais retornam a mensagem orientando a utilizar o subtópico em andamento.

3. **Nomenclatura de Subtópicos de Atendimento**:
   - Formato estrito: `${dot} (P${pNum}) Ticket-${nomeCapitalizado}-${ticketNumStr}`
   - Exemplo: `🔴 (P2) Ticket-Nosleira-0001`
   - Sem travessões antes ou depois de P; prioridade sempre entre parênteses.
