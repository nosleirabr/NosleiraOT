function onSay(player, words, param)
	local hasPz = player:hasCondition(CONDITION_INFIGHT)
	local skull = player:getSkull()
	
	if not hasPz and skull == SKULL_NONE then
		player:say("Sem PZ e sem Skull!", TALKTYPE_MONSTER_SAY)
		return false
	end

	local msg = ""
	
	local pzCondition = player:getCondition(CONDITION_INFIGHT)
	if pzCondition then
		local ticks = pzCondition:getTicks()
		if ticks > 0 then
			local seconds = math.ceil(ticks / 1000)
			local mins = math.floor(seconds / 60)
			local secs = seconds % 60
			if mins > 0 then
				msg = string.format("PZ: %dm %ds", mins, secs)
			else
				msg = string.format("PZ: %ds", secs)
			end
		end
	end

	if skull ~= SKULL_NONE then
		-- Trying to get skull time if available
		local skullTime = 0
		if player.getSkullTime then
			skullTime = player:getSkullTime()
		end
		
		if skullTime > 0 then
			local seconds = math.ceil(skullTime / 1000)
			local mins = math.floor(seconds / 60)
			local secs = seconds % 60
			local skullStr = ""
			if mins > 0 then
				skullStr = string.format("Skull: %dm %ds", mins, secs)
			else
				skullStr = string.format("Skull: %ds", secs)
			end
			
			if msg ~= "" then
				msg = msg .. " | " .. skullStr
			else
				msg = skullStr
			end
		else
			if msg ~= "" then
				msg = msg .. " | Skull Ativa"
			else
				msg = "Skull Ativa"
			end
		end
	end

	if msg ~= "" then
		player:say(msg, TALKTYPE_MONSTER_SAY)
	else
		player:say("PZ ou Skull ativa!", TALKTYPE_MONSTER_SAY)
	end

	return false
end
