local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, '|PLAYERNAME|! HEHEHEHE! Another fool! Excellent!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'HEHEHE! I knew you don\'t have the stomach.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'HEHEHE! I knew you don\'t have the stomach.')
keywordHandler:addKeyword({'tower'}, StdModule.say, {npcHandler = npcHandler, text = 'This tower, of course, silly one. It holds my master\'s treasure.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the guardian of the paradox tower.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the age of the talon.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as the riddler. That is all you need to know.'})
keywordHandler:addKeyword({'key'}, StdModule.say, {npcHandler = npcHandler, text = 'The key of this tower! You will never find it! A malicious plant spirit is guarding it!'})
keywordHandler:addKeyword({'master'}, StdModule.say, {npcHandler = npcHandler, text = 'His name is none of your business.'})
keywordHandler:addKeyword({'guard'}, StdModule.say, {npcHandler = npcHandler, text = 'I am guarding the treasures of the tower. Only those who pass the test of the three sigils may pass.'})
keywordHandler:addKeyword({'test'}, StdModule.say, {npcHandler = npcHandler, text = 'Death awaits those who fail the test of the three seals! Do you really want me to test you?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

