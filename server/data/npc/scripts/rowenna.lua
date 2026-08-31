local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Rowenna."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am the local weapon smith."})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = "I sell swords, axes, maces, and spears."})
keywordHandler:addKeyword({'sword'}, StdModule.say, {npcHandler = npcHandler, text = "I sell daggers, rapiers, sabres, short swords and swords."})
keywordHandler:addKeyword({'axe'}, StdModule.say, {npcHandler = npcHandler, text = "I sell hand axes and axes."})
keywordHandler:addKeyword({'mace'}, StdModule.say, {npcHandler = npcHandler, text = "I sell maces."})
keywordHandler:addKeyword({'spear'}, StdModule.say, {npcHandler = npcHandler, text = "I sell spears."})

npcHandler:setMessage(MESSAGE_FAREWELL, "May the gods protect you.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "May the gods protect you.")

npcHandler:addModule(FocusModule:new())
