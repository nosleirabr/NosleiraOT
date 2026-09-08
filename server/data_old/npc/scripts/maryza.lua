local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Talking to me?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Yeah, bye')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Yeah, bye')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m the cook of the Jolly Axeman.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'The boys of the Savage Axe at the bridge are running wild in these days.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Maryza Firehand, daughter of Earth, from the Molten Rock.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell normal and brown bread, meat, ham, cookies, rolls, and cheese made of mushrooms.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'To busy, ask my husband.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t like it, has an elfish touch, ye know?'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'We could better feed some dragons instead of these fools.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Heard that\'s what the humans call one of their boggiemen.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you some food if ye like.'})
keywordHandler:addKeyword({'jimbin'}, StdModule.say, {npcHandler = npcHandler, text = 'I am so proud of him. In drinking, he\'s second only to our mighty general.'})
keywordHandler:addKeyword({'tark'}, StdModule.say, {npcHandler = npcHandler, text = 'He loved my dragonsteaks. Heard he died by a cave in while fighting drags in the Plains of Havoc.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'We don\'t care much about outsiders anymore.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t like these upper cave guys.'})
keywordHandler:addKeyword({'farewell'}, StdModule.say, {npcHandler = npcHandler, text = 'Yeah, farewell'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Puny town for puny guys.'})
keywordHandler:addKeyword({'general'}, StdModule.say, {npcHandler = npcHandler, text = 'A fine drinker and strategist. Wastes his skill with these idiots of the army. What a shame.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Would slice a dragon or two for steaks if i\'d get it.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'book'}, 3234, 150, 'book')
shopModule:addBuyableItem({'cheese'}, 3607, 6, 'cheese')
shopModule:addBuyableItem({'bread'}, 3600, 4, 'bread')
shopModule:addBuyableItem({'ham'}, 3582, 8, 'ham')
shopModule:addBuyableItem({'brown'}, 3602, 3, 'brown')
shopModule:addBuyableItem({'cookie'}, 3598, 2, 'cookie')
shopModule:addBuyableItem({'roll'}, 3601, 2, 'roll')
shopModule:addBuyableItem({'meat'}, 3577, 5, 'meat')

npcHandler:addModule(FocusModule:new())

