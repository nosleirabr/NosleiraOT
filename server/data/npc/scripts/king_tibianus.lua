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

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am King Tibianus 3rd, the glorious king of all Tibia!"})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am your sovereign, King Tibianus 3rd, and it's my duty to uphold justice and provide guidance for my subjects."})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "I am the king, indeed."})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = "Our beloved city has some fine shops and a glorious castle."})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = "They dare to reject my reign over the whole continent!"})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = "Ah, Venore is a wealthy city, indeed."})
keywordHandler:addKeyword({'taxes'}, StdModule.say, {npcHandler = npcHandler, text = "To finance our kingdom, I must collect some taxes."})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = "I will reward the one who brings it to me!"})
keywordHandler:addKeyword({'noodles'}, StdModule.say, {npcHandler = npcHandler, text = "He is the best dog in the world."})

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "I greet thee, my loyal subject |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Farewell.")
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
