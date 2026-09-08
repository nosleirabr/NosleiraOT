local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Salutations, |PLAYERNAME|. What can I do for you?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Be careful on your journeys.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Be careful on your journeys.')
keywordHandler:addKeyword({'knight'}, StdModule.say, {npcHandler = npcHandler, text = 'Knights are the true heroes of Tibia. Fame can only be earned by hand to hand combat. Brave women can join us, and we even accept suitable males now and then.'})
keywordHandler:addKeyword({'spellbook'}, StdModule.say, {npcHandler = npcHandler, text = 'In a spellbook, all your spells are listed. There you will find the pronunciation of each spell. If you want to buy one, visit the magicians shop in the south of Carlin.'})
keywordHandler:addKeyword({'hero'}, StdModule.say, {npcHandler = npcHandler, text = 'Heroes are knights and knights are heroes, of course.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the high knight of Carlin. I trained the the greatest heroines and even some males.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I only sell spells to knights.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is time for a fight!'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Trisha Ironfist.'})
keywordHandler:addKeyword({'vocation'}, StdModule.say, {npcHandler = npcHandler, text = 'Your vocation is your profession. There are four vocations in Tibia: Knights, paladins, sorcerers, and druids.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

