local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Imalas."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a poor postman, forced to take orders from a woman. It is humiliating!"})
keywordHandler:addKeyword({'liane'}, StdModule.say, {npcHandler = npcHandler, text = "She is so bossy."})
keywordHandler:addKeyword({'parcel'}, StdModule.say, {npcHandler = npcHandler, text = "Go to Liane if you want to buy something. I just work here."})
keywordHandler:addKeyword({'letter'}, StdModule.say, {npcHandler = npcHandler, text = "Go to Liane if you want to buy something. I just work here."})

npcHandler:setMessage(MESSAGE_GREET, "What do you want? Talk to Liane if you want a parcel.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Finally some peace.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Finally some peace.")

npcHandler:addModule(FocusModule:new())
