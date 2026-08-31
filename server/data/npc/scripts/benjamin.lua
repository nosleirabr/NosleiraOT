local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'parcel'}, 2595, 15, 'parcel')
shopModule:addBuyableItem({'letter'}, 2597, 8, 'letter')
shopModule:addBuyableItem({'label'}, 2599, 1, 'label')

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "My name is Benjamin."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a postman. I sell parcels, labels, and letters."})
keywordHandler:addKeyword({'post'}, StdModule.say, {npcHandler = npcHandler, text = "We run the Tibian postal service. We sell parcels, labels, and letters."})

npcHandler:setMessage(MESSAGE_GREET, "Hello, |PLAYERNAME|. Need to send a letter?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Have a nice day!")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Have a nice day!")

npcHandler:addModule(FocusModule:new())
