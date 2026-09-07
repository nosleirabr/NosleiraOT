local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onThink() npcHandler:onThink() end

function onCreatureSay(cid, type, msg)
    local player = Player(cid)
    -- Regra de Exclusividade: Yaman (Green Djinn) odeia aliados dos Marid (Faction = 1)
    if player:getStorageValue(40000) == 1 then
        npcHandler:say("I smell the foul stench of a Marid ally! BE GONE!", cid)
        return false
    end
    npcHandler:onCreatureSay(cid, type, msg)
end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)

    if msgcontains(msg, "trade") then
        if player:getStorageValue(40000) == 2 and player:getStorageValue(40002) >= 3 then
            npcHandler:say("Look at my magnificent weapons.", cid)
            -- Lógica para abrir janela de trade (Yaman compra Giant Sword, Knight Axe, etc)
        else
            npcHandler:say("You must prove your worth to Malor before I trade with you.", cid)
        end
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "What do you want from me, |PLAYERNAME|?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Finally.")
npcHandler:addModule(FocusModule:new())
