local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Oh, please come in. What do you need?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t bother me. Go and buy a watch.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the fletcher of Carlin. I am selling bows, crossbows, and ammunition. Do you need anything?'})
keywordHandler:addKeyword({'ghostlands'}, StdModule.say, {npcHandler = npcHandler, text = 'I was there ... once. I got out before the illusions drove me mad. Better stay out of that area!'})
keywordHandler:addKeyword({'marksman'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a paladin and the best marksman in the land.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Perac, fletcher and marksman extraordinaire.'})
keywordHandler:addKeyword({'ammo'}, StdModule.say, {npcHandler = npcHandler, text = 'Do you need arrows for a bow or bolts for a crossbow?'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I am selling bows, crossbows, and ammunition. Do you need anything?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'arrow'}, 3447, 2, 'arrow')
shopModule:addBuyableItem({'bow'}, 3350, 400, 'bow')
shopModule:addBuyableItem({'crossbow'}, 3349, 500, 'crossbow')
shopModule:addBuyableItem({'bolt'}, 3446, 3, 'bolt')

npcHandler:addModule(FocusModule:new())

