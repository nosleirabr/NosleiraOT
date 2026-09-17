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
shopModule:addSellableItem({'boots of haste', 'boh'}, 2195, 30000, 'boots of haste')
shopModule:addSellableItem({'dragon shield'}, 2516, 4000, 'dragon shield')
shopModule:addSellableItem({'knight armor'}, 2476, 5000, 'knight armor')
shopModule:addSellableItem({'knight legs'}, 2477, 5000, 'knight legs')
shopModule:addSellableItem({'warrior helmet'}, 2475, 5000, 'warrior helmet')
shopModule:addSellableItem({'crown armor'}, 2487, 12000, 'crown armor')
shopModule:addSellableItem({'crown helmet'}, 2491, 2500, 'crown helmet')
shopModule:addSellableItem({'crown legs'}, 2488, 12000, 'crown legs')
shopModule:addSellableItem({'crown shield'}, 2519, 8000, 'crown shield')
shopModule:addSellableItem({'tower shield'}, 2528, 8000, 'tower shield')
shopModule:addSellableItem({'vampire shield'}, 2534, 15000, 'vampire shield')
shopModule:addSellableItem({'beholder shield'}, 2518, 1200, 'beholder shield')
shopModule:addSellableItem({'blue robe'}, 2656, 10000, 'blue robe')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
focusModule:addGreetMessage('djannihah')
npcHandler:addModule(focusModule)
