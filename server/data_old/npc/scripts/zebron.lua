local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings, high roller. So you care for a game, |PLAYERNAME|?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Hey, you can\'t leave. Luck is smiling on you. I can feel it!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Hey, you can\'t leave. Luck is smiling on you. I can feel it!')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is exactly the current time.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, I am just sitting around here and gamble now and then.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as Zebron.'})
keywordHandler:addKeyword({'tavern'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a fine place to be around, isn\'t it?'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Hehe, they spent a good part of their salary here in the tavern.'})
keywordHandler:addKeyword({'licence'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care much for that law stuff, but as far as I know those Venore merchants got a royal gambling licence for the city.'})
keywordHandler:addKeyword({'gambl'}, StdModule.say, {npcHandler = npcHandler, text = 'So you care for a civilized game of dice?'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'What would I need more than that what I can get right here?'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Carlin, the beerless ... what a shame.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, our beloved king! Bless him for the gambling licence of Venore.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Bah, always the same chitchat. Swampelves this and amazons that ... blah blah.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is a bit too conservative for me.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'I had a cousin named hugo, why do you ask?'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'Aaaah, Venore, Venore, what a wonderful town. Especially for someone with love for gambling like me.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I would not bet that anyone will ever find it.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

