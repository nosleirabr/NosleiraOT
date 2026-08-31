local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Zebron."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a professional gambler."})
keywordHandler:addKeyword({'game'}, StdModule.say, {npcHandler = npcHandler, text = "I love playing dice. If you want a {game}, just ask."})
keywordHandler:addKeyword({'dice'}, StdModule.say, {npcHandler = npcHandler, text = "I can roll the dice for you, but it costs some gold."})

npcHandler:setMessage(MESSAGE_GREET, "Hey |PLAYERNAME|, want to play a {game} of dice?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye.")

npcHandler:addModule(FocusModule:new())
