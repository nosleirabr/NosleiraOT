local defaultIpBanDays = 7

-- Tabela de regras baseada nas regras do site
-- O GM pode usar: /ipban Player, id_da_regra
local siteRules = {
	[1] = {days = 3, reason = "Comentar sobre Reset's"},
	[2] = {days = 7, reason = "Fazer free itens"},
	[3] = {days = 3, reason = "Bloquear a hunt ou respawn"},
	[4] = {days = 3, reason = "Bloquear acessos a Quests ou atrapalhar team"},
	[5] = {days = 7, reason = "Ofender tutores ou desrespeitar GM/CM"},
	[6] = {days = 7, reason = "Conduta abusiva perante jogador novato (Abuso de poder)"},
	[7] = {days = 30, reason = "Ofertas fraudulentas no Trade OFF"},
	[8] = {days = 30, reason = "Anuncios de outros servidores"},
	[9] = {days = 7, reason = "Uso de MC para beneficios no PvP"},
	[13] = {days = 30, reason = "Venda ou anuncio de scripts para BOT"},
	[14] = {days = 999, reason = "Venda de personagens/itens por dinheiro real"},
}

function onSay(player, words, param)
	if not player:getGroup():getAccess() then
		return true
	end

	local name = param
	local reason = ''

	local separatorPos = param:find(',')
	if separatorPos ~= nil then
		name = string.trim(param:sub(0, separatorPos - 1))
		reason = string.trim(param:sub(separatorPos + 1))
	end

	if name == '' then
		player:sendCancelMessage("Command param required. Example: /ipban PlayerName, RuleID")
		return false
	end

	local resultId = db.storeQuery("SELECT `account_id`, `lastip` FROM `players` WHERE `name` = " .. db.escapeString(name))
	if resultId == false then
		player:sendCancelMessage("Player " .. name .. " does not exist.")
		return false
	end

	local targetIp = result.getDataLong(resultId, "lastip")
	result.free(resultId)

	local targetPlayer = Player(name)
	if targetPlayer then
		targetIp = targetPlayer:getIp()
		local tpos = targetPlayer:getPosition()
		tpos:sendMagicEffect(CONST_ME_MORTAREA)
		tpos:sendMagicEffect(CONST_ME_EXPLOSIONHIT)
		targetPlayer:remove()
	end
	player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)

	if targetIp == 0 then
		return false
	end

	resultId = db.storeQuery("SELECT 1 FROM `ip_bans` WHERE `ip` = " .. targetIp)
	if resultId ~= false then
		result.free(resultId)
		player:sendCancelMessage("IP of player " .. name .. " is already banned.")
		return false
	end

	-- Verificar se 'reason' é um ID de regra
	local ruleId = tonumber(reason)
	local banDays = defaultIpBanDays

	if ruleId and siteRules[ruleId] then
		banDays = siteRules[ruleId].days
		reason = "Regra " .. ruleId .. " - " .. siteRules[ruleId].reason
	elseif reason == '' then
		reason = "Violacao das regras do servidor (IP Ban)"
	end

	local timeNow = os.time()
	db.query("INSERT INTO `ip_bans` (`ip`, `reason`, `banned_at`, `expires_at`, `banned_by`) VALUES (" ..
			targetIp .. ", " .. db.escapeString(reason) .. ", " .. timeNow .. ", " .. timeNow + (banDays * 86400) .. ", " .. player:getGuid() .. ")")

	-- Transmissão global do banimento informando GM, player, dias e motivo
	local gmName = player:getName()
	local broadcastMessage = string.format("O GM %s aplicou um IP Ban no jogador %s por %d dias. Motivo: %s", gmName, name, banDays, reason)
	Game.broadcastMessage(broadcastMessage, MESSAGE_EVENT_ADVANCE)

	return false
end

