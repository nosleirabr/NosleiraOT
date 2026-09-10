local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a royal guard."})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "HAIL TO THE KING!"})
keywordHandler:addKeyword({'harkath'}, StdModule.say, {npcHandler = npcHandler, text = "He is our general."})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = "We are the best soldiers of the realm."})
keywordHandler:addKeyword({'guard'}, StdModule.say, {npcHandler = npcHandler, text = "We protect the king."})

npcHandler:setMessage(MESSAGE_GREET, "Behave yourself, |PLAYERNAME|!")
npcHandler:setMessage(MESSAGE_FAREWELL, "LONG LIVE THE KING!")
npcHandler:setMessage(MESSAGE_WALKAWAY, "LONG LIVE THE KING!")

npcHandler:addModule(FocusModule:new())
