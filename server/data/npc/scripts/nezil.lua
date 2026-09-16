local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Uhm, me or my sis\', |PLAYERNAME|?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'equipment'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell shovels, picks, scythes, bags, ropes, backpacks, cups, scrolls, documents, parchments, and watches. We also sell lightsources.'})
keywordHandler:addKeyword({'bezil'}, StdModule.say, {npcHandler = npcHandler, text = 'She\'s my sis\'.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell equipment of all kinds. Is there anything you need?'})
keywordHandler:addKeyword({'worm'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell worms only in sixpacks for 5 gold each, how many sixpacks of worms do you want to buy?'})
keywordHandler:addKeyword({'goods'}, StdModule.say, {npcHandler = npcHandler, text = 'Let me see ... we have shovels, picks, scythes, bags, ropes, backpacks, scrolls, documents, parchments, watches, fishing rods, sixpacks of worms and some lightsources.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'I think it\'s about the current time. If you\'d bought a watch you\'d know for sure.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Nezil Whetstone, son of Fire, of the Savage Axes. I and my sis\' Bezil are selling stuff, ye\' know?'})
keywordHandler:addKeyword({'deposit'}, StdModule.say, {npcHandler = npcHandler, text = 'I will give you 5 gold for every empty vial. Ok?'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, visit the Jolly Axeman Tavern for that.'})
keywordHandler:addKeyword({'light'}, StdModule.say, {npcHandler = npcHandler, text = 'We sell torches, candlesticks, candelabra, and oil.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'rope'}, 2120, 50, 1, 'rope')
shopModule:addBuyableItem({'shovel'}, 2554, 50, 1, 'shovel')
shopModule:addBuyableItem({'backpack'}, 1988, 20, 1, 'backpack')
shopModule:addBuyableItem({'bag'}, 1987, 4, 1, 'bag')
shopModule:addBuyableItem({'torch'}, 2054, 2, 1, 'torch')
shopModule:addBuyableItem({'pick'}, 2553, 50, 1, 'pick')
shopModule:addBuyableItem({'parcel'}, 2595, 15, 1, 'parcel')
shopModule:addBuyableItem({'letter'}, 2597, 8, 1, 'letter')
shopModule:addBuyableItem({'label'}, 2599, 1, 1, 'label')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)




