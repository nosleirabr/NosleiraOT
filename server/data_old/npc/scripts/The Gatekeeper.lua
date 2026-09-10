local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'CHILD! COME BACK WHEN YOU HAVE GROWN UP!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'COME BACK WHEN YOU ARE PREPARED TO FACE YOUR DESTINY!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'COME BACK WHEN YOU ARE PREPARED TO FACE YOUR DESTINY!')
keywordHandler:addKeyword({'yes'}, StdModule.say, {npcHandler = npcHandler, text = 'YOU ARE NOT WORTHY!'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

