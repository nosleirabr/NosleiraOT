local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'bread'}, 2689, 4, 'bread')
shopModule:addBuyableItem({'cheese'}, 2696, 6, 'cheese')
shopModule:addBuyableItem({'egg'}, 2328, 2, 'egg')
shopModule:addBuyableItem({'meat'}, 2666, 5, 'meat')
shopModule:addBuyableItem({'ham'}, 2671, 8, 'ham')
shopModule:addBuyableItem({'beer'}, 2012, 5, 3, 'mug of beer')
shopModule:addBuyableItem({'wine'}, 2012, 10, 15, 'mug of wine')

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Dane."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I run this tavern."})
keywordHandler:addKeyword({'tavern'}, StdModule.say, {npcHandler = npcHandler, text = "Welcome to the best tavern in Carlin!"})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = "I sell meat, bread, cheese, ham, and eggs."})
keywordHandler:addKeyword({'drink'}, StdModule.say, {npcHandler = npcHandler, text = "I sell beer and wine."})

npcHandler:setMessage(MESSAGE_GREET, "Welcome to my tavern, |PLAYERNAME|. Want some {food} or {drinks}?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye.")

npcHandler:addModule(FocusModule:new())
