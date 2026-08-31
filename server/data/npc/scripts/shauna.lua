local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Sheriff Shauna."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am the sheriff of Carlin. I make sure everyone obeys the laws of the queen."})
keywordHandler:addKeyword({'queen'}, StdModule.say, {npcHandler = npcHandler, text = "Queen Eloise is a great ruler."})
keywordHandler:addKeyword({'criminal'}, StdModule.say, {npcHandler = npcHandler, text = "We have no criminals here. Carlin is a peaceful city."})
keywordHandler:addKeyword({'jail'}, StdModule.say, {npcHandler = npcHandler, text = "The jail is usually empty. We don't have many criminals here."})

npcHandler:setMessage(MESSAGE_GREET, "Greetings, |PLAYERNAME|. Be sure to obey the laws.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye.")

npcHandler:addModule(FocusModule:new())
