local deathListEnabled = true
local maxDeathRecords = 5

function onDeath(player, corpse, killer, mostDamageKiller, unjustified, mostDamageUnjustified)
	local playerId = player:getId()

	player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You are dead.")
	if not deathListEnabled then
		return
	end

	local byPlayer = 0
	local killerName
	if killer ~= nil then
		if killer:isPlayer() then
			byPlayer = 1
		else
			local master = killer:getMaster()
			if master and master ~= killer and master:isPlayer() then
				killer = master
				byPlayer = 1
			end
		end
		killerName = killer:getName()
	else
		killerName = "field item"
	end

	local byPlayerMostDamage = 0
	local mostDamageName
	if mostDamageKiller ~= nil then
		if mostDamageKiller:isPlayer() then
			byPlayerMostDamage = 1
		else
			local master = mostDamageKiller:getMaster()
			if master and master ~= mostDamageKiller and master:isPlayer() then
				mostDamageKiller = master
				byPlayerMostDamage = 1
			end
		end
		mostDamageName = mostDamageKiller:getName()
	else
		mostDamageName = "field item"
	end

	local playerGuid = player:getGuid()
	db.query("INSERT INTO `player_deaths` (`player_id`, `time`, `level`, `killed_by`, `is_player`, `mostdamage_by`, `mostdamage_is_player`, `unjustified`, `mostdamage_unjustified`) VALUES (" .. playerGuid .. ", " .. os.time() .. ", " .. player:getLevel() .. ", " .. db.escapeString(killerName) .. ", " .. byPlayer .. ", " .. db.escapeString(mostDamageName) .. ", " .. byPlayerMostDamage .. ", " .. (unjustified and 1 or 0) .. ", " .. (mostDamageUnjustified and 1 or 0) .. ")")
	local resultId = db.storeQuery("SELECT `player_id` FROM `player_deaths` WHERE `player_id` = " .. playerGuid)

	local deathRecords = 0
	local tmpResultId = resultId
	while tmpResultId ~= false do
		tmpResultId = result.next(resultId)
		deathRecords = deathRecords + 1
	end

	if resultId ~= false then
		result.free(resultId)
	end

	local limit = deathRecords - maxDeathRecords
	if limit > 0 then
		db.asyncQuery("DELETE FROM `player_deaths` WHERE `player_id` = " .. playerGuid .. " ORDER BY `time` LIMIT " .. limit)
	end

	if byPlayer == 1 then
		-- Verificação de banimento automático por excesso de frags (Regra Clássica 7.4: 6/dia, 10/semana, 20/mês)
		if unjustified and killer and killer:isPlayer() then
			local killerAccId = killer:getAccountId()
			local escapedKiller = db.escapeString(killer:getName())

			local q = db.storeQuery(string.format(
				"SELECT " ..
				"(SELECT COUNT(*) FROM `player_deaths` WHERE `killed_by` = %s AND `unjustified` = 1 AND `time` >= (UNIX_TIMESTAMP() - 86400)) as `daily`, " ..
				"(SELECT COUNT(*) FROM `player_deaths` WHERE `killed_by` = %s AND `unjustified` = 1 AND `time` >= (UNIX_TIMESTAMP() - 604800)) as `weekly`, " ..
				"(SELECT COUNT(*) FROM `player_deaths` WHERE `killed_by` = %s AND `unjustified` = 1 AND `time` >= (UNIX_TIMESTAMP() - 2592000)) as `monthly`",
				escapedKiller, escapedKiller, escapedKiller
			))

			if q ~= false then
				local d = result.getNumber(q, "daily")
				local w = result.getNumber(q, "weekly")
				local m = result.getNumber(q, "monthly")
				result.free(q)

				if d >= 6 or w >= 10 or m >= 20 then
					local banDays = 7 -- 7 dias de banimento automático (padrão Tibia 7.4)
					local banExpires = os.time() + (banDays * 86400)
					local reason = string.format("Excessive unjustified player killing (%d in 24h, %d in 7d, %d in 30d)", d, w, m)

					db.query(string.format(
						"INSERT INTO `account_bans` (`account_id`, `reason`, `banned_at`, `expires_at`, `banned_by`) VALUES (%d, %s, %d, %d, 0) ON DUPLICATE KEY UPDATE `expires_at` = %d, `reason` = %s",
						killerAccId, db.escapeString(reason), os.time(), banExpires, banExpires, db.escapeString(reason)
					))

					-- Transmissao global do banimento para todo o servidor ver
					local broadcastMsg = string.format("Punicao Automatica: O jogador %s foi banido por %d dias. Motivo: Excesso de mortes injustificadas (%d em 24h, %d em 7d, %d em 30d).", killer:getName(), banDays, d, w, m)
					Game.broadcastMessage(broadcastMsg, MESSAGE_STATUS_CONSOLE_ORANGE)
					Game.broadcastMessage(broadcastMsg, MESSAGE_STATUS_WARNING)

					addEvent(function()
						Game.broadcastMessage(broadcastMsg, MESSAGE_STATUS_WARNING)
					end, 3500)

					addEvent(function()
						Game.broadcastMessage(broadcastMsg, MESSAGE_STATUS_WARNING)
					end, 7000)

					killer:sendTextMessage(MESSAGE_STATUS_WARNING, "Sua conta foi banida por " .. banDays .. " dias por excesso de mortes injustificadas.")
					killer:remove()
				end
			end
		end

		local targetGuild = player:getGuild()
		targetGuild = targetGuild and targetGuild:getId() or 0
		if targetGuild ~= 0 then
			local killerGuild = killer:getGuild()
			killerGuild = killerGuild and killerGuild:getId() or 0
			if killerGuild ~= 0 and targetGuild ~= killerGuild and isInWar(playerId, killer:getId()) then
				local warId = false
				resultId = db.storeQuery("SELECT `id` FROM `guild_wars` WHERE `status` = 1 AND ((`guild1` = " .. killerGuild .. " AND `guild2` = " .. targetGuild .. ") OR (`guild1` = " .. targetGuild .. " AND `guild2` = " .. killerGuild .. "))")
				if resultId ~= false then
					warId = result.getDataInt(resultId, "id")
					result.free(resultId)
				end

				if warId ~= false then
					db.asyncQuery("INSERT INTO `guildwar_kills` (`killer`, `target`, `killerguild`, `targetguild`, `time`, `warid`) VALUES (" .. db.escapeString(killerName) .. ", " .. db.escapeString(player:getName()) .. ", " .. killerGuild .. ", " .. targetGuild .. ", " .. os.time() .. ", " .. warId .. ")")
				end
			end
		end
	end
end
