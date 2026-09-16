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
    
    if msgcontains(msg, "brooch") then
        if player:getStorageValue(40006) < 1 then
            npcHandler:say("Are you saying you found my family brooch?", cid)
            npcHandler:setTopic(cid, 1)
        else
            npcHandler:say("You already gave me the brooch. I can offer you a passage.", cid)
        end
    elseif msgcontains(msg, "yes") and state == 1 then
        if player:removeItem(2127, 1) then -- Family brooch
            npcHandler:say("Thank you so much! As a reward, I can transport you to the Isle of Kings for a small fee.", cid)
            player:setStorageValue(40006, 1)
        else
            npcHandler:say("You don't have it.", cid)
        end
        npcHandler:setTopic(cid, 0)
    elseif msgcontains(msg, "passage") then
        if player:getStorageValue(40006) == 1 then
            npcHandler:say("Do you want to travel to the Isle of Kings for 10 gold?", cid)
            npcHandler:setTopic(cid, 2)
        else
            npcHandler:say("I only provide passage to my friends.", cid)
        end
    elseif msgcontains(msg, "yes") and state == 2 then
        if player:removeMoney(10) then
            player:teleportTo(Position(32190, 31957, 7))
            player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
            npcHandler:say("Set the sails!", cid)
        else
            npcHandler:say("You don't have enough money.", cid)
        end
        npcHandler:setTopic(cid, 0)
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Greetings.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
