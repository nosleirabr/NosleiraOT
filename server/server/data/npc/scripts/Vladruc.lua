local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'I am Vladruc Urghain and welcome you, |PLAYERNAME|, to my house.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Go safely, and leave something of the happiness you bring!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Go safely, and leave something of the happiness you bring!')
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = 'That\'s nothing worth to be mentioned.'})
keywordHandler:addKeyword({'coffin'}, StdModule.say, {npcHandler = npcHandler, text = 'The final restingplace for all of us, isn\'t it?'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'Please check my humble market downstairs for the wares that are offered.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'You think he is of ancient evil? Little you know about ancientness or evilness.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a reclusive person and learn little of the local gossip of the peasants.'})
keywordHandler:addKeyword({'blood'}, StdModule.say, {npcHandler = npcHandler, text = 'I like blood ... only the color, that is, of course ... <chuckles>'})
keywordHandler:addKeyword({'spells'}, StdModule.say, {npcHandler = npcHandler, text = 'I know a spell or two. You might want to buy some spells downstairs in the market.'})
keywordHandler:addKeyword({'vampire'}, StdModule.say, {npcHandler = npcHandler, text = 'Please don\'t talk about such creatures. You are scaring me.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a humble merchant of little importance to the beautiful Venore.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I am sorry, but I can\'t be of much assistance to you.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'A terrifying weapon if it does exist at all.'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'Our ways are not your ways, and there shall be to you many strange things.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Sadly only through books I have come to know your great Thais, and to know her is to love her.'})
keywordHandler:addKeyword({'shop'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, feel free to browse and buy in my humble shop below.'})
keywordHandler:addKeyword({'Tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'What a wonderful world we do live in ... so full of life.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I am of noble blood myself. I have been so long master that none other should be master of me.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'The Thaian garrsion serves its purpose very well.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time.'})
keywordHandler:addKeyword({'alchemy'}, StdModule.say, {npcHandler = npcHandler, text = 'You can buy some potions downstairs.'})
keywordHandler:addKeyword({'undead'}, StdModule.say, {npcHandler = npcHandler, text = 'It is not dead, which can eternal lie, and in strange aeons, even death may die.'})
keywordHandler:addKeyword({'adventure'}, StdModule.say, {npcHandler = npcHandler, text = 'The time I sought out adventure is long gone indeed.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'Magic is a tool to be mastered.'})
keywordHandler:addKeyword({'necroman'}, StdModule.say, {npcHandler = npcHandler, text = 'Death is the final frontier. Necromancers boldly go, where no one has gone before.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh yes, the children of the night ... you dwellers in the city cannot enter into the feelings of the hunter.'})
keywordHandler:addKeyword({'books'}, StdModule.say, {npcHandler = npcHandler, text = 'These companions have been good friends and teachers to me.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Vladruc Urghain. Welcome to my house!'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Such lovely places, unjustly shunned by the people.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

