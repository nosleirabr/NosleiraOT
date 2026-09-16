local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to Crunor\'s Finest Warehouse, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'You mean my specials, don\'t you?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Here you may buy some of the most beautiful flowers.'})
keywordHandler:addKeyword({'rose'}, StdModule.say, {npcHandler = npcHandler, text = 'That\'s me. I am not for sale. <giggles>'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I have no watch on me.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Rose, nice to meet you, |PLAYERNAME|.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I am selling beautiful flowers here.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'flower'}, 2983, 6, 'flower')
shopModule:addBuyableItem({'god'}, 2981, 5, 'god')
shopModule:addBuyableItem({'honey'}, 2984, 5, 'honey')
shopModule:addBuyableItem({'indoor'}, 2811, 8, 'indoor')
shopModule:addBuyableItem({'christmas'}, 2812, 50, 'christmas')
shopModule:addBuyableItem({'potted'}, 2985, 5, 'potted')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

