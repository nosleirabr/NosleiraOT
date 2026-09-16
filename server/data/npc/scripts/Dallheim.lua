local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, '<nods silently>')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'No idea.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a follower of Banor.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'Dallheim.'})
keywordHandler:addKeyword({'hyacinth'}, StdModule.say, {npcHandler = npcHandler, text = 'Strange Fellow, hides somewhere in the mountains of the isle.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell nothing.'})
keywordHandler:addKeyword({'amber'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t trust her.'})
keywordHandler:addKeyword({'willie'}, StdModule.say, {npcHandler = npcHandler, text = 'A fine cook and farmer he is.'})
keywordHandler:addKeyword({'sewer'}, StdModule.say, {npcHandler = npcHandler, text = 'In the sewers there are some rats, fine targets for young heroes.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'Not interested in such party tricks.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'A nice place for a hero, but nothing for whelps.'})
keywordHandler:addKeyword({'wilderness'}, StdModule.say, {npcHandler = npcHandler, text = 'There are wolves, bears, snakes, deers, and spiders. You can find some dungeon entrances there, too.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Dungeons are dangerous, be prepared.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'HAIL TO THE KING!'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'I will crush all monsters who dare to attack our base.'})
keywordHandler:addKeyword({'banor'}, StdModule.say, {npcHandler = npcHandler, text = 'The great one! Read books to learn about him.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'With my spikesword I slice even a cyclops in pieces.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the bridgeguard. I defend Rookgaard against the beasts from the wilderness and the dungeons!'})
keywordHandler:addKeyword({'seymour'}, StdModule.say, {npcHandler = npcHandler, text = 'Leave me alone with this whimp.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I have to stay here, sorry, but I can heal you if you are wounded.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

