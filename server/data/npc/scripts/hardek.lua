local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello |PLAYERNAME|. I trade armor.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'brass armor'}, 2465, 450, 1, 'brass armor')
shopModule:addBuyableItem({'brass helmet'}, 2460, 120, 1, 'brass helmet')
shopModule:addBuyableItem({'brass legs'}, 2478, 195, 1, 'brass legs')
shopModule:addBuyableItem({'chain armor'}, 2464, 200, 1, 'chain armor')
shopModule:addBuyableItem({'chain helmet'}, 2458, 52, 1, 'chain helmet')
shopModule:addBuyableItem({'chain legs'}, 2648, 80, 1, 'chain legs')
shopModule:addBuyableItem({'leather armor'}, 2467, 35, 1, 'leather armor')
shopModule:addBuyableItem({'leather helmet'}, 2461, 12, 1, 'leather helmet')
shopModule:addBuyableItem({'leather legs'}, 2649, 10, 1, 'leather legs')
shopModule:addBuyableItem({'studded armor'}, 2484, 90, 1, 'studded armor')
shopModule:addBuyableItem({'studded helmet'}, 2482, 63, 1, 'studded helmet')
shopModule:addBuyableItem({'studded legs'}, 2468, 50, 1, 'studded legs')
shopModule:addSellableItem({'brass armor'}, 2465, 150, 'brass armor')
shopModule:addSellableItem({'brass helmet'}, 2460, 30, 'brass helmet')
shopModule:addSellableItem({'brass legs'}, 2478, 49, 'brass legs')
shopModule:addSellableItem({'chain armor'}, 2464, 70, 'chain armor')
shopModule:addSellableItem({'chain helmet'}, 2458, 17, 'chain helmet')
shopModule:addSellableItem({'chain legs'}, 2648, 25, 'chain legs')
shopModule:addSellableItem({'leather armor'}, 2467, 12, 'leather armor')
shopModule:addSellableItem({'leather helmet'}, 2461, 4, 'leather helmet')
shopModule:addSellableItem({'leather legs'}, 2649, 1, 'leather legs')
shopModule:addSellableItem({'plate armor'}, 2463, 400, 'plate armor')
shopModule:addSellableItem({'studded armor'}, 2484, 25, 'studded armor')
shopModule:addSellableItem({'studded helmet'}, 2482, 20, 'studded helmet')
shopModule:addSellableItem({'studded legs'}, 2468, 15, 'studded legs')

npcHandler:addModule(FocusModule:new())
