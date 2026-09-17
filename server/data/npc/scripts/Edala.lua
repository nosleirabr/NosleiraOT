local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)


local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)
    local cost = 10000
    if msgcontains(msg, 'suns') then
        npcHandler:say('Do you wish to receive the fire of the suns for 10000 gold?', cid)
        npcHandler.topic[cid] = 1
    elseif msgcontains(msg, 'yes') and npcHandler.topic[cid] == 1 then
        if player:hasBlessing(4) then
            npcHandler:say('You already possess this blessing.', cid)
        elseif player:removeMoney(cost) then
            player:addBlessing(4)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
            npcHandler:say('So receive the fire of the suns, pilgrim.', cid)
        else
            npcHandler:say('Oh. You do not have enough money.', cid)
        end
        npcHandler.topic[cid] = 0
    elseif msgcontains(msg, 'no') and npcHandler.topic[cid] == 1 then
        npcHandler:say('Ok. May the gods protect you.', cid)
        npcHandler.topic[cid] = 0
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


