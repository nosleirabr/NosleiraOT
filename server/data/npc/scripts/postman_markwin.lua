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
        if mission == 8 then
            npcHandler:say("A letter from my human slave Kevin? Hand it over! ... Hmpf, interesting. You may go now.", cid)
            player:setStorageValue(40003, 9) -- Avança a quest
            player:removeItem(2333, 1) -- Remove a carta
        else
            npcHandler:say("I have no use for your letters.", cid)
        end
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "What do you want, human |PLAYERNAME|?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Get out of my sight.")
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
