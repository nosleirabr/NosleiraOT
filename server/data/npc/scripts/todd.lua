local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Yes, goodbye, just leave me alone.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Yes, goodbye, just leave me alone.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I never was there. Now leave me alone.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am... a traveller.'})
keywordHandler:addKeyword({'smuggler'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a honest person and don\'t like to be insulted!'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My Name? I am To... ahm... hum... My name is Hugo.'})
keywordHandler:addKeyword({'head'}, StdModule.say, {npcHandler = npcHandler, text = 'Uhhh Ohhhh one of the beers yesterday must have been bad.'})
keywordHandler:addKeyword({'resistance'}, StdModule.say, {npcHandler = npcHandler, text = 'Resistance is futile... uhm... I wonder where I picked that saying up. Oh my head...'})
keywordHandler:addKeyword({'money'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t know anything about money, missing or not.'})
keywordHandler:addKeyword({'william'}, StdModule.say, {npcHandler = npcHandler, text = 'Thats a common name, perhaps I met a William, not sure about that.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'I love that city.'})
keywordHandler:addKeyword({'Hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes, thats my name of course.'})
keywordHandler:addKeyword({'karl'}, StdModule.say, {npcHandler = npcHandler, text = 'Uhm, never heared about him... and you can\'t proof otherwise.'})
keywordHandler:addKeyword({'todd'}, StdModule.say, {npcHandler = npcHandler, text = 'Uh .. I... I met a Todd on the road. He told me he was traveling to Venore, look there for your Todd.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

