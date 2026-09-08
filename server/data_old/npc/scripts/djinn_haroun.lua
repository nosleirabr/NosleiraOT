local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onThink() npcHandler:onThink() end

function onCreatureSay(cid, type, msg)
    local player = Player(cid)
    -- Regra de Exclusividade: Haroun (Blue Djinn) odeia aliados dos Efreet (Faction = 2)
    if player:getStorageValue(40000) == 2 then
        npcHandler:say("You shall not pass, servant of Malor! BE GONE!", cid)
        return false
    end
    npcHandler:onCreatureSay(cid, type, msg)
end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)

    if msgcontains(msg, "trade") or msgcontains(msg, "weapons") then
        -- Verifica se o jogador completou as missões dos Blue Djinns
        if player:getStorageValue(40000) == 1 and player:getStorageValue(40001) >= 3 then
            npcHandler:say("Here is my offer.", cid)
            -- Aqui futuramente abriremos o shopModule com os itens
        else
            npcHandler:say("I only trade with true friends of the Marid. You must help Gabel first.", cid)
        end
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Aaaah... greetings, human |PLAYERNAME|. What brings you to Ashta'daramai?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
npcHandler:addModule(FocusModule:new())
