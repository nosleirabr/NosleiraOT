local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|, wanderer between the worlds.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'See you again ... sooner or later, more or less alive.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'See you again ... sooner or later, more or less alive.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time now, but the true question is: How much time is left?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I consider myself as a guide, a guardian over the souls who transcend the border to another world.'})
keywordHandler:addKeyword({'body'}, StdModule.say, {npcHandler = npcHandler, text = 'Is the mind an emination of body, or the body an invention by the mind?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'What is a name worth in your eyes? And more important: Does the choice of your name decide your further fate? Perhaps we will never know.'})
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = '\'Thank you\' ... Words I rarely here these days. Tell me when I might be of service again, |PLAYERNAME|.'})
keywordHandler:addKeyword({'death'}, StdModule.say, {npcHandler = npcHandler, text = 'What else does it mean than the loss of your weak physical shell? And isn\'t the true power in the universe rather mental than physical?'})
keywordHandler:addKeyword({'crematory'}, StdModule.say, {npcHandler = npcHandler, text = 'Such an ugly word for this wonderful place. It is a door, a portal to a better world than this one is.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I am offering vases and amphoras, the perfect vessel for dusty remains of whatever sort.'})
keywordHandler:addKeyword({'fire'}, StdModule.say, {npcHandler = npcHandler, text = 'The purging force of the fire ... after having been purified, the freed souls will depart with the smoke.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Kings, queens ... I\'ve seen them come and go. Everything fades, even the glory and wealth of the richest.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh yes, monsters can grant you a passage to the afterlife also, but it\'s not a comfortable trip. <chuckles>'})
keywordHandler:addKeyword({'soul'}, StdModule.say, {npcHandler = npcHandler, text = 'The essence of life. Source of your very self. While the body is in space and time, the soul exists in time only.'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'You come to this world naked, and leave it this way, so there\'s no need to hold back your money, especially not in a place like Venore.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'What help might I offer you except guidance? Would you like me to help you transcend the border to the afterlife?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'amphora'}, 2893, 4, 'amphora')
shopModule:addBuyableItem({'vase'}, 2876, 3, 'vase')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

