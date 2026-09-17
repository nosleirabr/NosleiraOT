function onSay(player, words, param)
	local targetPosition = player:getPosition()
	targetPosition:sendMagicEffect(CONST_ME_MAGIC_BLUE)
	local dir = player:getDirection()
	if dir == DIRECTION_NORTH then targetPosition.y = targetPosition.y - 1
	elseif dir == DIRECTION_SOUTH then targetPosition.y = targetPosition.y + 1
	elseif dir == DIRECTION_WEST then targetPosition.x = targetPosition.x - 1
	elseif dir == DIRECTION_EAST then targetPosition.x = targetPosition.x + 1 end
	local tile = Tile(targetPosition)
	if not tile then return false end
	local doorItem = nil
	for i = 0, tile:getThingCount() - 1 do
		local thing = tile:getThing(i)
		if thing and thing:isItem() and thing:getType():isDoor() then
			doorItem = thing
			break
		end
	end
	if not doorItem then
		player:sendTextMessage(MESSAGE_STATUS_SMALL, 'Look at a door and try again.')
		return false
	end
	-- Set actionId to 10000 to permanently lock it
	doorItem:setAttribute(ITEM_ATTRIBUTE_ACTIONID, 10000)
	player:sendTextMessage(MESSAGE_STATUS_SMALL, 'Door permanently locked!')
	return false
end