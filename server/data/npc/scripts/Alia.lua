local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome |PLAYERNAME|! Welcome to the temple of Carlin.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May the gods be with you, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May the gods be with you, |PLAYERNAME|!')
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'They created Tibia and all life on it.'})
keywordHandler:addKeyword({'pilgrimage'}, StdModule.say, {npcHandler = npcHandler, text = 'Whenever you receive a lethal wound your lifeforce is damaged. With every single of the five blessings you have this damage will be reduced.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Alia.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now, it is the current time. Ask Gorn for a watch, if you need one.'})
keywordHandler:addKeyword({'embrace'}, StdModule.say, {npcHandler = npcHandler, text = 'The druids north of Carlin can provide you with the embrace of tibia.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t mention this name here.'})
keywordHandler:addKeyword({'ghostlands'}, StdModule.say, {npcHandler = npcHandler, text = 'Uh, don\'t ask. Thats a place even the brave women of carlin don\'t dare to explore them!!!'})
keywordHandler:addKeyword({'spark'}, StdModule.say, {npcHandler = npcHandler, text = 'The spark of the phoenix is given by the dwarven priests of earth and fire in Kazordoon.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'That\'s where we are. The world Tibia.'})
keywordHandler:addKeyword({'blessing'}, StdModule.say, {npcHandler = npcHandler, text = 'There are five different blessings available in five sacred places. These blessings are: the spiritual shielding, the spark of the phoenix, the embrace of tibia, the fire of the suns and the wisdom of solitude.'})
keywordHandler:addKeyword({'wisdom'}, StdModule.say, {npcHandler = npcHandler, text = 'Talk to the hermit Eremo on the isle of Cormaya about this blessing.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m a nun, serving the gods of Tibia in this temple. I also heal wounded adventurers.'})
keywordHandler:addKeyword({'spiritual'}, StdModule.say, {npcHandler = npcHandler, text = 'You can receive the spiritual shielding in the whiteflower temple south of Thais.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I can\'t help you with that.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

