local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Ahhh, welcome |PLAYERNAME|! Say, have you already heard the latest news about the seamonster, Aneus, or the rumours in this area?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye and come again for another small talk! *waves with her hand at you*')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye and come again for another small talk! *waves with her hand at you*')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m Bruno\'s wife. Besides: Have you already heard the latest news about the seamonster, Aneus, or the rumours in this area?'})
keywordHandler:addKeyword({'aneus'}, StdModule.say, {npcHandler = npcHandler, text = 'A very nice person. He has a great story to tell with big fights and much magic. Just ask him for his story. ...'})
keywordHandler:addKeyword({'seamonster'}, StdModule.say, {npcHandler = npcHandler, text = 'Only some days ago I was at the docks late in the night and was looking for my husband\'s ship when suddenly a known noise appeared near the docks. ...'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Marlene.'})
keywordHandler:addKeyword({'rumour'}, StdModule.say, {npcHandler = npcHandler, text = 'Well, I heard about evil beings living in a dungeon below us. So once I tried to find them and went down the hole far to the southwest. ...'})
keywordHandler:addKeyword({'graubart'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, old Graubart. A very nice person. But he is strange. He always is busy when I want to talk to him. *lost in thoughts*'})
keywordHandler:addKeyword({'bruno'}, StdModule.say, {npcHandler = npcHandler, text = 'Bruno is a wonderful husband. But he is seldom at home. *looks a little bit sad*'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

