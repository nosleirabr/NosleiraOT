local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Take care.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Take care.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a druid, bound to the spirit of nature. I\'m selling antidote runes that help against poison. Oh, and I buy blueberries, of course.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I only sell my antidote runes and I\'ll be happy to buy some blueberries from you.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is about the current time.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Lily.'})
keywordHandler:addKeyword({'hyacinth'}, StdModule.say, {npcHandler = npcHandler, text = 'Hyacinth lives in the forest. He\'s never in town so I don\'t know him very well.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I can sell you an antidote rune. It\'s against the poison of so many dangerous creatures.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Many monsters are poisonous. Don\'t let them bite you or you will need one of my antidote runes.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'antidote'}, 3153, 40, 'antidote')

npcHandler:addModule(FocusModule:new())

