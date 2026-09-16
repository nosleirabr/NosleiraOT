local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end
function onThink() npcHandler:onThink() end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)

    if msgcontains(msg, "cookies") then
        if player:getStorageValue(12461) < 1 then
            npcHandler:say("You bring me cookies?! I love cookies! Did you bring me cookies?", cid)
            npcHandler.topic[cid] = 1
        else
            npcHandler:say("You already brought me cookies! I am happy now.", cid)
        end
    elseif msgcontains(msg, "yes") and npcHandler.topic[cid] == 1 then
        if player:removeItem(2687, 10) then -- 10 cookies
            npcHandler:say("Hmm, delicious! Thank you, mortal! You are now a friend of the dwarfs.", cid)
            player:setStorageValue(12461, 1) -- Cookies given
        else
            npcHandler:say("You don't have 10 cookies! Don't mock the emperor!", cid)
        end
        npcHandler.topic[cid] = 0
    elseif msgcontains(msg, "promotion") then
        npcHandler:say("I can promote you for 20000 gold coins. Do you want it?", cid)
        npcHandler.topic[cid] = 2
    elseif msgcontains(msg, "yes") and npcHandler.topic[cid] == 2 then
        if not player:isPremium() then
            npcHandler:say("You need a premium account in order to get promoted.", cid)
        elseif player:getVocation():getId() > 4 then
            npcHandler:say("You are already promoted.", cid)
        elseif player:getLevel() < 20 then
            npcHandler:say("You need to be at least level 20 in order to get promoted.", cid)
        elseif player:removeMoney(20000) then
            player:setVocation(player:getVocation():getId() + 4)
            npcHandler:say("Congratulations! You are now promoted.", cid)
        else
            npcHandler:say("You do not have enough money.", cid)
        end
        npcHandler.topic[cid] = 0
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
