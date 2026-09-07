local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Daraman\'s blessings, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Daraman\'s blessings, traveller.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Daraman\'s blessings, traveller.')
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'I was there once to learn about their ways. Needless to say I was horrified and returned to Darashia as soon as possible.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am nothing but a humble fletcher. I am selling bows, crossbows, and ammunition. Do you need any of these?'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'You surely can buy a watch somewhere on this bazaar.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Edoch Ibn Ibrach.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'The world is vast and dangerous. Better prepare yourself with a bow before you travel out there.'})
keywordHandler:addKeyword({'ammo'}, StdModule.say, {npcHandler = npcHandler, text = 'Do you need arrows for a bow, or bolts for a crossbow?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'arrow'}, 3447, 2, 'arrow')
shopModule:addBuyableItem({'bow'}, 3350, 400, 'bow')
shopModule:addBuyableItem({'crossbow'}, 3349, 500, 'crossbow')
shopModule:addBuyableItem({'bolt'}, 3446, 3, 'bolt')

npcHandler:addModule(FocusModule:new())

