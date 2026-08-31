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
        if mission == 2 then
            npcHandler:say("A letter from Kevin? Oh, this is the bill for the dog training! Thank you.", cid)
            player:setStorageValue(40003, 3)
            player:removeItem(2327, 1) -- Remove the bill
        else
            npcHandler:say("I have no letters for you.", cid)
        end
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Greetings |PLAYERNAME|! Welcome to my post office.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
npcHandler:addModule(FocusModule:new())
