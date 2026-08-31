local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Bozo, the royal jester."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I entertain the king. A very important job, indeed!"})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "Ah, King Tibianus! He has a great sense of humor."})
keywordHandler:addKeyword({'joke'}, StdModule.say, {npcHandler = npcHandler, text = "Why did the minotaur cross the road? To get to the other side! Hahaha!"})
keywordHandler:addKeyword({'fool'}, StdModule.say, {npcHandler = npcHandler, text = "We are all fools in the grand scheme of things."})

npcHandler:setMessage(MESSAGE_GREET, "Hi there, |PLAYERNAME|! Looking for a {joke}?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Remember, life is a joke! Hehe!")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Remember, life is a joke! Hehe!")

npcHandler:addModule(FocusModule:new())
