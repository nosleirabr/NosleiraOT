function onEquip(player, item, slot)
	if player:getGroup():getId() < 3 then
		player:sendCancelMessage("Only Gamemasters can use this backpack.")
		return false
	end
	return true
end

function onDeEquip(player, item, slot)
	return true
end
