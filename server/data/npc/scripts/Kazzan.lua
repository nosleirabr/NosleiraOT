local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Feel welcome in the lands of the children of the enlightened Daraman, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May your soul flourish.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May your soul flourish.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the caliph of the children of Daraman.'})
keywordHandler:addKeyword({'caliph'}, StdModule.say, {npcHandler = npcHandler, text = 'A caliph is a leader of his people, just like a king.'})
keywordHandler:addKeyword({'fuck'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'The gods are powerful but it\'s ultimately up to us to work on our souls\' ascension.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Kazzan Ibn Gadral, caliph of Darama.'})
keywordHandler:addKeyword({'stupid'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'drefia'}, StdModule.say, {npcHandler = npcHandler, text = 'When the djinns destroyed the better part of the unholy town in their wrath, the brotherhood hid like worms in the sand.'})
keywordHandler:addKeyword({'quest'}, StdModule.say, {npcHandler = npcHandler, text = 'I will not entrust foreigners with any quest. Live amongst us for some years and listen to Daraman\'s teachings and we will see.'})
keywordHandler:addKeyword({'minotaur'}, StdModule.say, {npcHandler = npcHandler, text = 'The minotaurs are another test we have to endure. They inhabit the pyramid which is taboo for our people, as Daraman taught us.'})
keywordHandler:addKeyword({'brotherhood'}, StdModule.say, {npcHandler = npcHandler, text = 'The Brotherhood of Bones came here fleeing some war on the continent. They corrupted the settlers of the Thaian colony with ease.'})
keywordHandler:addKeyword({'asshole'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'Daraman led our ancestors to the continent Darashia to live a life of simplicity and meditation.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Tibianus is the shepherd of the lost souls of the so called Thaian empire.'})
keywordHandler:addKeyword({'kazordoon'}, StdModule.say, {npcHandler = npcHandler, text = 'We have lost contact with the dwarf people of Kazordoon.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t give much attention to rumours.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Our people are well prepared to fight for their land and their souls.'})
keywordHandler:addKeyword({'tyrant'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'enemies'}, StdModule.say, {npcHandler = npcHandler, text = 'The necromancers of Drefia fell under the wrath of the djinns once. If they challenge us again they might lose more than a city.'})
keywordHandler:addKeyword({'idiot'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'We keep in touch with the queen but did not take sides in the conflict of Carlin and Thais ... yet.'})
keywordHandler:addKeyword({'shit'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'taboo'}, StdModule.say, {npcHandler = npcHandler, text = 'Daraman knew our souls might get corupted by the things hidden there.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Once a djinn claimed to have seen it in a dream. I guess it\'s just that, some dream of a supernatural creature.'})
keywordHandler:addKeyword({'lunatic'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

