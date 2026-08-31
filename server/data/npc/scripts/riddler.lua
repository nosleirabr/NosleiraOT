local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end
function onThink() npcHandler:onThink() end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then
        return false
    end

    local player = Player(cid)
    local state = npcHandler:getTopic(cid)

    if msgcontains(msg, "test") or msgcontains(msg, "paradox") then
        npcHandler:say("Would you like to take the test?", cid)
        npcHandler:setTopic(cid, 1)
    elseif state == 1 and msgcontains(msg, "yes") then
        npcHandler:say("What name did the necromant king of Drefia choose for himself?", cid)
        npcHandler:setTopic(cid, 2)
    elseif state == 2 then
        if msgcontains(msg, "goshnar") then
            npcHandler:say("Right! Who or what is the feared Hugo?", cid)
            npcHandler:setTopic(cid, 3)
        else
            npcHandler:say("Wrong! BE GONE!", cid)
            npcHandler:releaseFocus(cid)
            player:getPosition():sendMagicEffect(CONST_ME_POFF)
            player:teleportTo(Position(32476, 31899, 2))
            player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
        end
    elseif state == 3 then
        if msgcontains(msg, "demonbunny") then
            npcHandler:say("Right! Who was the first warrior to follow the path of the Mooh'Tah?", cid)
            npcHandler:setTopic(cid, 4)
        else
            npcHandler:say("Wrong! BE GONE!", cid)
            npcHandler:releaseFocus(cid)
            player:getPosition():sendMagicEffect(CONST_ME_POFF)
            player:teleportTo(Position(32476, 31899, 2))
            player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
        end
    elseif state == 4 then
        if msgcontains(msg, "tha'kull") or msgcontains(msg, "thakull") then
            npcHandler:say("Right! What is the opposite?", cid)
            npcHandler:setTopic(cid, 5)
        else
            npcHandler:say("Wrong! BE GONE!", cid)
            npcHandler:releaseFocus(cid)
            player:getPosition():sendMagicEffect(CONST_ME_POFF)
            player:teleportTo(Position(32476, 31899, 2))
            player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
        end
    elseif state == 5 then
        if msgcontains(msg, "none") then
            npcHandler:say("Right! What is 1 plus 1?", cid)
            npcHandler:setTopic(cid, 6)
        else
            npcHandler:say("Wrong! BE GONE!", cid)
            npcHandler:releaseFocus(cid)
            player:getPosition():sendMagicEffect(CONST_ME_POFF)
            player:teleportTo(Position(32476, 31899, 2))
            player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
        end
    elseif state == 6 then
        if msgcontains(msg, "1") or msgcontains(msg, "one") then
            npcHandler:say("You did it! You have answered all my questions! You may pass!", cid)
            npcHandler:setTopic(cid, 0)
            player:setStorageValue(30025, 1) -- Paradox Tower Reward Access
        else
            npcHandler:say("Wrong! BE GONE!", cid)
            npcHandler:releaseFocus(cid)
            player:getPosition():sendMagicEffect(CONST_ME_POFF)
            player:teleportTo(Position(32476, 31899, 2))
            player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
        end
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Greetings, seeker of knowledge!")
npcHandler:setMessage(MESSAGE_FAREWELL, "May enlightenment guide your path.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "May enlightenment guide your path.")
npcHandler:addModule(FocusModule:new())
