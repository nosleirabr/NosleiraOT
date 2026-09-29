--[[
	Talkaction: /god, !god, /staff, !staff, /gm, !gm, /rules, !rules, /regras, !regras
	Exibe caixa de dialogo interativa (modal) com o manual completo de regras e comandos.
	- Players comuns: visualizam as Regras Oficiais do Servidor.
	- Membros da Staff (Tutor, ST, GM, CM, GOD): visualizam o Manual Completo de Moderacao.
]]

function onSay(player, words, param)
	local gid = player:getGroup():getId()
	local isStaff = (gid >= 2 or player:getGroup():getAccess())

	if isStaff then
		local staffGuide = [[
==================================================
           MANUAL OFICIAL DA STAFF & REGRAS
                 NOSLEIRA OT 7.4
==================================================

[1] COMO APLICAR PUNICOES NO JOGO
--------------------------------------------------
* BAN DE JOGADOR (Player Ban - Alerta Global):
  /ban NomeDoPlayer, NumeroDaRegra
  Exemplo: /ban Frodo, 1   (Aplica Regra 1)
  
  Personalizado:
  /ban NomeDoPlayer, Dias, Motivo Escrito
  Exemplo: /ban Frodo, 15, Uso de cavebot nos rotworms

* BAN DE IP (IP Ban - Padrao 7 dias - Alerta Global):
  /ipban NomeDoPlayer
  (Aplica 7 dias automaticamente por violacao das regras)
  
  Com regra ou dias personalizados:
  /ipban NomeDoPlayer, NumeroDaRegra
  /ipban NomeDoPlayer, Dias, Motivo Escrito
  Exemplo: /ipban Frodo, 7, Flood de pacotes

* BAN DE CONTA (Account Ban - Permanente - Alerta Staff):
  /accban NomeDoPlayer, Motivo
  /accban NumeroDaConta, Motivo
  (Bane a conta inteira permanentemente ate a staff remover.
   Aviso visivel apenas para membros da Staff online.)

* DESBANIR (Unban - Sem Alerta Publico):
  /unban NomeDoPlayer (ou /unban NumeroDaConta)
  (Remove Player Ban, Account Ban e IP Ban silenciosamente)

* KICK (Desconectar Player Imediatamente):
  /kick NomeDoPlayer

--------------------------------------------------
[2] TABELA DE REGRAS OFICIAIS DO SITE (1 a 19)
--------------------------------------------------
[1]  Comentarios sobre Reset: 15 dias ban
[2]  Free Itens Massivo: 60 dias ban
[3]  Bloqueio de Hunts/Respawn: 15 dias ban
     (Valido apenas p/ neutros. Guild War isento.)
[4]  Bloqueio de Quests: 15 dias ban
     (Valido apenas p/ neutros. Guild War isento.)
[5]  Desrespeito a Staff/Tutores: 30 dias a Permanente
[6]  Abuso contra Novatos: 15 dias ban
[7]  Bug Abuse e Duplicacao (Dupes): Ban Permanente
[8]  Divulgacao de outros Servidores: Ban Permanente
[9]  Abuso de MC no PvP ou Trap: Ban Permanente
[10] Fraude em Doacoes e Estorno: Ban Permanente
[11] Comercio de Scripts de Bot: Ban Permanente
[12] RMT e Comercio por Dinheiro Real In-Game: Permanente
     (Negociacoes externas sao de risco dos jogadores)
[13] Trocas entre Servidores: Ban Permanente
[14] Trapacas no PvP (Magebomb/Nav): Ban Permanente
[15] Uso de Low Level em Battle: 90 dias ban
[16] Abuso no Guild Chat (/guildbc): 90 dias ban
[17] Uso de Bots e Programas Externos: Ban Permanente
[18] Tentativa de Roubo de Contas: Ban Permanente
[19] Nome Invalido/Ofensivo (Namelock): 7 dias ban

--------------------------------------------------
[3] COMANDOS DE INVESTIGACAO E MODERACAO
--------------------------------------------------
/ghost             -> Fica 100% invisivel para os jogadores
/mccheck           -> Lista jogadores conectados no mesmo IP
/info NomeDoPlayer -> Exibe IP, Conta, Level e dados do char
/goto NomeDoPlayer -> Teleporta instantaneamente ate o player
/c NomeDoPlayer    -> Puxa o jogador ate a sua posicao
/t                 -> Teleporta voce para o templo da sua cidade
/town IdDaCidade   -> Teleporta para cidades (1=Thais, 2=Kaz, etc)
/up e /down        -> Sobe ou desce 1 andar do mapa
/pos               -> Exibe coordenadas atuais (X, Y, Z)
/B Mensagem        -> Envia Broadcast vermelho no topo da tela

--------------------------------------------------
[4] COMANDOS ADMINISTRATIVOS (GOD / CM)
--------------------------------------------------
/clean             -> Limpa itens jogados no chao do mapa
/i Nome/ID Quantia -> Cria item no inventario (Ex: /i crystal coin 100)
/m NomeDoMonstro   -> Invoca monstro (Ex: /m Demon)
/s NomeDoNpc       -> Invoca NPC (Ex: /s Sam)
/addskill Nome, skill, nivel -> Adiciona skills
/closeserver       -> Fecha o servidor para manutencao
/openserver        -> Abre o servidor para os jogadores
/looktype ID       -> Altera a sua outfit por ID numerico

==================================================
   Bom trabalho na moderacao e suporte do NosleiraOT!
==================================================]]

		player:showTextDialog(1950, staffGuide)
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, "=== MANUAL OFICIAL DA STAFF ABERTO ===")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Dica: Digite /ban sem parametros no chat para consulta rapida de regras.")
	else
		local playerRules = [[
==================================================
            REGRAS OFICIAIS DO NOSLEIRA OT
==================================================

1. RESPEITO E CONDUTA:
- Proibido ofensas graves, racismo ou preconceito.
- Proibido desrespeito ou falso testemunho contra a Staff.
- Proibido abuso ou perseguicao abusiva a jogadores novatos.

2. GAMEPLAY E GUILD WAR:
- Proibido bloquear respawns, hunts e quests de jogadores neutros (15 dias ban).
- Em situacoes de Guild War ativa, regras de bloqueio nao se aplicam entre membros em guerra.

3. TRAPACAS E PROGRAMAS ILEGAIS:
- Uso de Bot (Cavebot, Auto-targeting, Scripts ilegais): Ban Permanente.
- Magebomb, Navegacao automatizada no PvP: Ban Permanente.
- Exploracao de bugs ou duplicacao de itens (Dupes): Ban Permanente.
- Abuso de Multiclient (MC) para obter vantagem no PvP: Ban Permanente.

4. COMERCIO E SEGURANCA:
- Extremamente proibido comercio por dinheiro real (RMT) dentro do jogo.
- Proibida divulgacao de outros servidores (Ban Permanente).
- Tentativas de roubo de contas ou links maliciosos: Ban Permanente.

5. NOMES DE PERSONAGENS:
- Nao utilize nomes com falsa identidade de Staff ([GM], [GOD], Admin) ou termos ofensivos.

==================================================
Consulte todas as regras detalhadas no site oficial!
==================================================]]

		player:showTextDialog(1950, playerRules)
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "As regras oficiais do servidor foram abertas em sua tela.")
	end

	return false
end
