local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hi there |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'I am too poor to afford a watch.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'May Crunor bless our harvests.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'James.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you looking for food? I have bread, cheese, ham, meat, and apples.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell some food.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you bread, cheese, ham, meat, and apples.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'I am nothing but a humble farmer and know nothing about that.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'If I were you, I would stay here.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'I stay away from dungeons as far as I can.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I never saw him in person.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'There are dangerous monsters and renegade knights in the northwest behind the river and the mountain.'})
keywordHandler:addKeyword({'academy'}, StdModule.say, {npcHandler = npcHandler, text = 'The mages and druids have quite an appetite. They buy much from me and summon even more food.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'I was born in Thais, but my family moved to Edron among the first settlers.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a humble farmer.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, can\'t offer you any help.'})
keywordHandler:addKeyword({'daniel'}, StdModule.say, {npcHandler = npcHandler, text = 'A brave warrior as far as a farmer like me can tell.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'ham'}, 3582, 8, 'ham')
shopModule:addBuyableItem({'meat'}, 3577, 5, 'meat')
shopModule:addBuyableItem({'cheese'}, 3607, 5, 'cheese')
shopModule:addBuyableItem({'apple'}, 3585, 3, 'apple')
shopModule:addBuyableItem({'bread'}, 3600, 3, 'bread')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

