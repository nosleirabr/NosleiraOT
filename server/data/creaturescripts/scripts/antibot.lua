local loginRecords = {}

function onLogin(player)
	local ip = player:getIp()
	if ip == 0 then
		return true
	end

	-- Only limit normal players, not GMs
	if player:getGroup():getAccess() then
		return true
	end

	local currentTime = os.time()
	if not loginRecords[ip] then
		loginRecords[ip] = {count = 1, time = currentTime}
	else
		-- Se passaram menos de 5 segundos desde o ultimo tracking
		if currentTime - loginRecords[ip].time < 5 then
			loginRecords[ip].count = loginRecords[ip].count + 1
			if loginRecords[ip].count > 4 then
				-- Magebomb protection / Connection limit
				-- Block if more than 4 logins from same IP in 5 seconds
				player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Too many login attempts from your IP. Please wait.")
				return false
			end
		else
			-- Reset tracker after 5 seconds window
			loginRecords[ip].count = 1
			loginRecords[ip].time = currentTime
		end
	end
	
	return true
end
