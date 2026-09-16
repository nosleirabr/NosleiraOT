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
    local topic = npcHandler.topic[cid] or 0

    if msgcontains(msg, "key") or msgcontains(msg, "chave") or msgcontains(msg, "fibula") then
        npcHandler:say("Do you want to buy the key to the Fibula dungeon for 800 gold coins?", cid)
        npcHandler.topic[cid] = 1
        npcHandler:setTopic(cid, 1)
    elseif topic == 1 and (msgcontains(msg, "yes") or msgcontains(msg, "sim") or msgcontains(msg, "buy")) then
        if player:removeMoney(800) then
            local key = player:addItem(2088, 1) -- Silver key (2088)
            if key then
                key:setAttribute(ITEM_ATTRIBUTE_ACTIONID, 3940)
                key:setAttribute(ITEM_ATTRIBUTE_DESCRIPTION, "This key bears the number 3940.")
            end
            npcHandler:say("Here is your key. Be careful down there!", cid)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
        else
            npcHandler:say("You do not have enough money. It costs 800 gold coins.", cid)
        end
        npcHandler.topic[cid] = 0
        npcHandler:setTopic(cid, 0)
    elseif topic == 1 and (msgcontains(msg, "no") or msgcontains(msg, "nao")) then
        npcHandler:say("Maybe next time then.", cid)
        npcHandler.topic[cid] = 0
        npcHandler:setTopic(cid, 0)
    elseif msgcontains(msg, "help") or msgcontains(msg, "beggar") then
        npcHandler:say("I am just a poor beggar. But I found a {key} to the dungeon beneath Fibula...", cid)
    end

    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
