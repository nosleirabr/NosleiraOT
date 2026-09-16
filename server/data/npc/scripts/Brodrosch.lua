local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|! May Earth protect you, even whilst sailing!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Earth under your feet ... it\'s still better than lava.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Earth under your feet ... it\'s still better than lava.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Look at my blackened beard? I\'m the steamship captain!'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Brodrosch Steamtrousers, son of the machine, of the Molten Rock.'})
keywordHandler:addKeyword({'beer'}, StdModule.say, {npcHandler = npcHandler, text = 'Sometimes being drunk means seeing two rivers. I survive by steering right between them.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'Of course, I am the captain. But I am also a technomancer.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'This is not a shop, damn it!'})
keywordHandler:addKeyword({'ship'}, StdModule.say, {npcHandler = npcHandler, text = 'This is a great ship. Ha! It works without wind but with fire, and it travels not on the ocean but beneath the earth!'})
keywordHandler:addKeyword({'inventors'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes. There could have been thousands of our inventions, if they wouldn\'t explode all the time...'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Tibia? Just don\'t ask.'})
keywordHandler:addKeyword({'kazordoon'}, StdModule.say, {npcHandler = npcHandler, text = 'Hey, we ARE at Kazordoon! Must be the cavemadness...'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'This is a steamship that travels only subterreneanly. No way to get on that risky ocean. Kazordoon - Cormaya only.'})
keywordHandler:addKeyword({'gurbasch'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, my brother in Cormaya. He can take you back.'})
keywordHandler:addKeyword({'dwarf'}, StdModule.say, {npcHandler = npcHandler, text = 'Deep inside, we\'re all dwarfs.'})
keywordHandler:addKeyword({'technomancer'}, StdModule.say, {npcHandler = npcHandler, text = 'Being a technomancer is a privilege few dwarfs have. We form earth and fire through powerful technology into tools. Also, we are great inventors.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


