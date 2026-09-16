local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Until next time.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Until next time.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'As should be quite obvious, I am operating a steamship.'})
keywordHandler:addKeyword({'brodrosch'}, StdModule.say, {npcHandler = npcHandler, text = 'He is my brother working the Kazordoon steamship.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Gurbasch Firejuggler, son of the machine, of the Molten Rock.'})
keywordHandler:addKeyword({'beer'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, you got some? Nah, beer only tastes fine in Kazordoon. If you have brought it from there, it tastes foul now, I guess.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'Captain'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'I am not a vendor.'})
keywordHandler:addKeyword({'ship'}, StdModule.say, {npcHandler = npcHandler, text = 'It is indeed something we dwarfs may be proud of: a ship operating by steam power.'})
keywordHandler:addKeyword({'inventors'}, StdModule.say, {npcHandler = npcHandler, text = 'You know, elves may be intelligent, but they are too lazy to invent. Really.'})
keywordHandler:addKeyword({'elves'}, StdModule.say, {npcHandler = npcHandler, text = 'Have one elf onboard a ship, and you are doomed.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Tibia? Just don\'t ask.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'How do you expect me to go there? Fly? Hm, wait... no, sorry.'})
keywordHandler:addKeyword({'cormaya'}, StdModule.say, {npcHandler = npcHandler, text = 'Hey, we ARE at Cormaya! Must be the cavemadness...'})
keywordHandler:addKeyword({'dwarf'}, StdModule.say, {npcHandler = npcHandler, text = 'We are an old and proud race, although we posess the best inventions.'})
keywordHandler:addKeyword({'technomancer'}, StdModule.say, {npcHandler = npcHandler, text = 'A technomancer wields power over incredible machines, as his knowledge is his magic.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)


addTravelKeyword(keywordHandler, npcHandler, 'kazordoon', 160, TravelHarbours.steamKazordoon, 'Kazordoon')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


