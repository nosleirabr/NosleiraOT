local upFloorIds = {1386, 3678, 5543}

local function isWalkableDestination(position)
	local tile = Tile(position)
	if not tile or not tile:getGround() then
		return false
	end
	-- Refuse solid fills (e.g. mountain 918–919 under decorative draw wells)
	if tile:hasProperty(CONST_PROP_BLOCKSOLID) then
		return false
	end
	return true
end

function onUse(player, item, fromPosition, target, toPosition)
	local destination = Position(fromPosition)
	if isInArray(upFloorIds, item.itemid) then
		destination:moveUpstairs()
	else
		destination.z = destination.z + 1
	end

	if not isWalkableDestination(destination) then
		player:sendCancelMessage("There is no way.")
		return true
	end

	player:teleportTo(destination, false)
	return true
end
