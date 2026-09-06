local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|! Feel free to tell me what has brought you here.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|!')
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'They created Tibia and all life on it.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Sadly we have only little knowledge on this topic.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Costello.'})
keywordHandler:addKeyword({'anselm'}, StdModule.say, {npcHandler = npcHandler, text = 'He was a humble and pious man, and he was chosen by the royal family of thais to find a resting place for their dead.'})
keywordHandler:addKeyword({'caves'}, StdModule.say, {npcHandler = npcHandler, text = 'Anselm, the first of our order, discovered them while looking for a suitable burial place for his king.'})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = 'You should not be here at all and I won\'t allow anyone to transport you from or to this isle.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'The bygone leaders of the Thaian empire rest beneath this monastery in tombs and crypts.'})
keywordHandler:addKeyword({'life'}, StdModule.say, {npcHandler = npcHandler, text = 'On Tibia there are many forms of life. Plants, the citizens, and monsters.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t mention this servant of evil here.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'That is the name of our world and its major continent.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'There are really too many of them in Tibia. But who are we to question the wisdom of the gods?'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, we rarely hear anything new here.'})
keywordHandler:addKeyword({'plant'}, StdModule.say, {npcHandler = npcHandler, text = 'Just walk around, you will see grass, trees, and bushes.'})
keywordHandler:addKeyword({'wisdom'}, StdModule.say, {npcHandler = npcHandler, text = 'You are allowed to enter the library upstairs. Stay there and don\'t go upstairs, because that area is reserved for members of our order.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the abbot of the white raven monastery on the isle of the kings.'})
keywordHandler:addKeyword({'isle'}, StdModule.say, {npcHandler = npcHandler, text = 'We founded our monastery to guard the royal tombs and to gather wisdom and knowledge.'})
keywordHandler:addKeyword({'tibianus'}, StdModule.say, {npcHandler = npcHandler, text = 'One day every Tibianus ends up here.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

