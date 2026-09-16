local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'stone'}, 3081, 5000, 'stone')
shopModule:addBuyableItem({'light'}, 3046, 120, 'light')
shopModule:addBuyableItem({'stealth'}, 3049, 5000, 'stealth')
shopModule:addBuyableItem({'elven'}, 3082, 500, 'elven')
shopModule:addBuyableItem({'power'}, 3050, 100, 'power')
shopModule:addBuyableItem({'club'}, 3093, 500, 'club')
shopModule:addBuyableItem({'bronze'}, 3056, 100, 'bronze')
shopModule:addBuyableItem({'sword'}, 3091, 500, 'sword')
shopModule:addBuyableItem({'axe'}, 3092, 500, 'axe')
shopModule:addBuyableItem({'garlic'}, 3083, 100, 'garlic')

shopModule:addSellableItem({'sell'}, 3046, 35, 'sell')
shopModule:addSellableItem({'sell'}, 3072, 1000, 'sell')
shopModule:addSellableItem({'sell'}, 3074, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3082, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3091, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3093, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3062, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3060, 750, 'sell')
shopModule:addSellableItem({'sell'}, 3092, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3081, 500, 'sell')
shopModule:addSellableItem({'sell'}, 3083, 50, 'sell')
shopModule:addSellableItem({'sell'}, 3061, 50, 'sell')
shopModule:addSellableItem({'sell'}, 3050, 50, 'sell')
shopModule:addSellableItem({'sell'}, 3056, 50, 'sell')
shopModule:addSellableItem({'sell'}, 3049, 200, 'sell')
shopModule:addSellableItem({'sell'}, 3075, 200, 'sell')
shopModule:addSellableItem({'sell'}, 3073, 2000, 'sell')
shopModule:addSellableItem({'sell'}, 3071, 3000, 'sell')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

