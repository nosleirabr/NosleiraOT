local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello, mourned pilgrim. How may I help you |PLAYERNAME|?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'It was an honour to serve you.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'It was an honour to serve you.')
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'It does not befit a member of my position to spread rumours and stories, pilgrim.'})
keywordHandler:addKeyword({'headquarters'}, StdModule.say, {npcHandler = npcHandler, text = 'You can find them to the south of the dwarven city of Kazordoon.'})
keywordHandler:addKeyword({'ascension'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, but you should discuss religous issues like these in the temple. I am not a priest, and there is little I can tell you about it.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Jakahr.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'The time is the current time, pilgrim.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Carlin is a city far, far away from here. They say it is run by women and druids.'})
keywordHandler:addKeyword({'ankrahmun'}, StdModule.say, {npcHandler = npcHandler, text = 'This city is a safe haven that protects its citizens from the dangers of the desert.'})
keywordHandler:addKeyword({'depot'}, StdModule.say, {npcHandler = npcHandler, text = 'The depots are easy to use. Just open a locker to find your items there.'})
keywordHandler:addKeyword({'temple'}, StdModule.say, {npcHandler = npcHandler, text = 'The temple is to the east of the city.'})
keywordHandler:addKeyword({'office'}, StdModule.say, {npcHandler = npcHandler, text = 'I am always here in my office. You are welcome to visit me anytime.'})
keywordHandler:addKeyword({'kevin'}, StdModule.say, {npcHandler = npcHandler, text = 'Even in our lands the name of the guildmaster is held in great respect.'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'As far as I can tell he was some philosopher.'})
keywordHandler:addKeyword({'palace'}, StdModule.say, {npcHandler = npcHandler, text = 'You can\'t miss the palace. It is probably the biggest pyramid in the whole world.'})
keywordHandler:addKeyword({'arena'}, StdModule.say, {npcHandler = npcHandler, text = 'Fights are frequently staged in the arena to entertain the people.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is the capital of a kingdom on a far-off continent.'})
keywordHandler:addKeyword({'darashia'}, StdModule.say, {npcHandler = npcHandler, text = 'A minor settlement to the north.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a member of the Postmasters Guild. If you have questions about the Royal Tibia Mail System or the depots, ask me.'})
keywordHandler:addKeyword({'pharaoh'}, StdModule.say, {npcHandler = npcHandler, text = 'The pharaoh keeps this city safe. He is both our political and our spiritual leader.'})
keywordHandler:addKeyword({'join'}, StdModule.say, {npcHandler = npcHandler, text = 'Please travel to our headquarters if you wish to join our guild.'})
keywordHandler:addKeyword({'darama'}, StdModule.say, {npcHandler = npcHandler, text = 'On this continent, the only place of real importance is our city.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'A weapon of legend. We rarely hear stories about it around here, however.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

