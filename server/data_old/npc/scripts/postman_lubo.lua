local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onThink() npcHandler:onThink() end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)
    local state = npcHandler:getTopic(cid)
    local mission = player:getStorageValue(40003)

    if msgcontains(msg, "letter") then
        if mission == 1 then
            npcHandler:say("Oh, a letter from Kevin! This must be about the dogs. Thank you!", cid)
            player:setStorageValue(40003, 2)
            player:removeItem(2333, 1) -- Remove a carta genérica
        else
            npcHandler:say("A letter? I'm not expecting any letters.", cid)
        end
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Welcome to my shop, |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye.")
npcHandler:addModule(FocusModule:new())
