local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hiho |PLAYERNAME|! Tools for dwarfs and humans.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'backpack'}, 1988, 20, 1, 'backpack')
shopModule:addBuyableItem({'crowbar'}, 2416, 260, 1, 'crowbar')
shopModule:addBuyableItem({'fishing rod'}, 2580, 150, 1, 'fishing rod')
shopModule:addBuyableItem({'pick'}, 2553, 50, 1, 'pick')
shopModule:addBuyableItem({'rope'}, 2120, 50, 1, 'rope')
shopModule:addBuyableItem({'shovel'}, 2554, 50, 1, 'shovel')
shopModule:addBuyableItem({'torch'}, 2050, 2, 1, 'torch')
shopModule:addSellableItem({'crowbar'}, 2416, 50, 'crowbar')
shopModule:addSellableItem({'fishing rod'}, 2580, 40, 'fishing rod')
shopModule:addSellableItem({'pick'}, 2553, 15, 'pick')
shopModule:addSellableItem({'rope'}, 2120, 15, 'rope')
shopModule:addSellableItem({'shovel'}, 2554, 8, 'shovel')

npcHandler:addModule(FocusModule:new())
