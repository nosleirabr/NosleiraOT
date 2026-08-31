local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Ashari |PLAYERNAME|. Armor and weapons.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'brass armor'}, 2465, 450, 1, 'brass armor')
shopModule:addBuyableItem({'chain armor'}, 2464, 200, 1, 'chain armor')
shopModule:addBuyableItem({'leather armor'}, 2467, 35, 1, 'leather armor')
shopModule:addBuyableItem({'steel helmet'}, 2457, 580, 1, 'steel helmet')
shopModule:addBuyableItem({'sword'}, 2376, 85, 1, 'sword')
shopModule:addSellableItem({'brass armor'}, 2465, 150, 'brass armor')
shopModule:addSellableItem({'chain armor'}, 2464, 70, 'chain armor')
shopModule:addSellableItem({'leather armor'}, 2467, 12, 'leather armor')
shopModule:addSellableItem({'steel helmet'}, 2457, 293, 'steel helmet')
shopModule:addSellableItem({'sword'}, 2376, 25, 'sword')

npcHandler:addModule(FocusModule:new())
