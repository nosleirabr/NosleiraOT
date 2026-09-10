local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'I\'m Tom the Tanner. How can I help you |PLAYERNAME|?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Doh?')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Doh?')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I haven\'t been outside for a while, so I don\'t know.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m the local tanner. I buy fresh animal corpses, tan them, and convert them into fine leather clothes ...'})
keywordHandler:addKeyword({'orc'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t buy Orcs. Their skin is too scratchy.'})
keywordHandler:addKeyword({'major'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes. Obi, Norma and good old Al. Go ask them for leather clothes.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Tom the tanner.'})
keywordHandler:addKeyword({'tanner'}, StdModule.say, {npcHandler = npcHandler, text = 'That\'s my job. I buy fresh animal corpses, tan them, and convert them into fine leather clothes.'})
keywordHandler:addKeyword({'human'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you crazy?!'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry. I\'m only selling to major customers. But I\'m buying fresh corpses of rats, rabbits and wolves from you.'})
keywordHandler:addKeyword({'troll'}, StdModule.say, {npcHandler = npcHandler, text = 'Troll leather stinks. Can\'t use it.'})
keywordHandler:addKeyword({'corpse'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m buying fresh corpses of rats, rabbits and wolves. What do you want to sell?'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'Help? I will give you a few gold coins if you have some dead animals for me.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'wolf'}, 4007, 5, 'wolf')
shopModule:addBuyableItem({'rat'}, 3994, 2, 'rat')
shopModule:addBuyableItem({'rabbit'}, 4173, 2, 'rabbit')

npcHandler:addModule(FocusModule:new())

