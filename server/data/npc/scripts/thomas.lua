local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hello |PLAYERNAME|. Household goods.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'backpack'}, 1988, 20, 1, 'backpack')
shopModule:addBuyableItem({'bag'}, 1987, 5, 1, 'bag')
shopModule:addBuyableItem({'box'}, 1738, 10, 1, 'box')
shopModule:addBuyableItem({'chest'}, 1740, 10, 1, 'chest')
shopModule:addBuyableItem({'crate'}, 1739, 10, 1, 'crate')
shopModule:addBuyableItem({'present'}, 1990, 10, 1, 'present')
shopModule:addBuyableItem({'rope'}, 2120, 50, 1, 'rope')
shopModule:addBuyableItem({'torch'}, 2050, 2, 1, 'torch')
shopModule:addSellableItem({'rope'}, 2120, 15, 'rope')

npcHandler:addModule(FocusModule:new())
