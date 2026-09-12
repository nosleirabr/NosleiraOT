local unlockedDoors = {}

local function isDoorLocked(keyId, position)
	if keyId == 0 then
		return false
	end

	if unlockedDoors[keyId] then
		for i = 1, #unlockedDoors[keyId] do
			if position == unlockedDoors[keyId][i] then
				return false
			end
		end
	end

	return true
end

local function toggleDoorLock(doorItem, locked)
	local doorId = doorItem:getId()
	local keyId = doorItem:getActionId()
	local doorPosition = doorItem:getPosition()

	if locked then
		if unlockedDoors[keyId] then
			for i = #unlockedDoors[keyId], 1, -1 do
				if unlockedDoors[keyId][i] == doorPosition then
					table.remove(unlockedDoors[keyId], i)
				end
			end
		end

		if not doors[doorId] then
			doorItem:transform(doorId - 1)
		end
		return
	end

	if not unlockedDoors[keyId] then
		unlockedDoors[keyId] = {}
	end

	doorItem:transform(doors[doorId])
	unlockedDoors[keyId][#unlockedDoors[keyId] + 1] = doorPosition
end

local customDoors = {
    -- Paradox Door
    [30034] = function(player, item, toPosition)
        if player:getGroup():getAccess() > 0 then
            item:transform(item:getId() == 1213 and 1214 or 1213)
            return true
        end
        if player:getLevel() < 30 then
            player:sendTextMessage(MESSAGE_INFO_DESCR, "Only players of level 30 or higher may pass.")
            return false
        end
        local function hasKey3822(p)
            local function searchContainer(container)
                for i = 0, container:getSize() - 1 do
                    local it = container:getItem(i)
                    if it then
                        if it:getId() >= 2086 and it:getId() <= 2092 and it:getActionId() == 3822 then
                            return true
                        elseif it:isContainer() then
                            if searchContainer(Container(it.uid)) then return true end
                        end
                    end
                end
                return false
            end
            for slot = CONST_SLOT_FIRST, CONST_SLOT_LAST do
                local it = p:getSlotItem(slot)
                if it then
                    if it:getId() >= 2086 and it:getId() <= 2092 and it:getActionId() == 3822 then
                        return true
                    elseif it:isContainer() then
                        if searchContainer(Container(it.uid)) then return true end
                    end
                end
            end
            return false
        end
        if not hasKey3822(player) then
            player:sendTextMessage(MESSAGE_INFO_DESCR, "It is locked.")
            return false
        end
        item:transform(item:getId() == 1213 and 1214 or 1213)
        return true
    end,
    -- Postman Doors
    [30051] = function(player, item, toPosition)
        if player:getStorageValue(12460) >= 1 then 
            item:transform(item:getId() + 1)
            player:teleportTo(toPosition, true)
            return true
        end
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You don't have the required Postman rank to enter.")
        return false
    end,
    [30052] = function(player, item, toPosition)
        if player:getStorageValue(12460) >= 2 then 
            item:transform(item:getId() + 1)
            player:teleportTo(toPosition, true)
            return true
        end
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You don't have the required Postman rank to enter.")
        return false
    end,
    [30053] = function(player, item, toPosition)
        if player:getStorageValue(12460) >= 3 then 
            item:transform(item:getId() + 1)
            player:teleportTo(toPosition, true)
            return true
        end
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You don't have the required Postman rank to enter.")
        return false
    end,
    [30054] = function(player, item, toPosition)
        if player:getStorageValue(12460) >= 4 then 
            item:transform(item:getId() + 1)
            player:teleportTo(toPosition, true)
            return true
        end
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You don't have the required Postman rank to enter.")
        return false
    end,
    [30055] = function(player, item, toPosition)
        if player:getStorageValue(12460) >= 5 then 
            item:transform(item:getId() + 1)
            player:teleportTo(toPosition, true)
            return true
        end
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You don't have the required Postman rank to enter.")
        return false
    end,
    -- Djinn Doors
    [30061] = function(player, item, toPosition)
        if player:getStorageValue(51110) > 0 then 
            item:transform(item:getId() + 1)
            player:teleportTo(toPosition, true)
            return true
        end
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You are not pledged to the Marid (Blue Djinn) faction.")
        return false
    end,
    [30062] = function(player, item, toPosition)
        if player:getStorageValue(51120) > 0 then 
            item:transform(item:getId() + 1)
            player:teleportTo(toPosition, true)
            return true
        end
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You are not pledged to the Efreet (Green Djinn) faction.")
        return false
    end
}

function executeDoor(player, item, fromPosition, target, toPosition)
	local itemId = item:getId()
	local actionId = item:getActionId()

	local customDoor = customDoors[actionId]
	if customDoor then
		customDoor(player, item, toPosition)
		return true
	end


	if isInArray(questDoors, itemId) then
		if player:getStorageValue(actionId) ~= -1 then
			item:transform(itemId + 1)
			player:teleportTo(toPosition, true)
		else
			player:sendTextMessage(MESSAGE_INFO_DESCR, "The door seems to be sealed against unwanted intruders.")
		end
		return true

	elseif isInArray(levelDoors, itemId) then
		if actionId > 0 and player:getLevel() >= actionId - 1000 then
			item:transform(itemId + 1)
			player:teleportTo(toPosition, true)
		else
			player:sendTextMessage(MESSAGE_INFO_DESCR, "Only the worthy may pass.")
		end
		return true

	elseif isInArray(keys, itemId) then
		if not target
				or not target:isItem()
				or not target:getType():isDoor()
				or (Tile(toPosition) and Tile(toPosition):getHouse()) then
			return false
		end

		local targetId = target:getId()
		if isInArray(openSpecialDoors, targetId)
				or isInArray(questDoors, targetId)
				or isInArray(levelDoors, targetId) then
			return false
		end

		local targetActionId = target:getActionId()
		if targetActionId > 0 and actionId == targetActionId then
			if not isDoorLocked(targetActionId, toPosition) then
				toggleDoorLock(target, true)
			elseif doors[targetId] then
				toggleDoorLock(target, false)
			end
		else
			player:sendTextMessage(MESSAGE_STATUS_SMALL, "The key does not match.")
		end
		return true
	end

	if isInArray(horizontalOpenDoors, itemId) or isInArray(verticalOpenDoors, itemId) then
		local doorCreature = Tile(toPosition):getTopCreature()
		if doorCreature ~= nil then
			toPosition.x = toPosition.x + 1
			local query = Tile(toPosition):queryAdd(doorCreature, bit.bor(FLAG_IGNOREBLOCKCREATURE, FLAG_PATHFINDING))
			if query ~= RETURNVALUE_NOERROR then
				toPosition.x = toPosition.x - 1
				toPosition.y = toPosition.y + 1
				query = Tile(toPosition):queryAdd(doorCreature, bit.bor(FLAG_IGNOREBLOCKCREATURE, FLAG_PATHFINDING))
			end

			if query ~= RETURNVALUE_NOERROR then
				player:sendTextMessage(MESSAGE_STATUS_SMALL, query)
				return true
			end

			doorCreature:teleportTo(toPosition, true)
		end

		if not isInArray(openSpecialDoors, itemId) then
			item:transform(itemId - 1)
		end
		return true
	end

	if doors[itemId] then
		if not isDoorLocked(actionId, toPosition) then
			item:transform(doors[itemId])
		else
			player:sendTextMessage(MESSAGE_INFO_DESCR, "It is locked.")
		end
		return true
	end

	return false
end

function onUse(player, item, fromPosition, target, toPosition)
	return executeDoor(player, item, fromPosition, target, toPosition)
end

_G.executeDoor = executeDoor

