local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m helping my grandfather Obi with this shop. Do you want to buy or sell anything?'})
keywordHandler:addKeyword({'equipment'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell torches, bags, scrolls, shovels, picks, backpacks, sickles, scythes, ropes, fishing rods and sixpacks of worms. Just tell me what you want to buy.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell spears, rapiers, sabres, daggers, hand axes, axes, and short swords. Just tell me what you want to buy.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'We\'re selling many things. Please have a look at the blackboards downstairs to see a list of our inventory.'})
keywordHandler:addKeyword({'helmet'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell leather helmets, studded helmets, and chain helmets. Just tell me what you want to buy.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m Dixi.'})
keywordHandler:addKeyword({'stuff'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell equipment of all kinds. Please let me know if you need something.'})
keywordHandler:addKeyword({'shield'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell wooden shields and studded shields. Just tell me what you want to buy.'})
keywordHandler:addKeyword({'pick'}, StdModule.say, {npcHandler = npcHandler, text = 'I am sorry, an agent of Al Dee bought all our picks. Now he has a monopoly on them.'})
keywordHandler:addKeyword({'worm'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell worms only in sixpacks for 5 gold each, how many sixpacks of worms do you want to buy?'})
keywordHandler:addKeyword({'wares'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell weapons, shields, armor, helmets, and equipment. For what do you want to ask?'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'If you need something, please let me know.'})
keywordHandler:addKeyword({'armor'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell jackets, coats, doublets, leather armor, and leather legs. Just tell me what you want to buy.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'club'}, 2382, 1, 1, 'club')
shopModule:addBuyableItem({'sword'}, 2376, 85, 1, 'sword')
shopModule:addBuyableItem({'dagger'}, 2379, 5, 1, 'dagger')
shopModule:addBuyableItem({'spear'}, 2389, 10, 1, 'spear')
shopModule:addBuyableItem({'mace'}, 2398, 90, 1, 'mace')
shopModule:addBuyableItem({'leather'}, 2467, 12, 1, 'leather armor')
shopModule:addBuyableItem({'chain'}, 2464, 200, 1, 'chain armor')
shopModule:addBuyableItem({'wooden'}, 2512, 15, 1, 'wooden shield')
shopModule:addBuyableItem({'leather'}, 2461, 12, 1, 'leather helmet')
shopModule:addBuyableItem({'chain'}, 2458, 52, 1, 'chain helmet')
shopModule:addSellableItem({'sword'}, 2376, 25, 'sword')
shopModule:addSellableItem({'dagger'}, 2379, 2, 'dagger')
shopModule:addSellableItem({'spear'}, 2389, 3, 'spear')
shopModule:addSellableItem({'mace'}, 2398, 30, 'mace')
shopModule:addSellableItem({'wooden'}, 2512, 5, 'wooden shield')
shopModule:addSellableItem({'leather'}, 2467, 4, 'leather armor')
shopModule:addSellableItem({'chain'}, 2464, 70, 'chain armor')
shopModule:addSellableItem({'leather'}, 2461, 4, 'leather helmet')
shopModule:addSellableItem({'chain'}, 2458, 17, 'chain helmet')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)






