local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Howdy |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'They should have been more careful with this town, before they lost it.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I teach some basic spells.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Ursula.'})
keywordHandler:addKeyword({'envenom'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m sorry, but this spell is only for druids.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I don\'t own a watch.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'I would prefer an army of spellcasters, but they are ok.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'The king spent a lot of money for our library.'})
keywordHandler:addKeyword({'desintegrate'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m sorry, but this spell is only for paladins, sorcerers, and druids.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, come on, he can\'t be that poweful and evil as all say.'})
keywordHandler:addKeyword({'spellbook'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m sorry, but I don\'t have one. Ask Thomas in the west tower about that.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Isn\'t it a fine world we live in.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard about things you never would believe. Please come back when I have more time to chat.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, yes, I remember my time there, old Muriel teaching me the basics.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'I have \'Conjure Bolt\', \'Animate Dead\', \'Envenom\', \'Heal Friend\', \'Desintegrate\', \'Poison Bomb\', and \'Strong Haste\'. Which one do you want to learn?'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'Sciences are thriving on this isle.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'A myth born out of some knights\' inferiority complex.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

