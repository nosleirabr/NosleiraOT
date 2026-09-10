local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye bye <hicks>.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye bye <hicks>.')
keywordHandler:addKeyword({'karl'}, StdModule.say, {npcHandler = npcHandler, text = 'A good guy with <hicks> good beer.'})
keywordHandler:addKeyword({'refuge'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes, refuge from <hicks> womanhood.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I forgot <hicks> what a job I have.'})
keywordHandler:addKeyword({'sewer'}, StdModule.say, {npcHandler = npcHandler, text = 'The sewers are our last refuge.'})
keywordHandler:addKeyword({'todd'}, StdModule.say, {npcHandler = npcHandler, text = 'In Todd we trust! TODD! TODD! TODD!'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Its precisely <hicks> after <hicks>.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My Name? Uh... Wait! \'Bring down the trash, William you...\' William, my name is William!'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I whish I\'d live in Thais, the city of alcohol.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I need another drink, then I\'ll help you. Promise.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'Hey! Thats my drink, buy your own!'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

