local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hey |PLAYERNAME|, what\'cha want?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Thanks and see ya.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Thanks and see ya.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m into sellin\' furniture. My grandfather was in that business, then my father, and so am I.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time is the current time now.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m Borkas Flersson, but let\'s not waste precious tradin\' time with smalltalk.'})
keywordHandler:addKeyword({'allen'}, StdModule.say, {npcHandler = npcHandler, text = 'Hes my boss but he likes to be one of us and sells some of his wares personally.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m selling containers here.'})
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = 'No prob.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'crate'}, 2471, 10, 'crate')
shopModule:addBuyableItem({'barrel'}, 2793, 12, 'barrel')
shopModule:addBuyableItem({'box'}, 2469, 10, 'box')
shopModule:addBuyableItem({'dresser'}, 2790, 25, 'dresser')
shopModule:addBuyableItem({'drawer'}, 2789, 18, 'drawer')
shopModule:addBuyableItem({'trough'}, 2792, 7, 'trough')
shopModule:addBuyableItem({'locker'}, 2791, 30, 'locker')
shopModule:addBuyableItem({'trunk'}, 2794, 10, 'trunk')
shopModule:addBuyableItem({'chest'}, 2472, 10, 'chest')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

