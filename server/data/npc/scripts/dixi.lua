local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello, |PLAYERNAME|. I sell armor and shields.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'coat'}, 2651, 8, 1, 'coat')
shopModule:addBuyableItem({'jacket'}, 2650, 10, 1, 'jacket')
shopModule:addBuyableItem({'leather armor'}, 2467, 25, 1, 'leather armor')
shopModule:addBuyableItem({'leather helmet'}, 2461, 12, 1, 'leather helmet')
shopModule:addBuyableItem({'leather legs'}, 2649, 10, 1, 'leather legs')
shopModule:addBuyableItem({'studded helmet'}, 2482, 63, 1, 'studded helmet')
shopModule:addBuyableItem({'studded shield'}, 2526, 50, 1, 'studded shield')
shopModule:addBuyableItem({'wooden shield'}, 2512, 15, 1, 'wooden shield')
shopModule:addSellableItem({'brass helmet'}, 2460, 30, 'brass helmet')
shopModule:addSellableItem({'brass shield'}, 2511, 25, 'brass shield')
shopModule:addSellableItem({'chain helmet'}, 2458, 17, 'chain helmet')
shopModule:addSellableItem({'leather armor'}, 2467, 12, 'leather armor')
shopModule:addSellableItem({'leather helmet'}, 2461, 4, 'leather helmet')
shopModule:addSellableItem({'leather legs'}, 2649, 1, 'leather legs')
shopModule:addSellableItem({'plate shield'}, 2510, 45, 'plate shield')
shopModule:addSellableItem({'steel shield'}, 2509, 80, 'steel shield')
shopModule:addSellableItem({'studded helmet'}, 2482, 20, 'studded helmet')
shopModule:addSellableItem({'studded legs'}, 2468, 15, 'studded legs')
shopModule:addSellableItem({'studded shield'}, 2526, 16, 'studded shield')
shopModule:addSellableItem({'wooden shield'}, 2512, 5, 'wooden shield')

npcHandler:addModule(FocusModule:new())
