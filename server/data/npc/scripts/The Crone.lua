local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Be greeted, |PLAYERNAME|... mortal')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'tomb'}, StdModule.say, {npcHandler = npcHandler, text = 'Her tomb is sealed and can only be entered by a certain melody.'})
keywordHandler:addKeyword({'vashresamun'}, StdModule.say, {npcHandler = npcHandler, text = 'I mourn the dark day I was exiled from her tomb.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Once I was Vashresamun\'s favourite handmaiden. But I have fallen from her grace and now I am exiled from her tomb.'})
keywordHandler:addKeyword({'grace'}, StdModule.say, {npcHandler = npcHandler, text = 'Do not ask about that, mortal. Memories bring too much grief.'})
keywordHandler:addKeyword({'melody'}, StdModule.say, {npcHandler = npcHandler, text = 'Vashresamun erased the memory of the tune from my mind, I only remember its name: the secret of the rose garden.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t remember my name, neither my days as a mortal.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

