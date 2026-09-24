# Regra Imutável: Passe Livre Total do Administrador / Dono (Admin Bypass)

> **Regra Master**: Nenhuma restrição, cooldown, limite de criação de tickets, verificação de duplicidade ou filtro de moderação se aplica ao Administrador / Dono do servidor (`ehStaff(member)` / ID `494190671310356490`).

## Diretrizes de Implementação

1. **Acesso Total e Ilimitado**:
   - O Dono / Administrador pode abrir múltiplos tickets simultâneos para testes sem qualquer trava ou limite de concorrência.
   - O Dono / Administrador não sofre cooldowns (cooldown de 24h de rank, cooldown de vocação, cooldown de 2 min de ticket).
   - O Dono / Administrador pode postar links, comandos e mensagens livremente em qualquer canal sem advertências do automod.

2. **Jogadores Comuns**:
   - Limite estrito de **1 ticket ativo** por vez (até que o ticket seja finalizado/resolvido).
   - Cooldown de 24h para consulta de rank (`cmd_rank_self`) e troca de vocação (`vocation_select`).
   - Cooldown anti-spam de 2 minutos para abertura de novos tickets.

3. **Formatação de Subtópicos de Ticket**:
   - Formato padronizado: `${dot} (P${pNum}) Ticket-${nomeCapitalizado}-${ticketNumStr}`
   - Exemplo: `🔴 (P2) Ticket-Nosleira-0001` (sem travessões colados ao P; P entre parênteses com espaçamento).
