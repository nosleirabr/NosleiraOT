local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello, |PLAYERNAME|. I sell weapons.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'machete'}, 2420, 30, 1, 'machete')
shopModule:addBuyableItem({'axe'}, 2386, 20, 1, 'axe')
shopModule:addBuyableItem({'dagger'}, 2379, 5, 1, 'dagger')
shopModule:addBuyableItem({'hand axe'}, 2380, 8, 1, 'hand axe')
shopModule:addBuyableItem({'rapier'}, 2384, 15, 1, 'rapier')
shopModule:addBuyableItem({'sabre'}, 2385, 25, 1, 'sabre')
shopModule:addBuyableItem({'scythe'}, 2550, 12, 1, 'scythe')
shopModule:addBuyableItem({'short sword'}, 2406, 30, 1, 'short sword')
shopModule:addBuyableItem({'sickle'}, 2405, 8, 1, 'sickle')
shopModule:addBuyableItem({'spear'}, 2389, 10, 1, 'spear')
shopModule:addSellableItem({'hand axe'}, 2380, 4, 'hand axe')
shopModule:addSellableItem({'axe'}, 2386, 7, 'axe')
shopModule:addSellableItem({'bone club'}, 2449, 5, 'bone club')
shopModule:addSellableItem({'dagger'}, 2379, 2, 'dagger')
shopModule:addSellableItem({'rapier'}, 2384, 5, 'rapier')
shopModule:addSellableItem({'sabre'}, 2385, 12, 'sabre')
shopModule:addSellableItem({'scythe'}, 2550, 3, 'scythe')
shopModule:addSellableItem({'short sword'}, 2406, 10, 'short sword')
shopModule:addSellableItem({'sickle'}, 2405, 2, 'sickle')
shopModule:addSellableItem({'spear'}, 2389, 3, 'spear')
shopModule:addSellableItem({'sword'}, 2376, 25, 'sword')

npcHandler:addModule(FocusModule:new())
