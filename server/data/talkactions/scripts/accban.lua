--[[
	Talkaction: /accban ou /banacc
	Bane a CONTA INTEIRA do jogador permanentemente. 
	Apenas GMs (4), CMs (5) e GODs (6) podem executar este comando.
	A notificacao deste banimento e EXCLUSIVA para a Staff (Tutors, ST, GMs, CMs, GODs).
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

local function sendStaffWarning(msg, alsoConsole)
	for _, p in ipairs(Game.getPlayers()) do
		local g = p:getGroup()
		if g and (g:getId() >= 2 or g:getAccess()) then
			if alsoConsole then
				p:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, msg)
			end
			p:sendTextMessage(MESSAGE_STATUS_WARNING, msg)
		end
	end
end

function onSay(player, words, param)
	local gid = player:getGroup():getId()
	if gid < 4 and not player:getGroup():getAccess() then
		player:sendCancelMessage("Apenas GMs, CMs e GODs tem permissao para banir contas.")
		return false
	end

	local params = splitTrimmed(param, ",")
	local targetNameOrId = params[1]

	if not targetNameOrId or targetNameOrId == "" then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Uso do comando /accban (Account Ban - Permanente):")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "/accban NomeDoPlayer, Motivo (Ex: /accban Frodo, Tentativa de fraude)")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "/accban NumeroDaConta, Motivo (Ex: /accban 2, Tentativa de fraude)")
		return false
	end

	local accountId = tonumber(targetNameOrId)
	local charName = targetNameOrId

	if not accountId or accountId == 0 then
		local resultId = db.storeQuery("SELECT `account_id` FROM `players` WHERE `name` = " .. db.escapeString(targetNameOrId))
		if resultId ~= false then
			accountId = result.getDataInt(resultId, "account_id")
			result.free(resultId)
		else
			player:sendCancelMessage("Jogador ou Conta '" .. targetNameOrId .. "' nao encontrado.")
			return false
		end
	end

	local checkBan = db.storeQuery("SELECT 1 FROM `account_bans` WHERE `account_id` = " .. accountId)
	if checkBan ~= false then
		result.free(checkBan)
		player:sendCancelMessage("A conta " .. accountId .. " ja esta banida.")
		return false
	end

	local reason = params[2] or "Violacao grave das regras do servidor (Conta Banida)"

	local timeNow = os.time()
	local timeExpire = -1 -- Permanente (ate o Staff desbanir manualmente)

	db.query(string.format(
		"INSERT INTO `account_bans` (`account_id`, `reason`, `banned_at`, `expires_at`, `banned_by`) VALUES (%d, %s, %d, %d, %d)",
		accountId, db.escapeString(reason), timeNow, timeExpire, player:getGuid()
	))

	-- Desconectar todos os jogadores online dessa conta
	local accPlayers = db.storeQuery("SELECT `name` FROM `players` WHERE `account_id` = " .. accountId)
	if accPlayers ~= false then
		repeat
			local pName = result.getDataString(accPlayers, "name")
			local pObj = Player(pName)
			if pObj ~= nil then
				local tpos = pObj:getPosition()
				tpos:sendMagicEffect(CONST_ME_FIREAREA)
				tpos:sendMagicEffect(CONST_ME_EXPLOSIONHIT)
				pObj:sendTextMessage(MESSAGE_STATUS_WARNING, "Sua conta foi banida permanentemente. Motivo: " .. reason)
				pObj:remove()
			end
		until not result.next(accPlayers)
		result.free(accPlayers)
	end

	-- Mensagem de aviso EXCLUSIVA para a Staff (Tutors, Senior Tutors, GMs, CMs e GODs)
	local staffMsg = string.format("[STAFF] Punicao: %s baniu a CONTA do jogador %s permanentemente. Motivo: %s.", player:getName(), charName, reason)
	
	sendStaffWarning(staffMsg, true)

	-- Repetir em destaque na tela apenas para a Staff por cerca de 10 segundos
	addEvent(function()
		sendStaffWarning(staffMsg, false)
	end, 3500)

	addEvent(function()
		sendStaffWarning(staffMsg, false)
	end, 7000)

	return false
end
