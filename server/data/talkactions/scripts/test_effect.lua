function onSay(player, words, param)
	if not player:getGroup():getAccess() then
		return true
	end

	local effectId = tonumber(param)
	if not effectId then
		player:sendTextMessage(MESSAGE_INFO_DESCR, "Uso: /testeffect <id>")
		return false
	end

	local position = player:getPosition()
	position:sendMagicEffect(effectId)
	player:sendTextMessage(MESSAGE_INFO_DESCR, "Effect testado: " .. effectId)
	return false
end