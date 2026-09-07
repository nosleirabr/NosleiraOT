local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'ruby'}, 3016, 3560, 'ruby')
shopModule:addBuyableItem({'golden'}, 3013, 6600, 'golden')
shopModule:addBuyableItem({'wedding'}, 3004, 990, 'wedding')


npcHandler:addModule(FocusModule:new())

