-- Shared decorative lever: flips sprite + message, no stone/door logic.
-- Used by map-as-code aid 50999 for remaining unlabeled realmap levers.
function onUse(player, item, fromPosition, target, toPosition, isHotkey)
	if item.itemid == 1945 then
		item:transform(1946)
		player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You hear a mechanism moving in the distance.")
		addEvent(function(pos)
			local tile = Tile(pos)
			if not tile then
				return
			end
			local lever = tile:getItemById(1946)
			if lever then
				lever:transform(1945)
			end
		end, 2 * 60 * 1000, item:getPosition())
		return true
	elseif item.itemid == 1946 then
		player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "The mechanism is already active.")
		return true
	end
	return false
end
