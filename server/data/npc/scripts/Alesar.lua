local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end
function onThink() npcHandler:onThink() end

keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell and buy weapons for those who are worthy.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addSellableItem({'broadsword'}, 2413, 500, 'broadsword')
shopModule:addSellableItem({'clerical mace'}, 2423, 170, 'clerical mace')
shopModule:addSellableItem({'dragon hammer'}, 2434, 2000, 'dragon hammer')
shopModule:addSellableItem({'fire axe'}, 2432, 8000, 'fire axe')
shopModule:addSellableItem({'fire sword'}, 2392, 4000, 'fire sword')
shopModule:addSellableItem({'giant sword', 'gs'}, 2393, 17000, 'giant sword')
shopModule:addSellableItem({'ice rapier'}, 2396, 1000, 'ice rapier')
shopModule:addSellableItem({'knight axe'}, 2430, 2000, 'knight axe')
shopModule:addSellableItem({'poison dagger'}, 2411, 50, 'poison dagger')
shopModule:addSellableItem({'skull staff'}, 2436, 6000, 'skull staff')
shopModule:addSellableItem({'war hammer'}, 2391, 1200, 'war hammer')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
focusModule:addGreetMessage('djannihah')
npcHandler:addModule(focusModule)
