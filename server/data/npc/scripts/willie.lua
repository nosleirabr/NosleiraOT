local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello |PLAYERNAME|. I sell food.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'bread'}, 2689, 3, 1, 'bread')
shopModule:addBuyableItem({'cheese'}, 2696, 5, 1, 'cheese')
shopModule:addBuyableItem({'meat'}, 2666, 5, 1, 'meat')
shopModule:addBuyableItem({'ham'}, 2671, 8, 1, 'ham')
shopModule:addSellableItem({'bread'}, 2689, 1, 'bread')
shopModule:addSellableItem({'cheese'}, 2696, 2, 'cheese')
shopModule:addSellableItem({'meat'}, 2666, 2, 'meat')
shopModule:addSellableItem({'ham'}, 2671, 4, 'ham')

npcHandler:addModule(FocusModule:new())
