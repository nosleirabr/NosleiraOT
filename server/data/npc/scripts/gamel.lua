local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Gamel."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I'm just a poor man. I sell some weapons to survive."})
keywordHandler:addKeyword({'rebel'}, StdModule.say, {npcHandler = npcHandler, text = "I don't know what you're talking about!"})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = "I sell basic weapons for adventurers."})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = "I sell basic weapons for adventurers."})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = "I sell basic weapons for adventurers."})

npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye.")

npcHandler:addModule(FocusModule:new())
