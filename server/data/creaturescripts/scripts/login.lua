-- Ordered as in creaturescripts.xml
local events = {
	'PlayerDeath',
	'DropLoot'
}

function onLogin(player)
	local loginStr = ""
	local timeZone = ""

	if player:getLastLoginSaved() <= 0 then
		loginStr = "Welcome to " .. configManager.getString(configKeys.SERVER_NAME) .. "!"
		loginStr = loginStr .. " Please choose your outfit."
		player:sendOutfitWindow()
	else
		if loginStr ~= "" then
			player:sendTextMessage(MESSAGE_STATUS_DEFAULT, loginStr)
		end

		if os.date("%Z").isdst ~= nil then
			timeZone = "CET"
		else
			timeZone = "CEST"
		end

		loginStr = string.format("Your last visit in " .. configManager.getString(configKeys.SERVER_NAME) .. ": %s " .. timeZone .. ".", os.date("%d. %b %Y %X", player:getLastLoginSaved()))
	end
	player:sendTextMessage(MESSAGE_STATUS_DEFAULT, loginStr)

	-- Admin Outfit and Permanent Light
	if player:getGroup():getId() >= 3 then
		local outfit = player:getOutfit()
		outfit.lookType = 75
		player:setOutfit(outfit)

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
