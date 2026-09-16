local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello |PLAYERNAME|! Do you need my services?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. Visit me whenever you want to sell something.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye. Visit me whenever you want to sell something.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am buying some weapons and armors.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Hardek, the forestaller.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I buy stuff. If you want to sell something, offer it to me, and we\'ll see if it catches my interest.'})
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = 'You are welcome.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'chain'}, 2464, 200, 1, 'chain armor')
shopModule:addBuyableItem({'brass'}, 2465, 450, 1, 'brass armor')
shopModule:addBuyableItem({'chain'}, 2458, 52, 1, 'chain helmet')
shopModule:addBuyableItem({'leather'}, 2467, 12, 1, 'leather armor')
shopModule:addBuyableItem({'leather'}, 2461, 12, 1, 'leather helmet')
shopModule:addBuyableItem({'sword'}, 2376, 85, 1, 'sword')
shopModule:addBuyableItem({'mace'}, 2398, 90, 1, 'mace')
shopModule:addBuyableItem({'axe'}, 2386, 20, 1, 'axe')
shopModule:addBuyableItem({'dagger'}, 2379, 5, 1, 'dagger')
shopModule:addBuyableItem({'spear'}, 2389, 10, 1, 'spear')
shopModule:addBuyableItem({'wooden'}, 2512, 15, 1, 'wooden shield')
shopModule:addSellableItem({'chain'}, 2464, 70, 'chain armor')
shopModule:addSellableItem({'brass'}, 2465, 150, 'brass armor')
shopModule:addSellableItem({'chain'}, 2458, 17, 'chain helmet')
shopModule:addSellableItem({'leather'}, 2467, 4, 'leather armor')
shopModule:addSellableItem({'leather'}, 2461, 4, 'leather helmet')
shopModule:addSellableItem({'sword'}, 2376, 25, 'sword')
shopModule:addSellableItem({'mace'}, 2398, 30, 'mace')
shopModule:addSellableItem({'axe'}, 2386, 7, 'axe')
shopModule:addSellableItem({'dagger'}, 2379, 2, 'dagger')
shopModule:addSellableItem({'spear'}, 2389, 3, 'spear')
shopModule:addSellableItem({'wooden'}, 2512, 5, 'wooden shield')
shopModule:addSellableItem({'crossbow'}, 2455, 160, 'crossbow')
shopModule:addSellableItem({'bow'}, 2456, 130, 'bow')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)






