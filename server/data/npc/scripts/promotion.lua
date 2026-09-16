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

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "I greet thee, my loyal subject |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Farewell.")
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
