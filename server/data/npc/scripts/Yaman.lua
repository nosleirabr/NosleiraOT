local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'life'}, 3052, 900, 'life')
shopModule:addBuyableItem({'dragon'}, 3085, 1000, 'dragon')
shopModule:addBuyableItem({'might'}, 3048, 5000, 'might')
shopModule:addBuyableItem({'dwarven'}, 3097, 2000, 'dwarven')
shopModule:addBuyableItem({'ring'}, 3098, 2000, 'ring')
shopModule:addBuyableItem({'protection'}, 3084, 700, 'protection')
shopModule:addBuyableItem({'strange'}, 3045, 100, 'strange')
shopModule:addBuyableItem({'time'}, 3053, 2000, 'time')
shopModule:addBuyableItem({'silver'}, 3054, 100, 'silver')
shopModule:addBuyableItem({'energy'}, 3051, 2000, 'energy')

shopModule:addSellableItem({'sell'}, 3053, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3070, 200, 'sell')
shopModule:addSellableItem({'sell'}, 3067, 3000, 'sell')
shopModule:addSellableItem({'sell'}, 3052, 50, 'sell')
shopModule:addSellableItem({'sell'}, 3097, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3065, 2000, 'sell')
shopModule:addSellableItem({'sell'}, 3084, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3077, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3098, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3085, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3048, 250, 'sell')
shopModule:addSellableItem({'sell'}, 3078, 50, 'sell')
shopModule:addSellableItem({'sell'}, 3054, 50, 'sell')
shopModule:addSellableItem({'sell'}, 3069, 1000, 'sell')
shopModule:addSellableItem({'sell'}, 3045, 30, 'sell')
shopModule:addSellableItem({'sell'}, 3066, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3051, 100, 'sell')

npcHandler:addModule(FocusModule:new())

