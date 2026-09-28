function onSay(player, words, param)
	local gid = player:getGroup():getId()
	if gid < 2 and not player:getGroup():getAccess() then
		player:sendCancelMessage("Voce nao tem permissao para usar este comando.")
		return false
	end

	local text = [[
========================================
     GUIA DE COMANDOS DA STAFF (TIBIA 7.4)
========================================

1. BANIMENTOS E PUNICOES (/ban):
(Permissao: Apenas GM, CM e GOD)
----------------------------------------
/ban NomeDoPlayer, NumeroDaRegra
Exemplo: /ban Frodo, 1

Lista de Regras e Punicoes:
[1]  Regra 1 - Comentarios sobre Reset (15 dias)
[2]  Regra 2 - Free Itens Massivo (60 dias)
[3]  Regra 3 - Bloqueio de Hunts e Respawn (15 dias)
[4]  Regra 4 - Bloqueio de Quests (15 dias)
[5]  Regra 5 - Desrespeito a Staff e Tutores (30 dias)
[6]  Regra 6 - Abuso contra Novatos (15 dias)
[7]  Regra 7 - Bug Abuse e Duplicacao (Permanente)
[8]  Regra 8 - Divulgacao de outros Servidores (Permanente)
[9]  Regra 9 - Abuso de MC no PvP ou Trap (Permanente)
[10] Regra 10 - Fraude em Doacoes e Estorno (Permanente)
[11] Regra 11 - Comercio de Scripts de Bot (Permanente)
[12] Regra 12 - RMT e Comercio In-Game (Permanente)
[13] Regra 13 - Trocas entre Servidores (Permanente)
[14] Regra 14 - Trapacas no PvP - Magebomb/Nav (Permanente)
[15] Regra 15 - Uso de Low Level em Battle (90 dias)
[16] Regra 16 - Abuso no Guild Chat (/guildbc) (90 dias)
[17] Regra 17 - Uso de Bots e Programas Externos (Permanente)
[18] Regra 18 - Tentativa de Roubo de Contas (Permanente)
[19] Regra 19 - Nome Invalido / Ofensivo (7 dias / Namelock)

Ban Personalizado:
/ban NomeDoPlayer, Dias, Motivo Escrito
Exemplo: /ban Frodo, 15, Uso de cavebot nos rotworms

Outros Comandos de Punicao:
/accban NomeDoPlayer, Motivo -> Bane a CONTA INTEIRA permanentemente
/accban NumeroDaConta, Motivo -> Bane pelo ID da Conta
/unban NomeDoPlayer          -> Remove o banimento (Player/Conta/IP)
/ipban NomeDoPlayer          -> Bane o endereco de IP do jogador
/kick NomeDoPlayer           -> Desconecta o jogador na hora

2. TELETRANSPORTE E NAVEGACAO:
----------------------------------------
/goto NomeDoPlayer  -> Teleporta ate o jogador
/c NomeDoPlayer     -> Puxa o jogador ate voce
/t                  -> Teleporta para o templo
/town IdDaCidade    -> Teleporta para a cidade (1=Thais, etc)
/a Quantidade       -> Anda X pisos para frente
/up / /down         -> Sobe ou desce 1 andar
/pos                -> Mostra suas coordenadas (X, Y, Z)

3. INVESTIGACAO E MODERACAO:
----------------------------------------
/ghost              -> Fica 100% invisivel para players
/mccheck            -> Mostra jogadores com mesmo IP
/info NomeDoPlayer  -> Exibe IP, conta e dados do char
/B Mensagem         -> Envia Broadcast vermelho para todos

4. ADMINISTRACAO E EVENTOS (GOD/CM):
----------------------------------------
/clean              -> Limpa todo o lixo jogado no chao
/i Nome/ID Quantia  -> Cria itens (Ex: /i crystal coin 100)
/m NomeDoMonstro    -> Invoca um monstro
/s NomeDoNpc        -> Invoca um NPC
/addskill Nome, skill, nivel -> Adiciona skill ao player
/closeserver / /openserver   -> Tranca/abre o servidor
/looktype ID        -> Troca a outfit atual

========================================
   Bom trabalho na moderacao do NosleiraOT!
========================================]]

	-- Abre a janela de livro/pergaminho com todo o guia
	player:showTextDialog(1950, text)

	-- Também envia no console para consulta rápida
	player:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, "=== GUIA DE COMANDOS DA STAFF ABERTO ===")
	player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Dica: Digite /ban sem parametros para ver a lista rapida de regras.")

	return false
end
