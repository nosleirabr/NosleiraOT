local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to the Horn of Plenty, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Come back soon, traveller.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Come back soon, traveller.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time right now.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Mirabell.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you looking for food? I have bread, cheese, ham, and meat.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Sadly most of them are too disciplined to visit my tavern.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'King Tibianus III should visit our beautiful isle more often.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you food and drinks.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard horrible things about him.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'They should return to the Thaian realm.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'I think Edron is the best place in Tibia.'})
keywordHandler:addKeyword({'drink'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you beer, wine, lemonade, and water.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais will loose influence on Edron more and more.'})
keywordHandler:addKeyword({'frodo'}, StdModule.say, {npcHandler = npcHandler, text = 'He\'s my cousin and lives in Thais.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the owner of this tavern, which is known far beyond Edron.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, there are so many. Just ask other travellers like you.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'I think it is the best place in Tibia.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard the Knights of the True Blood are looking for it on this isle.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'ham'}, 3582, 8, 'ham')
shopModule:addBuyableItem({'meat'}, 3577, 5, 'meat')
shopModule:addBuyableItem({'lemonade'}, 2880, 2, 'lemonade')
shopModule:addBuyableItem({'cheese'}, 3607, 6, 'cheese')
shopModule:addBuyableItem({'bread'}, 3600, 4, 'bread')

npcHandler:addModule(FocusModule:new())

