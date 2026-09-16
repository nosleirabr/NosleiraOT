local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hey |PLAYERNAME|! Looking for equipment?")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'backpack'}, 1988, 10, 1, 'backpack')
shopModule:addBuyableItem({'bag'}, 1987, 5, 1, 'bag')
shopModule:addBuyableItem({'fishing rod'}, 2580, 150, 1, 'fishing rod')
shopModule:addBuyableItem({'rope'}, 2120, 50, 1, 'rope')
shopModule:addBuyableItem({'scroll'}, 1949, 5, 1, 'scroll')
shopModule:addBuyableItem({'scythe'}, 2550, 12, 1, 'scythe')
shopModule:addBuyableItem({'shovel'}, 2554, 10, 1, 'shovel')
shopModule:addBuyableItem({'torch'}, 2050, 2, 1, 'torch')
shopModule:addSellableItem({'fishing rod'}, 2580, 30, 'fishing rod')
shopModule:addSellableItem({'rope'}, 2120, 8, 'rope')
shopModule:addSellableItem({'shovel'}, 2554, 2, 'shovel')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
