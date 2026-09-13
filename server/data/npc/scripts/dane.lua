local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to the wave cellar, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Please come back from time to time.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Please come back from time to time.')
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard nothing interesting lately.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the owner of this place of relaxation.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, we just sell drinks.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is exactly the current time.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Dane.'})
keywordHandler:addKeyword({'cellar'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s pretty, isn\'t it?'})
keywordHandler:addKeyword({'alcohol'}, StdModule.say, {npcHandler = npcHandler, text = 'Alcohol makes people too aggressive. We don\'t need such stuff in Carlin.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you milk, water, and lemonade.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'bread'}, 2689, 4, 1, 'bread')
shopModule:addBuyableItem({'cheese'}, 2696, 6, 1, 'cheese')
shopModule:addBuyableItem({'ham'}, 2671, 8, 1, 'ham')
shopModule:addBuyableItem({'meat'}, 2666, 5, 1, 'meat')
shopModule:addBuyableItem({'mug'}, 2012, 2, 3, 'mug of beer')
shopModule:addBuyableItem({'mug'}, 2012, 3, 2, 'mug of wine')
shopModule:addBuyableItem({'mug'}, 2012, 1, 1, 'mug of water')

npcHandler:addModule(FocusModule:new())




