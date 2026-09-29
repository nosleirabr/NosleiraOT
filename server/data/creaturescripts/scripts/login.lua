-- Ordered as in creaturescripts.xml
local events = {
	'PlayerDeath',
	'DropLoot'
}

-- Formatação de data em português para a mensagem de boas-vindas
local function formatPortugueseDate(timestamp)
	local months = {
		[1] = "janeiro", [2] = "fevereiro", [3] = "março", [4] = "abril",
		[5] = "maio", [6] = "junho", [7] = "julho", [8] = "agosto",
		[9] = "setembro", [10] = "outubro", [11] = "novembro", [12] = "dezembro"
	}
	local t = os.date("*t", timestamp)
	local monthName = months[t.month] or "janeiro"
	return string.format("%d de %s de %04d às %02d:%02d:%02d", t.day, monthName, t.year, t.hour, t.min, t.sec)
end

function onLogin(player)
	local serverName = configManager.getString(configKeys.SERVER_NAME)
	local loginStr = ""

	if player:getLastLoginSaved() <= 0 then
		loginStr = string.format("Bem-vindo ao %s! Por favor, escolha seu outfit.", serverName)
		player:sendOutfitWindow()
	else
		loginStr = string.format("Bem-vindo ao %s! Sua última visita foi em %s.", serverName, formatPortugueseDate(player:getLastLoginSaved()))
	end
	player:sendTextMessage(MESSAGE_STATUS_DEFAULT, loginStr)

	-- Admin Outfit, Vocation and Permanent Light
	if player:getGroup():getId() >= 4 then
		local outfit = player:getOutfit()
		outfit.lookType = 75
		player:setOutfit(outfit)
		
		player:setVocation(Vocation(0))

		-- Permanent maximum light (level 255, white color 215)
		local lightCondition = Condition(CONDITION_LIGHT)
		lightCondition:setParameter(CONDITION_PARAM_LIGHT_LEVEL, 255)
		lightCondition:setParameter(CONDITION_PARAM_LIGHT_COLOR, 215)
		lightCondition:setParameter(CONDITION_PARAM_TICKS, -1)
		player:addCondition(lightCondition)
	end

	-- Promotion
	local vocation = player:getVocation()
	local promotion = vocation:getPromotion()
	if player:isPremium() then
		local value = player:getStorageValue(STORAGEVALUE_PROMOTION)
		if not promotion and value ~= 1 then
			player:setStorageValue(STORAGEVALUE_PROMOTION, 1)
		elseif value == 1 then
			player:setVocation(promotion)
		end
	elseif not promotion then
		player:setVocation(vocation:getDemotion())
	end

	-- Events
	for i = 1, #events do
		player:registerEvent(events[i])
	end

	return true
end
