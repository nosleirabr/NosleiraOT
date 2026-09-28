--[[
	Talkaction: /ban ou /playerban
	Bane APENAS o personagem informado (player ban). 
	Apenas GMs, CMs e GODs podem executar este comando.
]]

local function trim(s)
	return (s:gsub("^%s*(.-)%s*$", "%1"))
end

local function splitTrimmed(str, sep)
	local result = {}
	if not str then return result end
	for match in string.gmatch(str, "([^" .. (sep or ",") .. "]+)") do
		table.insert(result, trim(match))
	end
	return result
end

local siteRules = {
	[1]  = {days = 15,   name = "Regra 1 - Comentarios sobre Reset"},
	[2]  = {days = 60,   name = "Regra 2 - Free Itens Massivo"},
	[3]  = {days = 15,   name = "Regra 3 - Bloqueio de Hunts e Respawn"},
	[4]  = {days = 15,   name = "Regra 4 - Bloqueio de Quests"},
	[5]  = {days = 30,   name = "Regra 5 - Desrespeito a Staff e Tutores"},
	[6]  = {days = 15,   name = "Regra 6 - Abuso contra Novatos"},
	[7]  = {days = 9999, name = "Regra 7 - Bug Abuse e Duplicacao (Dupes)"},
	[8]  = {days = 9999, name = "Regra 8 - Divulgacao de outros Servidores"},
	[9]  = {days = 9999, name = "Regra 9 - Abuso de MC no PvP ou Trap"},
	[10] = {days = 9999, name = "Regra 10 - Fraude em Doacoes e Estorno"},
	[11] = {days = 9999, name = "Regra 11 - Comercio de Scripts de Bot"},
	[12] = {days = 9999, name = "Regra 12 - RMT e Comercio In-Game"},
	[13] = {days = 9999, name = "Regra 13 - Trocas entre Servidores"},
	[14] = {days = 9999, name = "Regra 14 - Trapacas no PvP (Magebomb/Nav)"},
	[15] = {days = 90,   name = "Regra 15 - Uso de Low Level em Battle"},
	[16] = {days = 90,   name = "Regra 16 - Abuso no Guild Chat (/guildbc)"},
	[17] = {days = 9999, name = "Regra 17 - Uso de Bots e Programas Externos"},
	[18] = {days = 9999, name = "Regra 18 - Tentativa de Roubo de Contas"},
	[19] = {days = 7,    name = "Regra 19 - Nome Invalido / Ofensivo (Namelock)"},
}

function onSay(player, words, param)
	local gid = player:getGroup():getId()
	if gid < 4 and not player:getGroup():getAccess() then
		player:sendCancelMessage("Apenas GMs, CMs e GODs tem permissao para aplicar banimentos.")
		return false
	end

	local params = splitTrimmed(param, ",")
	local name = params[1]

	if not name or name == "" then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Uso do comando /ban (Player Ban):")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "/ban NomeDoPlayer, NumeroDaRegra (Ex: /ban Frodo, 1)")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "/ban NomeDoPlayer, Dias, Motivo Escrito (Ex: /ban Frodo, 7, Uso de Cavebot)")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, "--- LISTA DE REGRAS E PUNICOES ---")
		for id, r in ipairs(siteRules) do
			local dStr = (r.days >= 999 or r.days <= 0) and "Permanente" or (r.days .. " dias")
			player:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, string.format("[%d] %s (%s)", id, r.name, dStr))
		end
		return false
	end

	local resultId = db.storeQuery("SELECT `id`, `account_id` FROM `players` WHERE `name` = " .. db.escapeString(name))
	if resultId == false then
		player:sendCancelMessage("Jogador " .. name .. " nao encontrado.")
		return false
	end

	local targetGuid = result.getDataInt(resultId, "id")
	result.free(resultId)

	local checkBan = db.storeQuery("SELECT 1 FROM `player_bans` WHERE `player_id` = " .. targetGuid)
	if checkBan ~= false then
		result.free(checkBan)
		player:sendCancelMessage("O personagem " .. name .. " ja esta banido.")
		return false
	end

	local banDays = 9999
	local reason = "Regra 17 - Uso de Bots e Programas Externos"

	if #params >= 3 then
		banDays = tonumber(params[2]) or 7
		reason = params[3]
	elseif #params == 2 then
		local ruleNum = tonumber(params[2])
		if ruleNum and siteRules[ruleNum] then
			banDays = siteRules[ruleNum].days
			reason = siteRules[ruleNum].name
		else
			reason = params[2]
		end
	end

	local timeNow = os.time()
	local isPermanent = (banDays <= 0 or banDays >= 999)
	local timeExpire = isPermanent and -1 or (timeNow + (banDays * 86400))

	db.query(string.format(
		"INSERT INTO `player_bans` (`player_id`, `reason`, `banned_at`, `expires_at`, `banned_by`) VALUES (%d, %s, %d, %d, %d)",
		targetGuid, db.escapeString(reason), timeNow, timeExpire, player:getGuid()
	))

	-- Efeito magico vermelho no Staff executor
	player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)

	local durationText = ""
	if isPermanent then
		durationText = "permanentemente"
	elseif banDays == 1 then
		durationText = "por 1 dia"
	else
		durationText = string.format("por %d dias", banDays)
	end

	local target = Player(name)
	if target ~= nil then
		local tpos = target:getPosition()
		tpos:sendMagicEffect(CONST_ME_MORTAREA)
		tpos:sendMagicEffect(CONST_ME_EXPLOSIONHIT)
		target:sendTextMessage(MESSAGE_STATUS_WARNING, string.format("Seu personagem foi banido %s. Motivo: %s", durationText, reason))
		target:remove()
	end

	-- Mensagem de anuncio para todo o servidor em destaque e laranja (sem caracteres especiais)
	local broadcastMsg = string.format("Punicao: %s baniu o jogador %s %s. Motivo: %s.", player:getName(), name, durationText, reason)
	
	Game.broadcastMessage(broadcastMsg, MESSAGE_STATUS_CONSOLE_ORANGE)
	Game.broadcastMessage(broadcastMsg, MESSAGE_STATUS_WARNING)

	-- Repetir para permanecer cerca de 10 segundos na tela de todos
	addEvent(function()
		Game.broadcastMessage(broadcastMsg, MESSAGE_STATUS_WARNING)
	end, 3500)

	addEvent(function()
		Game.broadcastMessage(broadcastMsg, MESSAGE_STATUS_WARNING)
	end, 7000)

	return false
end
