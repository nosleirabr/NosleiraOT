local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Baxter, the guard."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I guard the castle and look for suspicious people."})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "King Tibianus is a great ruler."})
keywordHandler:addKeyword({'rat'}, StdModule.say, {npcHandler = npcHandler, text = "Sometimes there are rats in the dungeons. If you see one, kill it."})

npcHandler:setMessage(MESSAGE_GREET, "Long live the king, |PLAYERNAME|!")
npcHandler:setMessage(MESSAGE_FAREWELL, "LONG LIVE THE KING!")
npcHandler:setMessage(MESSAGE_WALKAWAY, "LONG LIVE THE KING!")

npcHandler:addModule(FocusModule:new())
