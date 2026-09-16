local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a city guard. I protect Thais."})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = "King Tibianus is a fair and just ruler."})
keywordHandler:addKeyword({'city'}, StdModule.say, {npcHandler = npcHandler, text = "Thais is the most glorious city in the world."})
keywordHandler:addKeyword({'guard'}, StdModule.say, {npcHandler = npcHandler, text = "We guards make sure the laws of the king are obeyed."})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = "We are armed and ready."})

npcHandler:setMessage(MESSAGE_GREET, "Move along, |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye.")

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
