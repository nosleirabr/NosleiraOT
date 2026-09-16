local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings, traveler |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'See you later.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'See you later.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I saved the women there once or twice.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a professional hero.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Avar Tar, slayer of monsters, saviour of princesses, and defender of the weak.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time right now.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Where the army fails a hero like me is needed.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I am on a quest for the Thaian king ... as usual, of course.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'I fought him serveral times, sometimes he killed me, sometimes I killed him, I would say we are even right now, but I am getting better and more powerful each day.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'ve seen it all and done it all ... at least twice.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'There is a great evil lurking beneath this isle ... and beneath the Plains of Havoc and in the ancient necropolis and beneath the Ghostlands ... well everywhere basically.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'If I had the time I would restore peace in this once proud city, but there\'s too much to do before I can start that quest.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I am sure it\'s hidden in a vault of the Nightmare Knights beneath the Plains of Havoc. I plan an expedition to go there and rout out the Ruthless Seven, but I have to save the world first.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

