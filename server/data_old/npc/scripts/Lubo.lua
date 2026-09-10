local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'backpack'}, 2854, 25, 'backpack')
shopModule:addBuyableItem({'crowbar'}, 3304, 260, 'crowbar')
shopModule:addBuyableItem({'torch'}, 2920, 3, 'torch')
shopModule:addBuyableItem({'rope'}, 3003, 60, 'rope')
shopModule:addBuyableItem({'fishing'}, 3483, 175, 'fishing')
shopModule:addBuyableItem({'water'}, 2901, 10, 'water')
shopModule:addBuyableItem({'apple'}, 3585, 3, 'apple')


npcHandler:addModule(FocusModule:new())

