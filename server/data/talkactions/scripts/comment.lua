function onSay(player, words, param)
	local text = string.trim(param)

	if text == "" then
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Uso do comando: !comment <sua mensagem>")
		player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Exemplo: !comment Jogando no NosleiraOT desde 2026!")
		return false
	end

	if string.len(text) > 500 then
		player:sendCancelMessage("O comentario pode ter no maximo 500 caracteres.")
		return false
	end

	local playerGuid = player:getGuid()
	db.query("UPDATE `players` SET `comment` = " .. db.escapeString(text) .. " WHERE `id` = " .. playerGuid)

	player:sendTextMessage(MESSAGE_INFO_DESCR, "Seu comentario do personagem foi atualizado com sucesso!")
	return false
end
