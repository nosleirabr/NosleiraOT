local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'obsidian'}, 3313, 3000, 'obsidian')
shopModule:addBuyableItem({'spike'}, 3271, 8000, 'spike')
shopModule:addBuyableItem({'beholder'}, 3418, 7000, 'beholder')
shopModule:addBuyableItem({'war'}, 3279, 10000, 'war')
shopModule:addBuyableItem({'noble'}, 3380, 8000, 'noble')

shopModule:addSellableItem({'sell'}, 3079, 30000, 'sell')
shopModule:addSellableItem({'sell'}, 3415, 2000, 'sell')
shopModule:addSellableItem({'sell'}, 3302, 9000, 'sell')
shopModule:addSellableItem({'sell'}, 3567, 10000, 'sell')
shopModule:addSellableItem({'sell'}, 3320, 8000, 'sell')
shopModule:addSellableItem({'sell'}, 3301, 500, 'sell')
shopModule:addSellableItem({'sell'}, 3418, 1200, 'sell')
shopModule:addSellableItem({'sell'}, 3380, 900, 'sell')
shopModule:addSellableItem({'sell'}, 3392, 30000, 'sell')
shopModule:addSellableItem({'sell'}, 3416, 4000, 'sell')
shopModule:addSellableItem({'sell'}, 3271, 1000, 'sell')
shopModule:addSellableItem({'sell'}, 3385, 2500, 'sell')
shopModule:addSellableItem({'sell'}, 3279, 1200, 'sell')
shopModule:addSellableItem({'sell'}, 3284, 1000, 'sell')
shopModule:addSellableItem({'sell'}, 3280, 4000, 'sell')
shopModule:addSellableItem({'sell'}, 3391, 6000, 'sell')
shopModule:addSellableItem({'sell'}, 3419, 8000, 'sell')
shopModule:addSellableItem({'sell'}, 3382, 12000, 'sell')
shopModule:addSellableItem({'sell'}, 3313, 500, 'sell')
shopModule:addSellableItem({'sell'}, 3439, 16000, 'sell')
shopModule:addSellableItem({'sell'}, 3381, 12000, 'sell')

npcHandler:addModule(FocusModule:new())

