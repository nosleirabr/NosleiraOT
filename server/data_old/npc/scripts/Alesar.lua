local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'dark'}, 3384, 1000, 'dark')
shopModule:addBuyableItem({'ice'}, 3284, 5000, 'ice')
shopModule:addBuyableItem({'dark'}, 3383, 1500, 'dark')
shopModule:addBuyableItem({'serpent'}, 3297, 6000, 'serpent')
shopModule:addBuyableItem({'ancient'}, 3432, 5000, 'ancient')

shopModule:addSellableItem({'sell'}, 3574, 150, 'sell')
shopModule:addSellableItem({'sell'}, 3371, 5000, 'sell')
shopModule:addSellableItem({'sell'}, 3383, 400, 'sell')
shopModule:addSellableItem({'sell'}, 3429, 800, 'sell')
shopModule:addSellableItem({'sell'}, 3432, 900, 'sell')
shopModule:addSellableItem({'sell'}, 3434, 15000, 'sell')
shopModule:addSellableItem({'sell'}, 3281, 17000, 'sell')
shopModule:addSellableItem({'sell'}, 3428, 8000, 'sell')
shopModule:addSellableItem({'sell'}, 3324, 6000, 'sell')
shopModule:addSellableItem({'sell'}, 3322, 2000, 'sell')
shopModule:addSellableItem({'sell'}, 3318, 2000, 'sell')
shopModule:addSellableItem({'sell'}, 3299, 50, 'sell')
shopModule:addSellableItem({'sell'}, 3297, 900, 'sell')
shopModule:addSellableItem({'sell'}, 3384, 250, 'sell')
shopModule:addSellableItem({'sell'}, 3370, 5000, 'sell')
shopModule:addSellableItem({'sell'}, 3307, 150, 'sell')
shopModule:addSellableItem({'sell'}, 3373, 500, 'sell')
shopModule:addSellableItem({'sell'}, 3369, 5000, 'sell')

npcHandler:addModule(FocusModule:new())

