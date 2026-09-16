local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome |PLAYERNAME|, student of the arcane arts.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Use your knowledge wisely')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Use your knowledge wisely')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Carlin\'s druids waste the influence they have in enviromentalism.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a teacher of the most powerful spells in Tibia.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known in this world as Zoltan.'})
keywordHandler:addKeyword({'yenny'}, StdModule.say, {npcHandler = npcHandler, text = 'Yenny? Which Yenny? That is a common name.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time.'})
keywordHandler:addKeyword({'eremo'}, StdModule.say, {npcHandler = npcHandler, text = 'He is an old and wise man that has seen a lot of Tibia. He is also one of the best magicians. Visit him on his little island.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'They rely too much on their brawn instead of their brain.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'King Tibianus III was the founder of our academy.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'A fallen sorcerer, indeed. What a shame.'})
keywordHandler:addKeyword({'spellbook'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t bother me with that. Ask in the shops for it.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'There is still much left to be explored in this world.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I have no time for chit chat.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is a place of barbary.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'I have some very powerful spells: \'Energy Bomb\', \'Mass Healing\', \'Poison Storm\', \'Paralyze\', and \'Ultimate Explosion\'.'})
keywordHandler:addKeyword({'paralyze'}, StdModule.say, {npcHandler = npcHandler, text = 'No, no, no. This elemental spell is only for druids.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'Sciences are thriving on this isle.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'You will need no weapon if you manipulate the essence of magic.'})
keywordHandler:addKeyword({'visit'}, StdModule.say, {npcHandler = npcHandler, text = 'You should visit Eremo on his little island. Just ask Pemaret on Cormaya for passage.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

