local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'bone'}, StdModule.say, {npcHandler = npcHandler, text = "<Sniff>"})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "Wuff! Wuff!"})
keywordHandler:addKeyword({'tibianus'}, StdModule.say, {npcHandler = npcHandler, text = "Wuff! Wuff!"})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "Grrrr..."})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = "<Sniff>"})

npcHandler:setMessage(MESSAGE_GREET, "Woof! Woof!")
npcHandler:setMessage(MESSAGE_FAREWELL, "Woof!")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Woof!")

npcHandler:addModule(FocusModule:new())
