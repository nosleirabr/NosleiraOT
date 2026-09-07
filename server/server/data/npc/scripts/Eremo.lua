local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to my little garden, adventurer |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Shouldn\'t I teleport you back to Pemaret?')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Shouldn\'t I teleport you back to Pemaret?')
keywordHandler:addKeyword({'amulet'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'ve collected quite a few protection amulets, and some amulets of loss as well. Also, I\'m interested in buying broken amulets.'})
keywordHandler:addKeyword({'challenge'}, StdModule.say, {npcHandler = npcHandler, text = 'I am sorry but this spell is only for elite knights.'})
keywordHandler:addKeyword({'pilgrimage'}, StdModule.say, {npcHandler = npcHandler, text = 'Whenever you receive a lethal wound your lifeforce is damaged. With every single of the five blessings you have this damage will be reduced.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Eremo, an old man who has seen many things.'})
keywordHandler:addKeyword({'fire'}, StdModule.say, {npcHandler = npcHandler, text = 'You should ask for the blessing of the two suns in the suntower near Ab\'Dendriel.'})
keywordHandler:addKeyword({'embrace'}, StdModule.say, {npcHandler = npcHandler, text = 'The druids north of Carlin will provide you with the embrace of Tibia.'})
keywordHandler:addKeyword({'island'}, StdModule.say, {npcHandler = npcHandler, text = 'I have retired from my adventures to this place.'})
keywordHandler:addKeyword({'adventure'}, StdModule.say, {npcHandler = npcHandler, text = 'I explored dungeons, I walked through deserts, I sailed on the seas and climbed up on many a mountain.'})
keywordHandler:addKeyword({'spark'}, StdModule.say, {npcHandler = npcHandler, text = 'The spark of the phoenix will be given to you by the dwarven priests of earth and fire in Kazordoon.'})
keywordHandler:addKeyword({'Tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'A great world full of magic and wonder.'})
keywordHandler:addKeyword({'teleport'}, StdModule.say, {npcHandler = npcHandler, text = 'Should I teleport you back to Pemaret?'})
keywordHandler:addKeyword({'blessing'}, StdModule.say, {npcHandler = npcHandler, text = 'There are five different blessings available in five sacred places. These blessings are: the spiritual shielding, the spark of the phoenix, the embrace of Tibia, the fire of the suns and the wisdom of solitude.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'I am sorry, but you are not promoted yet.'})
keywordHandler:addKeyword({'wisdom'}, StdModule.say, {npcHandler = npcHandler, text = 'I can provide you with the wisdom of solitude. But you will have to sacrifice 10.000 gold to receive it. Are you still interested?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I teach some spells, provide one of the five blessings, and sell some amulets.'})
keywordHandler:addKeyword({'spiritual'}, StdModule.say, {npcHandler = npcHandler, text = ' You can receive the spiritual shielding in the whiteflower temple south of Thais.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'protection'}, 3084, 700, 'protection')
shopModule:addBuyableItem({'amulet'}, 3057, 50000, 'amulet')
shopModule:addBuyableItem({'broken'}, 3080, 50000, 'broken')

npcHandler:addModule(FocusModule:new())

