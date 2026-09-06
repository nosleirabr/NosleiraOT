local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'tulip'}, 3668, 9, 'tulip')
shopModule:addBuyableItem({'brown'}, 3725, 10, 'brown')
shopModule:addBuyableItem({'fern'}, 3737, 24, 'fern')
shopModule:addBuyableItem({'stone'}, 3735, 28, 'stone')
shopModule:addBuyableItem({'star'}, 3736, 21, 'star')
shopModule:addBuyableItem({'rose'}, 3658, 11, 'rose')
shopModule:addBuyableItem({'white'}, 3723, 6, 'white')
shopModule:addBuyableItem({'red'}, 3724, 12, 'red')


npcHandler:addModule(FocusModule:new())

