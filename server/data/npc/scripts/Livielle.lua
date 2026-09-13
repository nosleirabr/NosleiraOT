local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bon appétit, and come back soon for your daily dose of vitamins!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bon appétit, and come back soon for your daily dose of vitamins!')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Alors, guess what my job might be, standing \'ere in the middle of all these juicy exotic fruits?'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time is the current time now.'})
keywordHandler:addKeyword({'fruits'}, StdModule.say, {npcHandler = npcHandler, text = 'I offer you bananas, melons, pumpkins, white mushrooms, oranges, strawberries, and blueberries.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, for sure will my fruits \'elp you driving off all these nasty diseases and strengthen your immune system!'})
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = 'You\'re welcome, enjoy.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'What\'s your favorite flavour today? I offer all sorts of exotic fruits.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'banana'}, 3587, 5, 'banana')
shopModule:addBuyableItem({'melon'}, 3593, 10, 'melon')
shopModule:addBuyableItem({'strawberr'}, 3591, 2, 'strawberr')
shopModule:addBuyableItem({'blueberr'}, 3588, 1, 'blueberr')
shopModule:addBuyableItem({'pumpkin'}, 3594, 10, 'pumpkin')
shopModule:addBuyableItem({'white'}, 3723, 10, 'white')
shopModule:addBuyableItem({'orange'}, 3586, 10, 'orange')

npcHandler:addModule(FocusModule:new())


