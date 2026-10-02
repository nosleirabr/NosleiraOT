local OPCODE_LANGUAGE = 1
local OPCODE_COMBAT_MODES = 50

function onExtendedOpcode(player, opcode, buffer)
	if opcode == OPCODE_LANGUAGE then
		if buffer == 'en' or buffer == 'pt' then
			-- otclient language
		end
	elseif opcode == OPCODE_COMBAT_MODES then
		local status, data = pcall(json.decode, buffer)
		if status and type(data) == "table" then
			local fightMode = tonumber(data.fightMode) or 2
			local chaseMode = tonumber(data.chaseMode) or 0
			local safeMode = tonumber(data.safeMode) or 1
			db.query(string.format("UPDATE `players` SET `fight_mode` = %d, `chase_mode` = %d, `safe_mode` = %d WHERE `id` = %d", fightMode, chaseMode, safeMode, player:getGuid()))
		end
	end
end
