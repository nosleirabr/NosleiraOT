local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Be greeted, dear |PLAYERNAME|. Have a look at our offers.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Farewell.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Farewell.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am responsible for buying and selling gems, pearls, and the like.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Odemara Taleris, it\'s a pleasure to meet you.'})
keywordHandler:addKeyword({'pearl'}, StdModule.say, {npcHandler = npcHandler, text = 'We trade white and black pearls.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'We offer a great assortment of gems and pearls.'})
keywordHandler:addKeyword({'gem'}, StdModule.say, {npcHandler = npcHandler, text = 'We trade small diamonds, sapphires, rubies, emeralds, and amethysts.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'small'}, 3028, 600, 'small')
shopModule:addBuyableItem({'black'}, 3027, 560, 'black')
shopModule:addBuyableItem({'small'}, 3029, 500, 'small')
shopModule:addBuyableItem({'small'}, 3032, 500, 'small')
shopModule:addBuyableItem({'small'}, 3030, 500, 'small')
shopModule:addBuyableItem({'small'}, 3033, 400, 'small')
shopModule:addBuyableItem({'white'}, 3026, 320, 'white')
shopModule:addSellableItem({'sell'}, 3028, 300, 'sell')
shopModule:addSellableItem({'sell'}, 3027, 280, 'sell')
shopModule:addSellableItem({'sell'}, 3029, 250, 'sell')
shopModule:addSellableItem({'sell'}, 3032, 250, 'sell')
shopModule:addSellableItem({'sell'}, 3030, 250, 'sell')
shopModule:addSellableItem({'sell'}, 3033, 200, 'sell')
shopModule:addSellableItem({'sell'}, 3026, 160, 'sell')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

