local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Salutations |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Farewell.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Farewell.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'We are watching their relations with Ab\'Denriel closely.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am ambassador of our beloved king, Tibianus III.'})
keywordHandler:addKeyword({'tibianus'}, StdModule.say, {npcHandler = npcHandler, text = 'Our beloved ruler seeks friendship and peace with the elves of Ab\'Dendriel.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Roderick of Thais, commoner.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask someone else.'})
keywordHandler:addKeyword({'olrik'}, StdModule.say, {npcHandler = npcHandler, text = 'He is my servant and responsible for the mail. I wish he would not spent so much time with elven ladies and work harder.'})
keywordHandler:addKeyword({'dwarfs'}, StdModule.say, {npcHandler = npcHandler, text = 'The dwarfs are verry dilligent and crafty people. Our contracts with kazordoon asure the best for both of our races.'})
keywordHandler:addKeyword({'abdaisim'}, StdModule.say, {npcHandler = npcHandler, text = 'Unfortunately I\'ve had no contact with them yet.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'A threat to all free races.'})
keywordHandler:addKeyword({'elves'}, StdModule.say, {npcHandler = npcHandler, text = 'Though there are differences, I am sure we can live in peace and harmony with that noble race.'})
keywordHandler:addKeyword({'troll'}, StdModule.say, {npcHandler = npcHandler, text = 'I heared about them working in the local mines. I am not sure if i like the concept of having such creatures within the walls of a city.'})
keywordHandler:addKeyword({'cenath'}, StdModule.say, {npcHandler = npcHandler, text = 'I look forward to improve our relations with them.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'We don\'t hear much at this place.'})
keywordHandler:addKeyword({'crunor'}, StdModule.say, {npcHandler = npcHandler, text = 'I am not familiar enough with the different faithes to discuss them properly.'})
keywordHandler:addKeyword({'humans'}, StdModule.say, {npcHandler = npcHandler, text = 'Though there are differences to other races, I am sure we can live in peace and harmony with them.'})
keywordHandler:addKeyword({'sorcerer'}, StdModule.say, {npcHandler = npcHandler, text = 'Perhaps Thaian sorcerers can teach the elves their magic in exchange for knowledge of that noble race.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'I am impressed by the magic the elves are able to wield. Many of them can cast and even teach spells.'})
keywordHandler:addKeyword({'teshial'}, StdModule.say, {npcHandler = npcHandler, text = 'They hardly seem more then an elven myth.'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'The tradesmen of venore show great interest in trade cotracts with the elves.'})
keywordHandler:addKeyword({'druid'}, StdModule.say, {npcHandler = npcHandler, text = 'The elven magic is somewhat similar to that of the druids.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'A nice myth but nothing more.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

