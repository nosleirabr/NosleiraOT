local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello |PLAYERNAME|! What do you need?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m a shopkeeper. You can buy food here.'})
keywordHandler:addKeyword({'ghostlands'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry I know nothing more then it has to be a horrible place and that scares me enough.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I have no watch.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Imalas.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'Just have a look at my blackboard.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'banana'}, 3587, 2, 'banana')
shopModule:addBuyableItem({'melon'}, 3593, 8, 'melon')
shopModule:addBuyableItem({'brown'}, 3602, 3, 'brown')
shopModule:addBuyableItem({'grapes'}, 3592, 3, 'grapes')
shopModule:addBuyableItem({'carrot'}, 3595, 2, 'carrot')
shopModule:addBuyableItem({'pumpkin'}, 3594, 10, 'pumpkin')
shopModule:addBuyableItem({'egg'}, 3606, 2, 'egg')
shopModule:addBuyableItem({'cherry'}, 3590, 1, 'cherry')
shopModule:addBuyableItem({'cookie'}, 3598, 2, 'cookie')
shopModule:addBuyableItem({'roll'}, 3601, 2, 'roll')
shopModule:addBuyableItem({'cheese'}, 3607, 5, 'cheese')

npcHandler:addModule(FocusModule:new())

