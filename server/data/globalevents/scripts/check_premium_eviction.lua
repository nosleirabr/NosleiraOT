-- Periodic check for online players whose Premium Account has expired while in a Premium area/town.
function onThink(interval)
	local onlinePlayers = Game.getPlayers()
	for i = 1, #onlinePlayers do
		local player = onlinePlayers[i]
		if player then
			player:checkPremiumEviction()
		end
	end
	return true
end
