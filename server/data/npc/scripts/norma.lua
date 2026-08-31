local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Welcome |PLAYERNAME|! Thirsty or hungry?")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'bread'}, 2689, 4, 1, 'bread')
shopModule:addBuyableItem({'cheese'}, 2696, 6, 1, 'cheese')
shopModule:addBuyableItem({'egg'}, 2328, 2, 1, 'egg')
shopModule:addBuyableItem({'meat'}, 2666, 5, 1, 'meat')
shopModule:addBuyableItem({'ham'}, 2671, 8, 1, 'ham')
shopModule:addBuyableItem({'mug of beer'}, 2012, 5, 3, 'mug of beer')
shopModule:addBuyableItem({'mug of wine'}, 2012, 10, 15, 'mug of wine')

npcHandler:addModule(FocusModule:new())
