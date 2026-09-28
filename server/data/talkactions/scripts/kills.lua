--[[
	Talkaction: !kills / !frags / !killers
	Exibe a contagem de frags injustificados e o tempo exato para expirar PK (White Skull), Red Skull e Black Skull.
]]

local function formatRemainingTime(seconds)
	if seconds <= 0 then
		return "0 segundos"
	end

	local days = math.floor(seconds / 86400)
	local hours = math.floor((seconds % 86400) / 3600)
	local minutes = math.floor((seconds % 3600) / 60)
	local secs = seconds % 60

	local parts = {}
	if days > 0 then
		table.insert(parts, days .. (days == 1 and " dia" or " dias"))
	end
	if hours > 0 then
		table.insert(parts, hours .. (hours == 1 and " hora" or " horas"))
	end
	if minutes > 0 then
		table.insert(parts, minutes .. (minutes == 1 and " minuto" or " minutos"))
	end
	if #parts == 0 or (days == 0 and hours == 0 and secs > 0) then
		table.insert(parts, secs .. (secs == 1 and " segundo" or " segundos"))
	end

	return table.concat(parts, ", ")
end

function onSay(player, words, param)
	local skull = player:getSkull()
	local skullTicks = player:getSkullTime()
	local skullSeconds = math.max(0, math.floor(skullTicks / 1000))

	-- Tempo de redução por frag (padrão 24 horas em segundos)
	local fragDuration = 24 * 60 * 60
	local fragsCount = 0
	local nextFragSeconds = 0

	if skullSeconds > 0 then
		fragsCount = math.ceil(skullSeconds / fragDuration)
		local rem = skullSeconds % fragDuration
		nextFragSeconds = (rem == 0 and fragDuration or rem)
	end

	-- 1. Red Skull ativo
	if skull == SKULL_RED then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, string.format(
			"Voce possui Red Skull ativo. Seu Red Skull vai expirar em: %s.",
			formatRemainingTime(skullSeconds)
		))
		if fragsCount > 0 then
			player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, string.format(
				"Frags injustificados acumulados: %d. Proximo frag expira em: %s.",
				fragsCount, formatRemainingTime(nextFragSeconds)
			))
		end
		return false
	end

	-- 2. Black Skull ativo
	if skull == SKULL_BLACK then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, string.format(
			"Voce possui Black Skull ativo. Seu Black Skull vai expirar em: %s.",
			formatRemainingTime(skullSeconds)
		))
		if fragsCount > 0 then
			player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, string.format(
				"Frags injustificados acumulados: %d. Proximo frag expira em: %s.",
				fragsCount, formatRemainingTime(nextFragSeconds)
			))
		end
		return false
	end

	-- 3. White Skull (PK) ativo
	if skull == SKULL_WHITE then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Voce esta com White Skull (PK ativo).")
		if skullSeconds > 0 then
			player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, string.format(
				"Frags injustificados: %d. Seu proximo frag expira em: %s.",
				fragsCount, formatRemainingTime(nextFragSeconds)
			))
		else
			player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Voce nao possui frags injustificados acumulados.")
		end
		return false
	end

	-- 4. Sem Skull (SKULL_NONE)
	if skullSeconds > 0 then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, string.format(
			"Voce possui %d frag(s) injustificado(s). Seu proximo frag expira em: %s.",
			fragsCount, formatRemainingTime(nextFragSeconds)
		))
	else
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Voce possui 0 frags injustificados e nenhum skull ativo.")
	end

	return false
end
