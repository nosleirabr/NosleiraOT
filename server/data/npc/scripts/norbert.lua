local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello |PLAYERNAME|. Armor for adventurers.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'brass armor'}, 2465, 450, 1, 'brass armor')
shopModule:addBuyableItem({'chain armor'}, 2464, 200, 1, 'chain armor')
shopModule:addBuyableItem({'leather armor'}, 2467, 35, 1, 'leather armor')
shopModule:addBuyableItem({'plate armor'}, 2463, 1200, 1, 'plate armor')
shopModule:addBuyableItem({'studded armor'}, 2484, 90, 1, 'studded armor')
shopModule:addSellableItem({'brass armor'}, 2465, 150, 'brass armor')
shopModule:addSellableItem({'chain armor'}, 2464, 70, 'chain armor')
shopModule:addSellableItem({'leather armor'}, 2467, 12, 'leather armor')
shopModule:addSellableItem({'plate armor'}, 2463, 400, 'plate armor')
shopModule:addSellableItem({'studded armor'}, 2484, 25, 'studded armor')

npcHandler:addModule(FocusModule:new())
