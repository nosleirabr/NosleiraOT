local function saveExperience()
	db.query("INSERT IGNORE INTO `player_experience` (`player_id`, `experience`, `date`) SELECT `id`, `experience`, " .. os.time() .. " FROM `players`")
end

function onTime(interval)
	saveExperience()
	return true
end
