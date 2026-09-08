local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am General Harkath Bloodblade."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am the general of the king's army."})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = "We are the defenders of Thais!"})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "King Tibianus is our noble sovereign. Long live the king!"})
keywordHandler:addKeyword({'general'}, StdModule.say, {npcHandler = npcHandler, text = "I am the general of the king's army."})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = "We protect Thais from any threats."})

npcHandler:setMessage(MESSAGE_GREET, "Greetings, |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Dismissed.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Dismissed.")

npcHandler:addModule(FocusModule:new())
