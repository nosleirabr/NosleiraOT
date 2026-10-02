function onLogout(player)
	local playerId = player:getId()
	if nextUseStaminaTime[playerId] ~= nil then
		nextUseStaminaTime[playerId] = nil
	end
	db.query("DELETE FROM `player_online_states` WHERE `player_id` = " .. playerId)
	return true
end
