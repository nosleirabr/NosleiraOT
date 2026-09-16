local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to my humble shop, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Please come and buy again.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Please come and buy again.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is exactly the current time.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the butcher. I am selling delicious meat.'})
keywordHandler:addKeyword({'ghostlands'}, StdModule.say, {npcHandler = npcHandler, text = 'A bloody place with a bloody history. I wonder if it realy drove people mad or if it just attracted those already disbalanced in their minds.'})
keywordHandler:addKeyword({'father'}, StdModule.say, {npcHandler = npcHandler, text = 'My father, Hannibal, was the royal cook. He died some years ago in an attack of the evil Ferumbras.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My father named me Lector.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you looking for food? I can offer you ham or meat.'})
keywordHandler:addKeyword({'graveyard'}, StdModule.say, {npcHandler = npcHandler, text = 'I heared, the mausoleum is haunted!'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you ham or meat. Dragon steaks are out. <giggle>'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'meat'}, 3577, 3, 'meat')
shopModule:addBuyableItem({'ham'}, 3582, 6, 'ham')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

