local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hi there, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, now that you mention it: I have much left to do, please excuse me.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'I pray to Crunor to bless our harvests.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Tokel.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you looking for food? I have bread, cheese, ham, and meat.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell some food.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'I know nothing but about such stuff.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'I have not seen much of it yet. I am thinking about moving to Edron soon.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you bread, cheese, ham, or meat.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Here are no dungeons as far as I know.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I wish I\'d be as rich as him.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s relatively peaceful here.'})
keywordHandler:addKeyword({'greenshore'}, StdModule.say, {npcHandler = npcHandler, text = 'The soil is a bit dry and there are a lot of stones. It\'s very hard to work this soil.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'The city is too lousy and crowded for my taste.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a farmer, and proud of it.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'They say life is easy there, the soil is rich, the city save. One day I might move there.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I have no idea how to help you.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'ham'}, 3582, 8, 'ham')
shopModule:addBuyableItem({'meat'}, 3577, 5, 'meat')
shopModule:addBuyableItem({'cheese'}, 3607, 5, 'cheese')
shopModule:addBuyableItem({'bread'}, 3600, 3, 'bread')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

