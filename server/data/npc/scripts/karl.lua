local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Pshhhht! Not that loud ... but welcome.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Please come back, but don\'t tell others.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Please come back, but don\'t tell others.')
keywordHandler:addKeyword({'headquarters'}, StdModule.say, {npcHandler = npcHandler, text = 'Well its more a hidden tavern, so to say.'})
keywordHandler:addKeyword({'smuggler'}, StdModule.say, {npcHandler = npcHandler, text = 'We collected money and hired one of the best smuggler in the whole land. His name is Todd.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I won\'t tell you my name.'})
keywordHandler:addKeyword({'tavern'}, StdModule.say, {npcHandler = npcHandler, text = 'Our offers are limited but here a man can buy what a man needs.'})
keywordHandler:addKeyword({'laws'}, StdModule.say, {npcHandler = npcHandler, text = 'Those crazy women forbid us alcohol in the city! Imagine that!'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'They are the tools of opression. Hunting down every alcohol smuggler they can get.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you beer. For wine and realy hard stuff we have to wait for Todd.'})
keywordHandler:addKeyword({'resistance'}, StdModule.say, {npcHandler = npcHandler, text = 'We fight the opression of the males and male needs by the women. This is our secret headquarters.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m sure if the king learns about our tragedy, he will support us with alcohol.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'I think Todd mentioned a Hugo once.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the responsible for our ... uhm ... resistance.'})
keywordHandler:addKeyword({'queen'}, StdModule.say, {npcHandler = npcHandler, text = 'Well, shes not that bad ... but some of her laws are.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Some travelers from Edron told about a great treasure guarded by cruel demons in the dungeons there.'})
keywordHandler:addKeyword({'karl'}, StdModule.say, {npcHandler = npcHandler, text = 'Who told you that???'})
keywordHandler:addKeyword({'Todd'}, StdModule.say, {npcHandler = npcHandler, text = 'A true fighter for malehood. He will bring us all the hard stuff from Thais and even contact the king there to support us.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
-- Cerveja: ID 20003 (beer no items.xml deste datapack), preco premium 20gp (contrabandeada)
shopModule:addBuyableItem({'beer'}, 20003, 20, 1, 'beer')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

