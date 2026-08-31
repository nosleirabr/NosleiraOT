local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Partos."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "Job? I'm a prisoner! Can't you see?!"})
keywordHandler:addKeyword({'prison'}, StdModule.say, {npcHandler = npcHandler, text = "Yes, I am in prison. They caught me."})
keywordHandler:addKeyword({'thief'}, StdModule.say, {npcHandler = npcHandler, text = "I used to be a thief. But not a very good one, it seems."})
keywordHandler:addKeyword({'fruit'}, StdModule.say, {npcHandler = npcHandler, text = "I'd do anything for an apple or some grapes."})
keywordHandler:addKeyword({'jail'}, StdModule.say, {npcHandler = npcHandler, text = "I will rot in here if nobody helps me."})

npcHandler:setMessage(MESSAGE_GREET, "Oh, a visitor! Hello |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Finally I can rest in silence.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Finally I can rest in silence.")

npcHandler:addModule(FocusModule:new())
