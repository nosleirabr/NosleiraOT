local config = {
    warningIntervals = {15, 10, 5, 3, 1},
    finalMessage = "O servidor está sendo reiniciado agora. Até logo!",
    broadcastPrefix = "[REINÍCIO PROGRAMADO] "
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
                broadcast(string.format("O servidor será reiniciado em %d minuto!%s", minutes, reasonText))
            else
                broadcast(string.format("O servidor será reiniciado em %d minutos!%s", minutes, reasonText))
            end
            break
        end
    end

    addEvent(countdown, 30000)
end

local function startRestart(minutes, msg)
    if restartTask then
        return false, "Já existe um reinício agendado. Use /cancelrestart para cancelar."
    end

    if minutes < 1 then
        return false, "Tempo mínimo: 1 minuto."
    end

    shutdownTime = os.time() + (minutes * 60)
    reason = msg or "Manutenção programada"
    restartTask = addEvent(countdown, 1000)

    local reasonText = reason ~= "" and (" Motivo: " .. reason) or ""
    broadcastOrange(string.format("Atenção! O servidor será reiniciado em %d minutos.%s", minutes, reasonText))
    return true, string.format("Reinício agendado para daqui a %d minutos.", minutes)
end

local function cancelRestart()
    if not restartTask then
        return false, "Nenhum reinício agendado."
    end
    stopEvent(restartTask)
    restartTask = nil
    shutdownTime = 0
    reason = ""
    broadcastOrange("Reinício programado CANCELADO pelo staff.")
    return true, "Reinício cancelado."
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
        player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, "Exemplo: " .. words .. " 15 Atualização de mapa")
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
        msg = "EMERGÊNCIA: Reinício urgente solicitado pela staff."
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
    -- Detecta qual comando foi chamado pelo parâmetro 'words'
    if words == "/restart" then
        return handleRestart(player, words, param)
    elseif words == "/shutdown" then
        return handleShutdown(player, words, param)
    elseif words == "/cancelrestart" then
        return handleCancel(player, words, param)
    end
    return false
end