local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings adventurer |PLAYERNAME|. What leads you to me?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye and take care of you!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye and take care of you!')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m a storyteller.'})
keywordHandler:addKeyword({'marlene'}, StdModule.say, {npcHandler = npcHandler, text = 'A lovely woman. But I give you a hint: Better keep away from her. *grin*'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Aneus, the storyteller.'})
keywordHandler:addKeyword({'graubart'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t know much about him. But he sails much and has seen nearly the whole world.'})
keywordHandler:addKeyword({'bruno'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t know much about him. I only know that he is selling fish in the village.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

