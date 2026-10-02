-- Atualizacao periodica de estados em tempo real para o site (Battle, PZ, Magic Shield, Haste)
function onThink(interval)
	local players = Game.getPlayers()
	if #players == 0 then
		db.query("TRUNCATE TABLE `player_online_states`")
		return true
	end

	local values = {}
	local timeNow = os.time()
	for _, player in ipairs(players) do
		local pid = player:getId()
		local inFight = (player:getCondition(CONDITION_INFIGHT) ~= nil) and 1 or 0
		local tile = player:getTile()
		local inPz = (tile and tile:hasFlag(TILESTATE_PROTECTIONZONE)) and 1 or 0
		local pzLocked = player:isPzLocked() and 1 or 0
		local manashield = (player:getCondition(CONDITION_MANASHIELD) ~= nil) and 1 or 0
		local haste = (player:getCondition(CONDITION_HASTE) ~= nil) and 1 or 0
		values[#values + 1] = string.format("(%d, %d, %d, %d, %d, %d, %d)", pid, inFight, inPz, pzLocked, manashield, haste, timeNow)
	end

	if #values > 0 then
		db.query("REPLACE INTO `player_online_states` (`player_id`, `in_fight`, `in_pz`, `pz_locked`, `manashield`, `haste`, `updated_at`) VALUES " .. table.concat(values, ","))
	end
	return true
end
