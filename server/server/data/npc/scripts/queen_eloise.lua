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
    local state = npcHandler:getTopic(cid)

    if msgcontains(msg, "promotion") or msgcontains(msg, "promote") then
        if not player:isPremium() then
            npcHandler:say("You need a premium account in order to get promoted.", cid)
        elseif player:isPromoted() then
            npcHandler:say("You are already promoted.", cid)
        elseif player:getLevel() < 20 then
            npcHandler:say("You need to be at least level 20 in order to be promoted.", cid)
        else
            npcHandler:say("Do you want to be promoted in your vocation for 20000 gold?", cid)
            npcHandler:setTopic(cid, 1)
        end
    elseif state == 1 then
        if msgcontains(msg, "yes") then
            if player:removeMoney(20000) then
                player:setVocation(Vocation(player:getVocation():getId() + 4))
                npcHandler:say("Congratulations! You are now promoted.", cid)
                player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
            else
                npcHandler:say("You do not have enough money.", cid)
            end
        else
            npcHandler:say("Ok, whatever.", cid)
        end
        npcHandler:setTopic(cid, 0)
    end
    return true
end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Queen Eloise. It is my duty to rule this city."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am the Queen of Carlin."})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = "Carlin is the most beautiful city in the world."})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = "Thais is a city of barbarians! The king there is a fool."})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "King Tibianus is a fool. He knows nothing about how to rule."})
keywordHandler:addKeyword({'tibianus'}, StdModule.say, {npcHandler = npcHandler, text = "King Tibianus is a fool. He knows nothing about how to rule."})

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "I greet thee, my loyal subject |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Farewell.")
npcHandler:addModule(FocusModule:new())
