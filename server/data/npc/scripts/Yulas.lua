local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to the Plank and Treasurechest Market, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, we are not allowed to chat.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'We are into home improvement.'})
keywordHandler:addKeyword({'allen'}, StdModule.say, {npcHandler = npcHandler, text = 'To think just because he is around here to watch what we do, he want to be considered one of us...'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Yulas. I will be your salesperson today.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell furniture and equipment. At this counter you can buy tables.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'square'}, 2784, 25, 'square')
shopModule:addBuyableItem({'small'}, 2782, 20, 'small')
shopModule:addBuyableItem({'big'}, 2785, 30, 'big')
shopModule:addBuyableItem({'round'}, 2783, 25, 'round')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

