local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome, child of nature.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|!')
keywordHandler:addKeyword({'spark'}, StdModule.say, {npcHandler = npcHandler, text = 'The spark of the phoenix will be given to you by the dwarfen priests of earth and fire in Kazordoon.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now, it is the current time. Ask Gorn for a watch, if you need one.'})
keywordHandler:addKeyword({'fire'}, StdModule.say, {npcHandler = npcHandler, text = 'You can ask for the blessing of the two suns in the suntower near Ab\'Dendriel .'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a guardian of nature. Also I am the keeper of the embrace of tibia, one of the five blessings.'})
keywordHandler:addKeyword({'wisdom'}, StdModule.say, {npcHandler = npcHandler, text = 'Talk to the hermit Eremo on the isle of Cormaya about this blessing.'})
keywordHandler:addKeyword({'embrace'}, StdModule.say, {npcHandler = npcHandler, text = 'I will give to you the embrace of tibia, but you will have to make a sacrifice. Are you prepared to pay 10.000 gold for the blessing?.'})
keywordHandler:addKeyword({'pilgrimage'}, StdModule.say, {npcHandler = npcHandler, text = 'Whenever you recrive a lethal wound your lifeforce is damaged. With every single of the five blessings you have this damage will be reduced.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Humphrey.'})
keywordHandler:addKeyword({'spiritual'}, StdModule.say, {npcHandler = npcHandler, text = 'You can ask for the blessing of spiritual shielding the whiteflower temple south of Thais.'})
keywordHandler:addKeyword({'blessing'}, StdModule.say, {npcHandler = npcHandler, text = 'There are five different blessings available in five sacred places. They are: the spiritual shielding, the spark of the phoenix, the embrace of tibia, the fire of the suns and the wisdom of solitude.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)
    local cost = 10000
    if msgcontains(msg, 'embrace') then
        npcHandler:say('Do you wish to receive the embrace of tibia for 10000 gold?', cid)
        npcHandler.topic[cid] = 1
    elseif msgcontains(msg, 'yes') and npcHandler.topic[cid] == 1 then
        if player:hasBlessing(2) then
            npcHandler:say('You already possess this blessing.', cid)
        elseif player:removeMoney(cost) then
            player:addBlessing(2)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
            npcHandler:say('So receive the embrace of tibia, pilgrim.', cid)
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


