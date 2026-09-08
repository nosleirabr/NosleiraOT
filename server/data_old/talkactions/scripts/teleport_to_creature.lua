function onSay(player, words, param)
	if not player:getGroup():getAccess() then
		return true
	end

	if param == "" then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Command param required.")
		return false
	end

	-- Check if param is coordinates (e.g. 32668, 32069, 8 or 32668 32069 8)
	local split = param:find(",") and param:split(",") or param:split(" ")
	if split and #split >= 3 and tonumber(split[1]) and tonumber(split[2]) and tonumber(split[3]) then
		local pos = Position(tonumber(split[1]), tonumber(split[2]), tonumber(split[3]))
		local tmp = player:getPosition()
		if player:teleportTo(pos) and not player:isInGhostMode() then
			tmp:sendMagicEffect(CONST_ME_POFF)
			pos:sendMagicEffect(CONST_ME_TELEPORT)
			player:setDirection(SOUTH)
		end
		return false
	end

	local target = Creature(param)
	if target == nil then
		player:sendCancelMessage("Creature not found.")
		return false
	end

	player:teleportTo(target:getPosition())
	return false
end
