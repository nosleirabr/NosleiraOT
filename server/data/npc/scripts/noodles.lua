local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Woof! <wiggle>')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Woof! <wiggle>')
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Meeep! Meeep!'})
keywordHandler:addKeyword({'bo'}, StdModule.say, {npcHandler = npcHandler, text = '<wiggle>'})
keywordHandler:addKeyword({'th'}, StdModule.say, {npcHandler = npcHandler, text = '<sniff>'})
keywordHandler:addKeyword({'an'}, StdModule.say, {npcHandler = npcHandler, text = 'Grrrr!'})
keywordHandler:addKeyword({'ar'}, StdModule.say, {npcHandler = npcHandler, text = 'Woof!'})
keywordHandler:addKeyword({'go'}, StdModule.say, {npcHandler = npcHandler, text = 'Woof! Woof!'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

