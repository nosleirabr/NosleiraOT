local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Hugo, chief designer of Venore."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I sell finest clothes and tailor dresses."})
keywordHandler:addKeyword({'clothes'}, StdModule.say, {npcHandler = npcHandler, text = "Ah, you need some fashion? Look at my fabulous pieces!"})
keywordHandler:addKeyword({'fashion'}, StdModule.say, {npcHandler = npcHandler, text = "Fashion is everything in Venore!"})

npcHandler:setMessage(MESSAGE_GREET, "Oh, a customer! Greetings, |PLAYERNAME|. Need some {fashion}?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye, darling.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye, darling.")

npcHandler:addModule(FocusModule:new())
