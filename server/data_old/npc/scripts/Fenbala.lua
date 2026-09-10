local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'LONG LIVE THE QUEEN! You may leave now!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'LONG LIVE THE QUEEN! You may leave now!')
keywordHandler:addKeyword({'shit'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'lunatic'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'stupid'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'tyrant'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'fuck'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'idiot'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})
keywordHandler:addKeyword({'asshole'}, StdModule.say, {npcHandler = npcHandler, text = 'Take this!'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

