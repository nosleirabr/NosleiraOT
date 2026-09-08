-- Sacrifice a scarab coin (2159) on a coal basin while standing on a mystic flame (1397)
-- that was registered by hota_mystic_flames.lua at startup.
function onUse(player, item, fromPosition, target, toPosition, isHotkey)
	if not target or (target.itemid ~= 1484 and target.itemid ~= 1485) then
		return false
	end

	local playerPos = player:getPosition()
	local posKey = playerPos.x .. "_" .. playerPos.y .. "_" .. playerPos.z

	if HotaTeleportDests and HotaTeleportDests[posKey] then
		local playerTile = Tile(playerPos)
		if playerTile and playerTile:getItemById(1397) then
			item:remove(1)
			player:teleportTo(HotaTeleportDests[posKey])
			playerPos:sendMagicEffect(CONST_ME_MAGIC_BLUE)
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
			return true
		end
	end

	player:sendCancelMessage("You must stand on the mystic flame to sacrifice this coin.")
	return true
end
