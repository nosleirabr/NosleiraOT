local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. You are welcome.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye. You are welcome.')
keywordHandler:addKeyword({'ship'}, StdModule.say, {npcHandler = npcHandler, text = 'Our ferries are strong enough to stand the high waves of the Nordic Ocean.'})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = 'Where do you want to go today? We serve the routes to Senja, Folda, and Vega, and back to Tibia.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'We are ferrymen. We transport goods and passengers to the Ice Islands.'})
keywordHandler:addKeyword({'island'}, StdModule.say, {npcHandler = npcHandler, text = 'We serve the routes to Senja, Folda, and Vega, and back to Tibia.'})
keywordHandler:addKeyword({'good'}, StdModule.say, {npcHandler = npcHandler, text = 'We can transport everything you want.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Anderson from the Nordic Tibia Ferries.'})
keywordHandler:addKeyword({'passenger'}, StdModule.say, {npcHandler = npcHandler, text = 'We would like to welcome you on board our ferries.'})
keywordHandler:addKeyword({'senja'}, StdModule.say, {npcHandler = npcHandler, text = 'This island is Senja.'})
keywordHandler:addKeyword({'anderson'}, StdModule.say, {npcHandler = npcHandler, text = 'The four of us are the captains of the Nordic Tibia Ferries.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

