local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Ah, a visitor. Greetings |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Farewell.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Farewell.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time... it\'s running that fast when you are as old as me.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the Chief Huntsman of Thais.'})
keywordHandler:addKeyword({'gregor'}, StdModule.say, {npcHandler = npcHandler, text = 'Can you imagine this youngster handles a guild? Ah, come on.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Robin. Some call me Rob, others Woody.'})
keywordHandler:addKeyword({'harkath'}, StdModule.say, {npcHandler = npcHandler, text = 'Another one of a few friends of my youth who\'s still left.'})
keywordHandler:addKeyword({'bozo'}, StdModule.say, {npcHandler = npcHandler, text = 'Such guys don\'t live long. The grandfather of our king had a new jester every season.'})
keywordHandler:addKeyword({'baxter'}, StdModule.say, {npcHandler = npcHandler, text = 'I hardly know him.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'News? In the woods I learn nothing of importance to the world.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'These kids call themselves an army... In the old times we had a REAL army, I tell ya...'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'A misguided follower of evil.'})
keywordHandler:addKeyword({'marvik'}, StdModule.say, {npcHandler = npcHandler, text = 'Druids have their ways with nature, but they would rather cuddle a bear than hunting it.'})
keywordHandler:addKeyword({'elane'}, StdModule.say, {npcHandler = npcHandler, text = 'A master, or better mistress, of the bow. But with her big feet she just chases all game away.'})
keywordHandler:addKeyword({'sherry'}, StdModule.say, {npcHandler = npcHandler, text = 'The farmers are fine fellows.'})
keywordHandler:addKeyword({'quentin'}, StdModule.say, {npcHandler = npcHandler, text = 'My buddy Quentin is getting old, too. Things were different in our youth.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I am his Master of the Hunt as I was his father\'s Master of the Hunt.'})
keywordHandler:addKeyword({'muriel'}, StdModule.say, {npcHandler = npcHandler, text = 'These mages still give me shivers. I remember the first time this Ferumbras guy showed his ugly face here.'})
keywordHandler:addKeyword({'sam'}, StdModule.say, {npcHandler = npcHandler, text = 'I have not much use for heavy armor.'})
keywordHandler:addKeyword({'crunor'}, StdModule.say, {npcHandler = npcHandler, text = 'Crunor gives and takes. That is his way. As long as we don\'t hunt more then we need we are at balance with Crunor.'})
keywordHandler:addKeyword({'frodo'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, I love that hut. I liked it as it was Iwan\'s hut, I loved it as it was Pridence\'s hut, and I think I will never stop to love this place.'})
keywordHandler:addKeyword({'gorn'}, StdModule.say, {npcHandler = npcHandler, text = 'Sells a lot of useful stuff that guy. I rember the days when we were so poor that we could not afford anything the former owner offered.'})
keywordHandler:addKeyword({'lugri'}, StdModule.say, {npcHandler = npcHandler, text = 'Can you imagine his father was such a fine guy? A shame what his son has become.'})
keywordHandler:addKeyword({'oswald'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, what a charming young man. He\'s often here asking me about my youth and the people I met in my life.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t like swords in general.'})
keywordHandler:addKeyword({'lynda'}, StdModule.say, {npcHandler = npcHandler, text = 'So young and so beautiful! She makes even an old man as me... uhm... feel a bit younger again.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

