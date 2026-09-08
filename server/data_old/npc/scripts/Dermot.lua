local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello, traveller |PLAYERNAME|. How can I help you?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'See you again.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'See you again.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time is not important on Fibula.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the magistrate of this isle.'})
keywordHandler:addKeyword({'equipment'}, StdModule.say, {npcHandler = npcHandler, text = 'I am not selling equipment. You\'ll have to visit Timur.'})
keywordHandler:addKeyword({'dermot'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the magistrate of this isle.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Dermot, the magistrate of this isle.'})
keywordHandler:addKeyword({'entrance'}, StdModule.say, {npcHandler = npcHandler, text = 'The entrance is near here.'})
keywordHandler:addKeyword({'timur'}, StdModule.say, {npcHandler = npcHandler, text = 'He is the salesman in this village. '})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, my god. In the dungeon of Fibula are a lot of monsters. That\'s why we have sealed it with a solid door.'})
keywordHandler:addKeyword({'magistrate'}, StdModule.say, {npcHandler = npcHandler, text = 'Thats me.'})
keywordHandler:addKeyword({'farmer'}, StdModule.say, {npcHandler = npcHandler, text = 'The inhabitants of Fibula live on fishing, farming, and hunting.'})
keywordHandler:addKeyword({'fibula'}, StdModule.say, {npcHandler = npcHandler, text = 'You are at Fibula. This isle is not very dangerous. Just the wolves bother outside the village.'})
keywordHandler:addKeyword({'present'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t understand what you are talking about.'})
keywordHandler:addKeyword({'wolf'}, StdModule.say, {npcHandler = npcHandler, text = 'There are a lot of wolves outside the townwall. They disturb our farmers.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'key'}, 2968, 2000, 'key')

npcHandler:addModule(FocusModule:new())

