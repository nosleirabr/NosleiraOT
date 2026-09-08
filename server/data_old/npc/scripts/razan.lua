local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings |PLAYERNAME|. What leads you to me?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Daraman\'s blessings.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Daraman\'s blessings.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'You are talking of what you are wasting right now?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the weaponmaster of Caliph Kazzan the great.'})
keywordHandler:addKeyword({'caliph'}, StdModule.say, {npcHandler = npcHandler, text = 'We owe caliph Kazzan our loyality and gratitude, thrice praised be his name.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'Razan ... Razan Ibn Rublai.'})
keywordHandler:addKeyword({'djinn'}, StdModule.say, {npcHandler = npcHandler, text = 'Some people in Darashia rely to much on the services of these creatures. I wonder if they keep the path in mind.'})
keywordHandler:addKeyword({'weaponmaster'}, StdModule.say, {npcHandler = npcHandler, text = 'I mastered the arts of close combat and distance fight alike. I teach both, paladins and knights in their ways.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'This information is confidential.'})
keywordHandler:addKeyword({'kasmir'}, StdModule.say, {npcHandler = npcHandler, text = 'You will find him in the Muhayin, the sacred tower of meditation.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Maybe a worthy oponent, but probably only another of these spellcasting cowards.'})
keywordHandler:addKeyword({'shalmar'}, StdModule.say, {npcHandler = npcHandler, text = 'He is competent. That\'s fine enough for a mage.'})
keywordHandler:addKeyword({'spellbook'}, StdModule.say, {npcHandler = npcHandler, text = 'In a spellbook, your spells are listed. There you will find the pronunciation of each spell. Rely more on your skills, though.'})
keywordHandler:addKeyword({'Daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'Better talk to Kasmir about that.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'The world is a dangerous place for body and for soul.'})
keywordHandler:addKeyword({'knight'}, StdModule.say, {npcHandler = npcHandler, text = 'The way of the warrior is not that different from the way to ascension.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care for rumours but for facts.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I only teach spells to knights and paladins.'})
keywordHandler:addKeyword({'path'}, StdModule.say, {npcHandler = npcHandler, text = 'The path of enlightenment, leading to ascension as thaught to us by Daraman.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'The skill should make a fighter strong, not the weapon.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

