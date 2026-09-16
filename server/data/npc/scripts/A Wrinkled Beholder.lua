local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'What is this? An optically challenged entity called |PLAYERNAME|. How fascinating!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Wait right there. I will eat you after writing down what I found out.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Wait right there. I will eat you after writing down what I found out.')
keywordHandler:addKeyword({'minotaurs'}, StdModule.say, {npcHandler = npcHandler, text = 'Their mages are so close to the truth. Closer then they know and closer then it\'s good for them.'})
keywordHandler:addKeyword({'library'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a fine library, isn\'t it?'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'They will mourn the day they abandoned us.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am 486486 and NOT \'Blinky\' as some people called me ... before they died.'})
keywordHandler:addKeyword({'cyclops'}, StdModule.say, {npcHandler = npcHandler, text = 'Uglyness incarnate. One eye! Imagine that! Horrible!'})
keywordHandler:addKeyword({'blinky'}, StdModule.say, {npcHandler = npcHandler, text = 'How interesting you are that stupid. Let me apply this on you and see how long you last'})
keywordHandler:addKeyword({'death'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes, yes, I will kill you soon enough, now let me continue my investigation on you.'})
keywordHandler:addKeyword({'books'}, StdModule.say, {npcHandler = npcHandler, text = 'Our books are written in 469, of course you can\'t understand them.'})
keywordHandler:addKeyword({'elves'}, StdModule.say, {npcHandler = npcHandler, text = 'These fools and their superstitious life cult don\'t understand anything of importance.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s 1, not \'Tibia\', silly.'})
keywordHandler:addKeyword({'orcs'}, StdModule.say, {npcHandler = npcHandler, text = 'Noisy pests.'})
keywordHandler:addKeyword({'469'}, StdModule.say, {npcHandler = npcHandler, text = 'The language of my kind. Superior to any other language and only to be spoken by entities with enough eyes to blink it.'})
keywordHandler:addKeyword({'humans'}, StdModule.say, {npcHandler = npcHandler, text = 'Good tools to work with ... After their death, that is.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the great librarian.'})
keywordHandler:addKeyword({'numbers'}, StdModule.say, {npcHandler = npcHandler, text = 'Numbers are essential. They are the secret behind the scenes. If you are a master of mathematics you are a master over life and death.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Only inferior species need weapons.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

