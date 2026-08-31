local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'meat'}, 2666, 5, 'meat')
shopModule:addBuyableItem({'ham'}, 2671, 8, 'ham')
shopModule:addBuyableItem({'beer'}, 2012, 5, 3, 'mug of beer')
shopModule:addBuyableItem({'wine'}, 2012, 10, 15, 'mug of wine')

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Urkalio."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a tavern keeper. Want a drink or some food?"})

npcHandler:setMessage(MESSAGE_GREET, "Welcome, |PLAYERNAME|. Want some {food} or {drinks}?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye.")

npcHandler:addModule(FocusModule:new())
