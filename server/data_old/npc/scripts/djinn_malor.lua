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
    local faction = player:getStorageValue(40000)
    local mission = player:getStorageValue(40002)

    if msgcontains(msg, "mission") then
        if faction == 1 then
            npcHandler:say("You are an ally of the Marid! I should kill you right here!", cid)
            return false
        end

        if faction == -1 or faction == 0 then
            npcHandler:say("Do you wish to pledge allegiance to the mighty Efreet?", cid)
            npcHandler:setTopic(cid, 1)
        elseif mission == 1 then
            npcHandler:say("You are one of us now. Your first mission is to kill a dwarf.", cid)
            player:setStorageValue(40002, 2)
        elseif mission == 3 then
            npcHandler:say("You have proven your worth. You may now trade with Alesar and Yaman.", cid)
        end
    elseif state == 1 and msgcontains(msg, "yes") then
        npcHandler:say("So be it! You are now an ally of the Efreet. The Marid will hunt you.", cid)
        player:setStorageValue(40000, 2) -- Set to Efreet Faction
        player:setStorageValue(40002, 1) -- Start missions
        npcHandler:setTopic(cid, 0)
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "What do you want, human |PLAYERNAME|?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Finally.")
npcHandler:addModule(FocusModule:new())
