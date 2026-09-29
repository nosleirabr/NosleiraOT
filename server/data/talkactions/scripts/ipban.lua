--[[
	Talkaction: /ipban
	Aplica banimento por IP do jogador informado.
	Apenas GMs (4), CMs (5) e GODs (6) podem executar este comando.
]]

local defaultIpBanDays = 7

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

-- Tabela de regras baseada nas regras do site
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
		player:sendCancelMessage("Apenas GMs, CMs e GODs tem permissao para aplicar banimentos por IP.")
		return false
	end

	local params = splitTrimmed(param, ",")
	local name = params[1]

	if not name or name == "" then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Uso do comando /ipban (IP Ban):")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "/ipban NomeDoPlayer (Padrao: 7 dias, Violacao das regras)")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "/ipban NomeDoPlayer, NumeroDaRegra (Ex: /ipban Frodo, 1)")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "/ipban NomeDoPlayer, Dias, Motivo (Ex: /ipban Frodo, 7, Motivo Escrito)")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, "--- LISTA DE REGRAS E PUNICOES ---")
		for id, r in ipairs(siteRules) do
			local dStr = (r.days >= 999 or r.days <= 0) and "Permanente" or (r.days .. " dias")
			player:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, string.format("[%d] %s (%s)", id, r.name, dStr))
		end
		return false
	end

	local resultId = db.storeQuery("SELECT `account_id`, `lastip` FROM `players` WHERE `name` = " .. db.escapeString(name))
	if resultId == false then
		player:sendCancelMessage("Jogador " .. name .. " nao encontrado.")
		return false
	end

	local targetIp = result.getDataLong(resultId, "lastip")
	result.free(resultId)

	local targetPlayer = Player(name)
	if targetPlayer then
		targetIp = targetPlayer:getIp()
		local tpos = targetPlayer:getPosition()
		tpos:sendMagicEffect(CONST_ME_FIREAREA)
		tpos:sendMagicEffect(CONST_ME_EXPLOSIONHIT)
		targetPlayer:remove()
	end

	if not targetIp or targetIp == 0 then
		player:sendCancelMessage("Nao foi possivel obter o IP do jogador " .. name .. ".")
		return false
	end

	resultId = db.storeQuery("SELECT 1 FROM `ip_bans` WHERE `ip` = " .. targetIp)
	if resultId ~= false then
		result.free(resultId)
		player:sendCancelMessage("O IP do jogador " .. name .. " ja esta banido.")
		return false
	end

	local banDays = defaultIpBanDays
	local reason = "Violacao das regras do servidor (IP Ban)"

	if #params >= 3 then
		banDays = tonumber(params[2]) or defaultIpBanDays
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

	db.query("INSERT INTO `ip_bans` (`ip`, `reason`, `banned_at`, `expires_at`, `banned_by`) VALUES (" ..
			targetIp .. ", " .. db.escapeString(reason) .. ", " .. timeNow .. ", " .. timeExpire .. ", " .. player:getGuid() .. ")")

	local durationText = ""
	if isPermanent then
		durationText = "permanentemente"
	elseif banDays == 1 then
		durationText = "por 1 dia"
	else
		durationText = string.format("por %d dias", banDays)
	end

	-- Mensagem de anuncio para todo o servidor em destaque e laranja (sem caracteres especiais)
	local broadcastMsg = string.format("Punicao: %s aplicou um IP Ban no jogador %s %s. Motivo: %s.", player:getName(), name, durationText, reason)

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
