local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. You are welcome.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye. You are welcome.')
keywordHandler:addKeyword({'ship'}, StdModule.say, {npcHandler = npcHandler, text = 'My boat is ready to bring you to Edron.'})
keywordHandler:addKeyword({'beach'}, StdModule.say, {npcHandler = npcHandler, text = 'There is a nice sandy beach in the west of Cormaya.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'I love to sail on the seas of Tibia.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m a fisherman and I take along people to Edron. You can also buy some fresh fish.'})
keywordHandler:addKeyword({'eremo'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, you know the good old sage Eremo. I can bring you to his little island. Do you want me to do that?'})
keywordHandler:addKeyword({'cormaya'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a lovely and peaceful isle. Did you already visit the nice sandy beach?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Pemaret, the fisherman.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'fish'}, 3578, 5, 'fish')


addTravelKeyword(keywordHandler, npcHandler, 'edron', 20, TravelHarbours.edron, 'Edron')
addTravelKeyword(keywordHandler, npcHandler, 'eremo', 0, TravelHarbours.eremo, 'Eremo\'s Island')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


