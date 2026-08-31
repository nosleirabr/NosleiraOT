local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

npcHandler:setMessage(MESSAGE_GREET, "Hiho |PLAYERNAME|! Fire and magic goods.")

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'blank rune'}, 2260, 10, 1, 'blank rune')
shopModule:addBuyableItem({'life fluid'}, 2006, 60, 10, 'life fluid')
shopModule:addBuyableItem({'mana fluid'}, 2006, 55, 7, 'mana fluid')
shopModule:addBuyableItem({'torch'}, 2050, 2, 1, 'torch')

npcHandler:addModule(FocusModule:new())
