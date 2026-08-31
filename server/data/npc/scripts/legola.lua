local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello |PLAYERNAME|. Bows and ammunition.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'arrow'}, 2544, 3, 1, 'arrow')
shopModule:addBuyableItem({'bolt'}, 2543, 4, 1, 'bolt')
shopModule:addBuyableItem({'bow'}, 2456, 400, 1, 'bow')
shopModule:addBuyableItem({'crossbow'}, 2455, 500, 1, 'crossbow')
shopModule:addBuyableItem({'spear'}, 2389, 10, 1, 'spear')
shopModule:addSellableItem({'bow'}, 2456, 100, 'bow')
shopModule:addSellableItem({'crossbow'}, 2455, 120, 'crossbow')
shopModule:addSellableItem({'spear'}, 2389, 3, 'spear')

npcHandler:addModule(FocusModule:new())
