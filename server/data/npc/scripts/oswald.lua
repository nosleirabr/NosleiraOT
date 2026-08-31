local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "My name is Oswald."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a man of many trades. Currently, I am working as an assistant for various people."})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "The king is a very generous man. He pays well for my services."})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = "Thais is the capital of the kingdom, the most glorious city in the world."})
keywordHandler:addKeyword({'rumor'}, StdModule.say, {npcHandler = npcHandler, text = "I know many things. Just ask me."})
keywordHandler:addKeyword({'gossip'}, StdModule.say, {npcHandler = npcHandler, text = "I am not a gossiper. I just know things."})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = "Go to Sam if you need weapons. But I heard he is quite expensive."})
keywordHandler:addKeyword({'sam'}, StdModule.say, {npcHandler = npcHandler, text = "He is the blacksmith in Thais."})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = "I heard the king is planning a great feast."})

npcHandler:setMessage(MESSAGE_GREET, "Oh, hello |PLAYERNAME|! What can I do for you?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye, and keep your ears open.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye, and keep your ears open.")

npcHandler:addModule(FocusModule:new())
