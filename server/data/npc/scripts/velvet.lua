local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello |PLAYERNAME|. Soft goods and furniture.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'box'}, 1738, 10, 1, 'box')
shopModule:addBuyableItem({'chest'}, 1740, 10, 1, 'chest')
shopModule:addBuyableItem({'crate'}, 1739, 10, 1, 'crate')
shopModule:addBuyableItem({'drawer'}, 1718, 20, 1, 'drawer')
shopModule:addBuyableItem({'present'}, 1990, 10, 1, 'present')
shopModule:addBuyableItem({'vase'}, 2008, 20, 0, 'vase')

npcHandler:addModule(FocusModule:new())
