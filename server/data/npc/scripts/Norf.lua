local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome, Pilgrim.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|!')
keywordHandler:addKeyword({'spark'}, StdModule.say, {npcHandler = npcHandler, text = 'The spark of the phoenix is given by the dwarven priests of earth and fire in Kazordoon.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now, it is the current time. Ask Gorn for a watch, if you need one.'})
keywordHandler:addKeyword({'fire'}, StdModule.say, {npcHandler = npcHandler, text = 'You can ask for the blessing of the two suns in the suntower near Ab\'Dendriel.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am here to provide one of the five blessings.'})
keywordHandler:addKeyword({'wisdom'}, StdModule.say, {npcHandler = npcHandler, text = 'Talk to the hermit Eremo on the isle of Cormaya about this blessing.'})
keywordHandler:addKeyword({'embrace'}, StdModule.say, {npcHandler = npcHandler, text = 'The druids north of Carlin will provide you with the embrace of tibia.'})
keywordHandler:addKeyword({'pilgrimage'}, StdModule.say, {npcHandler = npcHandler, text = 'Whenever you receive a lethal wound your lifeforce is damaged. With every single of the five blessings you have this damage will be reduced.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Norf.'})
keywordHandler:addKeyword({'spiritual'}, StdModule.say, {npcHandler = npcHandler, text = 'Here in the whiteflower temple you may receive the blessing of spiritual shielding. But we must ask of you to sacrifice 10.000 gold. Are you still interested?'})
keywordHandler:addKeyword({'blessing'}, StdModule.say, {npcHandler = npcHandler, text = 'There are five different blessings available in five sacred places. These blessings are: the spiritual shielding, the spark of the phoenix, the embrace of tibia, the fire of the suns and the wisdom of solitude.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

