--[[
	Talkaction: /unban
	Remove o banimento do jogador (player ban), da conta (account ban) e do IP,
	exibindo mensagem formatada e efeito mágico verde de restauração.
]]

function onSay(player, words, param)
	if not player:getGroup():getAccess() then
		return true
	end

	param = string.trim(param)
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
		-- Foi passado ID numérico da conta
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

	-- Efeito mágico verde no Staff
	local pos = player:getPosition()
	pos:sendMagicEffect(CONST_ME_MAGIC_GREEN)
	pos:sendMagicEffect(CONST_ME_GREEN_RINGS)

	-- Se o jogador estiver online, envia efeito nele também
	local target = Player(charName)
	if target ~= nil then
		target:getPosition():sendMagicEffect(CONST_ME_MAGIC_GREEN)
		target:getPosition():sendMagicEffect(CONST_ME_GREEN_RINGS)
	end

	-- Mensagem de confirmação
	player:sendTextMessage(MESSAGE_STATUS_CONSOLE_ORANGE, string.format("[UNBAN] O jogador / conta '%s' foi desbanido com sucesso!", charName))
	player:sendTextMessage(MESSAGE_INFO_DESCR, string.format("O jogador '%s' foi desbanido.", charName))
	player:sendTextMessage(MESSAGE_STATUS_WARNING, string.format("Jogador '%s' foi desbanido com sucesso!", charName))

	return false
end
