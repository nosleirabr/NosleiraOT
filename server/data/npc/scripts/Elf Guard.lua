local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Ashari |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Asha Thrazi.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Asha Thrazi.')
keywordHandler:addKeyword({'kuridai'}, StdModule.say, {npcHandler = npcHandler, text = 'The Kuridai are the smiths and craftsmen. Look for them in the underground parts of the city.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a guardian of this town. I have no time to chat!'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is unimportant, only my duty does matter.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask some Deraisim where you can get food.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'This city of humankind is located to the west of our area.'})
keywordHandler:addKeyword({'abdaisim'}, StdModule.say, {npcHandler = npcHandler, text = 'The Abdaisim are wanderers. Since they live as nomads and travel the world you won\'t find them here.'})
keywordHandler:addKeyword({'elf'}, StdModule.say, {npcHandler = npcHandler, text = 'The elves of this city are the casts of the Cenath, the Kuridai, and the Deraisim.'})
keywordHandler:addKeyword({'town'}, StdModule.say, {npcHandler = npcHandler, text = 'This is the elven town of Ab\'Dendriel.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'He is not allowed to enter this city.'})
keywordHandler:addKeyword({'cenath'}, StdModule.say, {npcHandler = npcHandler, text = 'The Cenath are magic users. Look for them on the upper levels of the town.'})
keywordHandler:addKeyword({'kazordoon'}, StdModule.say, {npcHandler = npcHandler, text = 'The dwarfish settlement is hidden somewhere in the mountains in the south.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Such a thing is a human concept. We have no need for that, though some Kuridai might think otherwise.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'The city of the humans lies somewhere far to the south beyond the mountains of the dwarfs.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask around in Ab\'Dendriel. Many elves can teach you something about magic. The Cenath love magic most of all.'})
keywordHandler:addKeyword({'teshial'}, StdModule.say, {npcHandler = npcHandler, text = 'There are no Teshial.'})
keywordHandler:addKeyword({'deraisim'}, StdModule.say, {npcHandler = npcHandler, text = 'The Deraisim are scouts and hunters. You may find them on the groundlevel of the city.'})
keywordHandler:addKeyword({'armor'}, StdModule.say, {npcHandler = npcHandler, text = 'If you are looking for that kind of equipment you should ask a Kuridai.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

