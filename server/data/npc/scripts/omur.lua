local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome at the humble booth of Omur, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May your soul flourish like dunegrass after a rainfall.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May your soul flourish like dunegrass after a rainfall.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I know almost nothing about that town. It must be exotic and entertaining. A place of distractions from the true path.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Sometimes the desertwind carries the crys and mourning of the tortured souls from Drefia far into the desert.'})
keywordHandler:addKeyword({'caliph'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, Caliph Kazzan; thrice praised be his name. May his life be as long as the beard of the king of all djinns.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am called Omur.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t become a slave of a watch.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'I think I have heard a traveller from the west mention that name.'})
keywordHandler:addKeyword({'desert'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s not called the Devourer for nothing.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'The world is nothing but a vain seduction.'})
keywordHandler:addKeyword({'vegetable'}, StdModule.say, {npcHandler = npcHandler, text = 'I have carrots, pumpkins and tomatoes. What do you want?'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'We import some goods from there in exchange for ours.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell rare fruits and vegatables from our lands and distant places.'})
keywordHandler:addKeyword({'fruit'}, StdModule.say, {npcHandler = npcHandler, text = 'I have oranges, bananas, grapes, and melons. What do you want?'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Is that the name of a djinn?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'banana'}, 3587, 3, 'banana')
shopModule:addBuyableItem({'melon'}, 3593, 10, 'melon')
shopModule:addBuyableItem({'grape'}, 3592, 5, 'grape')
shopModule:addBuyableItem({'carrot'}, 3595, 4, 'carrot')
shopModule:addBuyableItem({'tomato'}, 3596, 5, 'tomato')
shopModule:addBuyableItem({'pumpkin'}, 3594, 10, 'pumpkin')
shopModule:addBuyableItem({'orange'}, 3586, 7, 'orange')

npcHandler:addModule(FocusModule:new())

