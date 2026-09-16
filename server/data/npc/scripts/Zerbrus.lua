local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings young traveller.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'My duty is eternal. Time is of no importance.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a follower of Banor.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'Zerbrus at your service.'})
keywordHandler:addKeyword({'hyacinth'}, StdModule.say, {npcHandler = npcHandler, text = 'One of theese reclusive druids.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask the shopowners for their wares.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'In the world of tibia many challenges await the brave adventurers.'})
keywordHandler:addKeyword({'amber'}, StdModule.say, {npcHandler = npcHandler, text = 'Shes verry attractive. To bad my duty leaves me no time to date her.'})
keywordHandler:addKeyword({'willie'}, StdModule.say, {npcHandler = npcHandler, text = 'He can swear and curse as good as the rowdyest seaman I met.'})
keywordHandler:addKeyword({'sewer'}, StdModule.say, {npcHandler = npcHandler, text = 'In the sewers are crowded with rats. They make fine targets for young heroes.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'You will learn about magic soon enough.'})
keywordHandler:addKeyword({'dallheim'}, StdModule.say, {npcHandler = npcHandler, text = 'He does a fine job.'})
keywordHandler:addKeyword({'wilderness'}, StdModule.say, {npcHandler = npcHandler, text = 'There are wolves, bears, snakes, deers, and spiders. You can find some dungeon entrances there, too.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Dungeons are dangerous, be prepared.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'HAIL TO THE KING!'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'I will slay all monsters who dare to attack this little town.'})
keywordHandler:addKeyword({'banor'}, StdModule.say, {npcHandler = npcHandler, text = 'The heavenly warrior! Read books to learn about him.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'My weapon is property of the royal army. Find your own one.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the bridgeguard. I defend Rookgaard against the beasts of the wilderness and the dungeons!'})
keywordHandler:addKeyword({'seymour'}, StdModule.say, {npcHandler = npcHandler, text = 'His job to teach the young heroes is important for our all survival.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I have to stay here, sorry, but I can heal you if you are wounded.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

