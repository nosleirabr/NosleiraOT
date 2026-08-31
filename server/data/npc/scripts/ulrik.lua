local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello |PLAYERNAME|. Armor and more.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'brass armor'}, 2465, 450, 1, 'brass armor')
shopModule:addBuyableItem({'brass helmet'}, 2460, 120, 1, 'brass helmet')
shopModule:addBuyableItem({'chain armor'}, 2464, 200, 1, 'chain armor')
shopModule:addBuyableItem({'leather armor'}, 2467, 35, 1, 'leather armor')
shopModule:addBuyableItem({'steel shield'}, 2509, 240, 1, 'steel shield')
shopModule:addSellableItem({'brass armor'}, 2465, 150, 'brass armor')
shopModule:addSellableItem({'brass helmet'}, 2460, 30, 'brass helmet')
shopModule:addSellableItem({'chain armor'}, 2464, 70, 'chain armor')
shopModule:addSellableItem({'leather armor'}, 2467, 12, 'leather armor')
shopModule:addSellableItem({'steel shield'}, 2509, 80, 'steel shield')

npcHandler:addModule(FocusModule:new())
