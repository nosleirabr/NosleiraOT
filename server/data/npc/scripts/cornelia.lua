local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Cornelia."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I run the local armory."})
keywordHandler:addKeyword({'armor'}, StdModule.say, {npcHandler = npcHandler, text = "I sell chain, brass, and iron armors."})
keywordHandler:addKeyword({'shield'}, StdModule.say, {npcHandler = npcHandler, text = "I sell wooden, studded, brass and steel shields."})
keywordHandler:addKeyword({'helmet'}, StdModule.say, {npcHandler = npcHandler, text = "I sell leather, studded, chain, brass, iron and steel helmets."})
keywordHandler:addKeyword({'legs'}, StdModule.say, {npcHandler = npcHandler, text = "I sell leather, studded, chain and brass legs."})

npcHandler:setMessage(MESSAGE_FAREWELL, "May the gods protect you.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "May the gods protect you.")

npcHandler:addModule(FocusModule:new())
