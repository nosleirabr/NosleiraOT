local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Welcome to my shop, |PLAYERNAME|.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'backpack'}, 1988, 20, 1, 'backpack')
shopModule:addBuyableItem({'basket'}, 1989, 6, 1, 'basket')
shopModule:addBuyableItem({'bottle'}, 2007, 3, 0, 'bottle')
shopModule:addBuyableItem({'bucket'}, 2005, 4, 0, 'bucket')
shopModule:addBuyableItem({'candelabrum'}, 2057, 8, 1, 'candelabrum')
shopModule:addBuyableItem({'candlestick'}, 2047, 2, 1, 'candlestick')
shopModule:addBuyableItem({'crowbar'}, 2416, 260, 1, 'crowbar')
shopModule:addBuyableItem({'document'}, 1952, 12, 1, 'document')
shopModule:addBuyableItem({'fishing rod'}, 2580, 150, 1, 'fishing rod')
shopModule:addBuyableItem({'inkwell'}, 2600, 10, 1, 'inkwell')
shopModule:addBuyableItem({'machete'}, 2420, 35, 1, 'machete')
shopModule:addBuyableItem({'pick'}, 2553, 50, 1, 'pick')
shopModule:addBuyableItem({'plate'}, 2035, 6, 1, 'plate')
shopModule:addBuyableItem({'present'}, 1990, 10, 1, 'present')
shopModule:addBuyableItem({'rope'}, 2120, 50, 1, 'rope')
shopModule:addBuyableItem({'scroll'}, 1949, 5, 1, 'scroll')
shopModule:addBuyableItem({'scythe'}, 2550, 50, 1, 'scythe')
shopModule:addBuyableItem({'shovel'}, 2554, 50, 1, 'shovel')
shopModule:addBuyableItem({'torch'}, 2050, 2, 1, 'torch')
shopModule:addBuyableItem({'watch'}, 2036, 20, 1, 'watch')
shopModule:addSellableItem({'crowbar'}, 2416, 50, 'crowbar')
shopModule:addSellableItem({'fishing rod'}, 2580, 40, 'fishing rod')
shopModule:addSellableItem({'inkwell'}, 2600, 8, 'inkwell')
shopModule:addSellableItem({'machete'}, 2420, 6, 'machete')
shopModule:addSellableItem({'pick'}, 2553, 15, 'pick')
shopModule:addSellableItem({'rope'}, 2120, 15, 'rope')
shopModule:addSellableItem({'scythe'}, 2550, 10, 'scythe')
shopModule:addSellableItem({'shovel'}, 2554, 8, 'shovel')
shopModule:addSellableItem({'watch'}, 2036, 6, 'watch')
shopModule:addSellableItem({'wooden hammer'}, 2556, 15, 'wooden hammer')

npcHandler:addModule(FocusModule:new())
