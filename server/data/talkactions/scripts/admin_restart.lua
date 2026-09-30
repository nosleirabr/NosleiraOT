local config = {
    warningIntervals = {15, 10, 5, 3, 1},
    finalMessage = "O servidor est\195\161 sendo reiniciado agora. At\195\169 logo!",
    broadcastPrefix = "[REIN\195\167CIO PROGRAMADO] "
}

local restartTask = nil
local shutdownTime = 0
local reason = ""

local function trim(s)
    return (s:gsub("^%s*(.-)%s*$", "%1"))
end

local function splitTrimmed(str, sep)
    local result = {}
    if not str then return result end
    for match in string.gmatch(str, "([^" .. (sep or ",") .. "]+)") do
        table.insert(result, trim(match))
    end
    return result
end

local function broadcast(msg)
    Game.broadcastMessage(config.broadcastPrefix .. msg, MESSAGE_STATUS_WARNING)
    addEvent(function()
        Game.broadcastMessage(config.broadcastPrefix .. msg, MESSAGE_STATUS_WARNING)
    end, 3500)
    addEvent(function()
        Game.broadcastMessage(config.broadcastPrefix .. msg, MESSAGE_STATUS_WARNING)
    end, 7000)
end

local function broadcastOrange(msg)
    Game.broadcastMessage(config.broadcastPrefix .. msg, MESSAGE_STATUS_CONSOLE_ORANGE)
    addEvent(function()
        Game.broadcastMessage(config.broadcastPrefix .. msg, MESSAGE_STATUS_CONSOLE_ORANGE)
    end, 3500)
    addEvent(function()
        Game.broadcastMessage(config.broadcastPrefix .. msg, MESSAGE_STATUS_CONSOLE_ORANGE)
    end, 7000)
end

local function countdown()
    local now = os.time()
    local remaining = shutdownTime - now
    if remaining <= 0 then
        Game.saveGameState()
        broadcast(config.finalMessage)
        Game.setGameState(GAME_STATE_SHUTDOWN)
        return
    end

    local minutes = math.ceil(remaining / 60)
    for _, interval in ipairs(config.warningIntervals) do
        if minutes == interval then
            local reasonText = reason ~= "" and (" Motivo: " .. reason) or ""
            if minutes == 1 then
                broadcast(string.format("O servidor ser\195\161 reiniciado em %d minuto!%s", minutes, reasonText))
            else
                broadcast(string.format("O servidor ser\195\161 reiniciado em %d minutos!%s", minutes, reasonText))
            end
            break
        end
    end

    addEvent(countdown, 30000)
end

local function startRestart(minutes, msg)
    if restartTask then
        return false, "J\195\161 existe um rein\195\173cio agendado. Use /cancelrestart para cancelar."
    end

    if minutes < 1 then
        return false, "Tempo m\195\173nimo: 1 minuto."
    end

    shutdownTime = os.time() + (minutes * 60)
    reason = msg or "Manuten\195\167\195\163o programada"
    restartTask = addEvent(countdown, 1000)

    local reasonText = reason ~= "" and (" Motivo: " .. reason) or ""
    broadcastOrange(string.format("Aten\195\167\195\163o! O servidor ser\195\161 reiniciado em %d minutos.%s", minutes, reasonText))
    return true, string.format("Rein\195\173cio agendado para daqui a %d minutos.", minutes)
end

local function cancelRestart()
    if not restartTask then
        return false, "Nenhum rein\195\173cio agendado."
    end
    stopEvent(restartTask)
    restartTask = nil
    shutdownTime = 0
    reason = ""
    broadcastOrange("Rein\195\173cio programado CANCELADO pelo staff.")
    return true, "Rein\195\173cio cancelado."
end

local function handleRestart(player, words, param)
    if player:getAccountType() < ACCOUNT_TYPE_GOD then
        player:sendCancelMessage("Apenas GODs podem usar este comando.")
        return false
    end

    local params = splitTrimmed(param, " ")
    local minutes = tonumber(params[1])
    if not minutes then
        player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Uso: " .. words .. " <minutos> [motivo]")
        player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Exemplo: " .. words .. " 15 Atualiza\195\167\195\163o de mapa")
        return false
    end

    local msg = ""
    if #params >= 2 then
        msg = table.concat(params, " ", 2)
    end
    if msg == "" then msg = nil end

    local ok, res = startRestart(minutes, msg)
    player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, res)
    return false
end

local function handleShutdown(player, words, param)
    if player:getAccountType() < ACCOUNT_TYPE_GOD then
        player:sendCancelMessage("Apenas GODs podem usar este comando.")
        return false
    end

    local params = splitTrimmed(param, " ")
    local minutes = tonumber(params[1]) or 1
    local msg = ""
    if #params >= 2 then
        msg = table.concat(params, " ", 2)
    end
    if msg == "" then
        msg = "EMERG\195\170NCIA: Rein\195\173cio urgente solicitado pela staff."
    end

    local ok, res = startRestart(minutes, msg)
    player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, res)
    return false
end

local function handleCancel(player, words, param)
    if player:getAccountType() < ACCOUNT_TYPE_GOD then
        player:sendCancelMessage("Apenas GODs podem usar este comando.")
        return false
    end

    local ok, res = cancelRestart()
    player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, res)
    return false
end

function onSay(player, words, param)
    if words == "/restart" then
        return handleRestart(player, words, param)
    elseif words == "/shutdown" then
        return handleShutdown(player, words, param)
    elseif words == "/cancelrestart" then
        return handleCancel(player, words, param)
    end
    return false
end