local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello |PLAYERNAME|. Weapons and more.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'axe'}, 2386, 20, 1, 'axe')
shopModule:addBuyableItem({'dagger'}, 2379, 5, 1, 'dagger')
shopModule:addBuyableItem({'hand axe'}, 2380, 8, 1, 'hand axe')
shopModule:addBuyableItem({'mace'}, 2398, 90, 1, 'mace')
shopModule:addBuyableItem({'rapier'}, 2384, 15, 1, 'rapier')
shopModule:addBuyableItem({'sabre'}, 2385, 35, 1, 'sabre')
shopModule:addBuyableItem({'short sword'}, 2406, 30, 1, 'short sword')
shopModule:addBuyableItem({'spear'}, 2389, 10, 1, 'spear')
shopModule:addBuyableItem({'sword'}, 2376, 85, 1, 'sword')
shopModule:addSellableItem({'axe'}, 2386, 7, 'axe')
shopModule:addSellableItem({'dagger'}, 2379, 2, 'dagger')
shopModule:addSellableItem({'hand axe'}, 2380, 4, 'hand axe')
shopModule:addSellableItem({'mace'}, 2398, 30, 'mace')
shopModule:addSellableItem({'rapier'}, 2384, 5, 'rapier')
shopModule:addSellableItem({'sabre'}, 2385, 12, 'sabre')
shopModule:addSellableItem({'short sword'}, 2406, 10, 'short sword')
shopModule:addSellableItem({'spear'}, 2389, 3, 'spear')
shopModule:addSellableItem({'sword'}, 2376, 25, 'sword')

npcHandler:addModule(FocusModule:new())
