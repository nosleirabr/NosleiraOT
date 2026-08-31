local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Ahlan |PLAYERNAME|. Weapons of the desert.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'dagger'}, 2379, 5, 1, 'dagger')
shopModule:addBuyableItem({'mace'}, 2398, 90, 1, 'mace')
shopModule:addBuyableItem({'sabre'}, 2385, 35, 1, 'sabre')
shopModule:addBuyableItem({'scimitar'}, 2419, 150, 1, 'scimitar')
shopModule:addBuyableItem({'sword'}, 2376, 85, 1, 'sword')
shopModule:addSellableItem({'dagger'}, 2379, 2, 'dagger')
shopModule:addSellableItem({'mace'}, 2398, 30, 'mace')
shopModule:addSellableItem({'sabre'}, 2385, 12, 'sabre')
shopModule:addSellableItem({'scimitar'}, 2419, 100, 'scimitar')
shopModule:addSellableItem({'sword'}, 2376, 25, 'sword')

npcHandler:addModule(FocusModule:new())
