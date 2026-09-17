local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end
function onThink() npcHandler:onThink() end

keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell and buy armors, shields, and other equipment for those who are worthy.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addSellableItem({'royal helmet', 'rh'}, 2498, 30000, 'royal helmet')
shopModule:addSellableItem({'crusader helmet'}, 2497, 6000, 'crusader helmet')
shopModule:addSellableItem({'dragon scale mail', 'dsm'}, 2492, 40000, 'dragon scale mail')
shopModule:addSellableItem({'golden armor'}, 2466, 20000, 'golden armor')
shopModule:addSellableItem({'fire axe'}, 2432, 8000, 'fire axe')
shopModule:addSellableItem({'fire sword'}, 2392, 4000, 'fire sword')
shopModule:addSellableItem({'giant sword', 'gs'}, 2393, 17000, 'giant sword')
shopModule:addSellableItem({'ice rapier'}, 2396, 1000, 'ice rapier')
shopModule:addSellableItem({'skull staff'}, 2436, 6000, 'skull staff')
shopModule:addSellableItem({'war hammer'}, 2391, 1200, 'war hammer')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
focusModule:addGreetMessage('djannihah')
npcHandler:addModule(focusModule)
