local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'small'}, 3028, 600, 'small')
shopModule:addBuyableItem({'black'}, 3027, 560, 'black')
shopModule:addBuyableItem({'wedding'}, 3004, 990, 'wedding')
shopModule:addBuyableItem({'small'}, 3029, 500, 'small')
shopModule:addBuyableItem({'small'}, 3032, 500, 'small')
shopModule:addBuyableItem({'small'}, 3030, 500, 'small')
shopModule:addBuyableItem({'ruby'}, 3016, 3560, 'ruby')
shopModule:addBuyableItem({'golden'}, 3013, 6600, 'golden')
shopModule:addBuyableItem({'small'}, 3033, 400, 'small')
shopModule:addBuyableItem({'white'}, 3026, 320, 'white')

shopModule:addSellableItem({'sell'}, 3028, 300, 'sell')
shopModule:addSellableItem({'sell'}, 3027, 280, 'sell')
shopModule:addSellableItem({'sell'}, 3029, 250, 'sell')
shopModule:addSellableItem({'sell'}, 3032, 250, 'sell')
shopModule:addSellableItem({'sell'}, 3030, 250, 'sell')
shopModule:addSellableItem({'sell'}, 3033, 200, 'sell')
shopModule:addSellableItem({'sell'}, 3026, 160, 'sell')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

