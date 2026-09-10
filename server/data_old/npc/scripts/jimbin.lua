local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Talking to me, |PLAYERNAME|?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Come back if you enjoyed my tavern, if not ... well, get eaten by a dragon, jawoll.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Come back if you enjoyed my tavern, if not ... well, get eaten by a dragon, jawoll.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is about the current time.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m runing the Jolly Axeman together with my wife Maryza.'})
keywordHandler:addKeyword({'book'}, StdModule.say, {npcHandler = npcHandler, text = 'The cookbook? It belongs to maryza. I think she has a few copies for sale.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Jimbin Luckythroat, son of Earth, from the Molten Rock.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask my wife Maryza for food.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'I supply the army with dwarfish beer to keep morals high.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Hah! He never dares to trespass our realm.'})
keywordHandler:addKeyword({'maryza'}, StdModule.say, {npcHandler = npcHandler, text = 'She\'s a fine cook; likes it bloddy, though. Humans call her Bloody Mary, but don\'t mention that to her if you\'re smart.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'The Tibia our race was born into was even more fierce than the world you young ones know.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Silly town. Alcohol is forbidden there and elves visit this town quite often, what certainly suggests nothing good about a town, jawoll.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'The king orders huge amounts of mushroombeer for festivities.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh well, many hidden places of ancient times appear seemingly out of nowhere in these times.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Bah! Humans, can\'t stand a drink, jawoll.'})
keywordHandler:addKeyword({'general'}, StdModule.say, {npcHandler = npcHandler, text = 'The general is a fine man. Can drink as much as he wants and still is sober.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you beer ... or water if you are sick.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Actually I belive it\'s more than a taverntale.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'beer'}, 2880, 2, 'beer')

npcHandler:addModule(FocusModule:new())

