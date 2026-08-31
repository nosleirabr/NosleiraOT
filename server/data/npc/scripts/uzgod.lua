local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hiho |PLAYERNAME|! Dwarven weapons.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'axe'}, 2386, 20, 1, 'axe')
shopModule:addBuyableItem({'battle axe'}, 2378, 235, 1, 'battle axe')
shopModule:addBuyableItem({'hand axe'}, 2380, 8, 1, 'hand axe')
shopModule:addBuyableItem({'mace'}, 2398, 90, 1, 'mace')
shopModule:addBuyableItem({'sword'}, 2376, 85, 1, 'sword')
shopModule:addSellableItem({'axe'}, 2386, 7, 'axe')
shopModule:addSellableItem({'battle axe'}, 2378, 75, 'battle axe')
shopModule:addSellableItem({'hand axe'}, 2380, 4, 'hand axe')
shopModule:addSellableItem({'mace'}, 2398, 30, 'mace')
shopModule:addSellableItem({'sword'}, 2376, 25, 'sword')

npcHandler:addModule(FocusModule:new())
