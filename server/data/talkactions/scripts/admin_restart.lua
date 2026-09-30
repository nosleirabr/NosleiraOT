local config = {
    warningIntervals = {15, 10, 5, 3, 1},
    finalMessage = "O servidor está sendo reiniciado agora. Até logo!",
    broadcastPrefix = "[REINÍCIO PROGRAMADO] "
}

local restartTask = nil
local shutdownTime = 0
local reason = ""

local function broadcast(msg)
    Game.broadcastMessage(config.broadcastPrefix .. msg, MESSAGE_EVENT_ADVANCE)
end

local function countdown()
    local now = os.time()
    local remaining = shutdownTime - now
    if remaining <= 0 then
        Game.saveGameState()
        broadcast(config.finalMessage)
        Game.setGameState(GAME_STATE_CLOSED)
        addEvent(function() os.exit(0) end, 5000)
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
    broadcast(string.format("Atenção! O servidor será reiniciado em %d minutos.%s", minutes, reasonText))
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
    broadcast("Reinício programado CANCELADO pelo staff.")
    return true, "Reinício cancelado."
end

function onSay(player, words, param)
    if player:getGroup():getAccess() < 4 then return false end

    local parts = param:split(" ")
    local minutes = tonumber(parts[1])
    if not minutes then
        player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "Uso: /restart <minutos> [motivo]")
        return false
    end

    local msg = table.concat(parts, " ", 2)
    if msg == "" then msg = nil end

    local ok, res = startRestart(minutes, msg)
    player:sendTextMessage(MESSAGE_EVENT_ADVANCE, res)
    return false
end

function onSayShutdown(player, words, param)
    if player:getGroup():getAccess() < 4 then return false end

    local parts = param:split(" ")
    local minutes = tonumber(parts[1]) or 1
    local msg = table.concat(parts, " ", 2)
    if msg == "" then msg = "EMERGÊNCIA: Reinício urgente solicitado pela staff." end

    local ok, res = startRestart(minutes, msg)
    player:sendTextMessage(MESSAGE_EVENT_ADVANCE, res)
    return false
end

function onSayCancel(player, words, param)
    if player:getGroup():getAccess() < 4 then return false end

    local ok, res = cancelRestart()
    player:sendTextMessage(MESSAGE_EVENT_ADVANCE, res)
    return false
end