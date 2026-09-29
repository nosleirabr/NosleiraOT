--[[
	Talkaction: /unban
	Remove o banimento do jogador (player ban), da conta (account ban) e do IP.
	Apenas GMs (4), CMs (5) e GODs (6) podem executar este comando.
	A notificacao de desbanimento e PRIVADA (apenas o executor/staff veem).
]]

local function trim(s)
	return (s:gsub("^%s*(.-)%s*$", "%1"))
end

function onSay(player, words, param)
	local gid = player:getGroup():getId()
	if gid < 4 and not player:getGroup():getAccess() then
		player:sendCancelMessage("Apenas GMs, CMs e GODs tem permissao para desbanir.")
		return false
	end

	param = trim(param)
	if param == "" then
		player:sendCancelMessage("Uso do comando: /unban NomeDoJogador (ou /unban NumeroDaConta)")
		return false
	end

	local targetGuid = 0
	local accountId = tonumber(param)
	local lastIp = 0
	local charName = param

	local resultId = db.storeQuery("SELECT `id`, `account_id`, `lastip`, `name` FROM `players` WHERE `name` = " .. db.escapeString(param))
	if resultId ~= false then
		targetGuid = result.getDataInt(resultId, "id")
		accountId = result.getDataInt(resultId, "account_id")
		lastIp = result.getDataInt(resultId, "lastip")
		charName = result.getDataString(resultId, "name")
		result.free(resultId)
	elseif accountId and accountId > 0 then
		-- Foi passado ID numerico da conta
		local pQuery = db.storeQuery("SELECT `id`, `lastip`, `name` FROM `players` WHERE `account_id` = " .. accountId .. " LIMIT 1")
		if pQuery ~= false then
			targetGuid = result.getDataInt(pQuery, "id")
			lastIp = result.getDataInt(pQuery, "lastip")
			charName = result.getDataString(pQuery, "name")
			result.free(pQuery)
		end
	else
		player:sendCancelMessage("Jogador ou Conta '" .. param .. "' nao encontrado.")
		return false
	end

	local unbannedSomething = false

	-- 1. Remove Player Ban se houver
	if targetGuid > 0 then
		local pBan = db.storeQuery("SELECT 1 FROM `player_bans` WHERE `player_id` = " .. targetGuid)
		if pBan ~= false then
			result.free(pBan)
			db.query("DELETE FROM `player_bans` WHERE `player_id` = " .. targetGuid)
			unbannedSomething = true
		end
	end

	-- 2. Remove Account Ban se houver
	if accountId and accountId > 0 then
		local aBan = db.storeQuery("SELECT 1 FROM `account_bans` WHERE `account_id` = " .. accountId)
		if aBan ~= false then
			result.free(aBan)
			db.query("DELETE FROM `account_bans` WHERE `account_id` = " .. accountId)
			unbannedSomething = true
		end
	end

	-- 3. Remove IP Ban se houver
	if lastIp > 0 then
		local iBan = db.storeQuery("SELECT 1 FROM `ip_bans` WHERE `ip` = " .. lastIp)
		if iBan ~= false then
			result.free(iBan)
			db.query("DELETE FROM `ip_bans` WHERE `ip` = " .. lastIp)
			unbannedSomething = true
		end
	end

	-- Mensagem de confirmacao PRIVADA (apenas para o Staff executor)
	player:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, string.format("[UNBAN] O jogador / conta '%s' foi desbanido com sucesso!", charName))
	player:sendTextMessage(MESSAGE_STATUS_WARNING, string.format("Jogador / Conta '%s' foi desbanido com sucesso!", charName))

	return false
end
