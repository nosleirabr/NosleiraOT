local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hiho! <mumbles>')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Yeah, bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Yeah, bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time right now.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of the emperor\'s personal bodyguards.'})
keywordHandler:addKeyword({'mines'}, StdModule.say, {npcHandler = npcHandler, text = 'The mines aren\'t meant for foreigners. The miners there have enough troubles.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Tulf Beardweaver, son of Earth, from the Dragoneaters.'})
keywordHandler:addKeyword({'trouble'}, StdModule.say, {npcHandler = npcHandler, text = 'The mines are raided again and again by the bandits of the Horned Fox.'})
keywordHandler:addKeyword({'dwarfs'}, StdModule.say, {npcHandler = npcHandler, text = 'If you go to a dwarfs\' city, do as the dwarfs do.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'I despise the habit to challenge the prisoners of Dwarcatra or provoke the boys in the mines.'})
keywordHandler:addKeyword({'bodyguard'}, StdModule.say, {npcHandler = npcHandler, text = 'We keep up law and order here, though the boys would rather need some practice like taking care for the trouble in the mines.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'I doubt anyone can make it through our lines of defense.'})
keywordHandler:addKeyword({'lair'}, StdModule.say, {npcHandler = npcHandler, text = 'The lair of the Horned Fox is surely well guarded and even better hidden.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I am on duty!'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

