local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to my little inn, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'I hope to see you again.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'I hope to see you again.')
keywordHandler:addKeyword({'senja'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a peaceful island. Cold and lonesome but I like it.'})
keywordHandler:addKeyword({'mage'}, StdModule.say, {npcHandler = npcHandler, text = 'It is said that there are some secrets to discover around the mage\'s castle.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the capital in the southwest of Tibia.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m the keeper of the inn. You can buy food here.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you looking for food? I have bread, cheese, ham, and meat.'})
keywordHandler:addKeyword({'queen'}, StdModule.say, {npcHandler = npcHandler, text = 'She is a strong and wise leader. We owe protection from evil monsters to her.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is exactly the current time.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Scott.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Sometimes I travel to Carlin and visit the market.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, I\'m happy to live in this world full of thrilling things.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'ham'}, 3582, 8, 'ham')
shopModule:addBuyableItem({'meat'}, 3577, 5, 'meat')
shopModule:addBuyableItem({'cheese'}, 3607, 6, 'cheese')
shopModule:addBuyableItem({'bread'}, 3600, 4, 'bread')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

