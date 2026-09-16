local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome |PLAYERNAME|! Can I help you?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'music'}, StdModule.say, {npcHandler = npcHandler, text = 'I love the music of the elves.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I make instruments and sometimes I\'m wandering through the lands of Tibia as a bard.'})
keywordHandler:addKeyword({'bard'}, StdModule.say, {npcHandler = npcHandler, text = 'Selling instruments isn\'t enough to live on and I love music. That\'s why I wander through the lands from time to time.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I don\'t know what time it is.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Quero.'})
keywordHandler:addKeyword({'elf'}, StdModule.say, {npcHandler = npcHandler, text = 'They live in the northeast of Tibia.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'You can buy a lyre, lute, drum, and simple fanfare.'})
keywordHandler:addKeyword({'benjamin'}, StdModule.say, {npcHandler = npcHandler, text = 'He\'s nice.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'lute'}, 2950, 195, 'lute')
shopModule:addBuyableItem({'drum'}, 2952, 140, 'drum')
shopModule:addBuyableItem({'lyre'}, 2949, 120, 'lyre')
shopModule:addBuyableItem({'simple'}, 2954, 150, 'simple')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

