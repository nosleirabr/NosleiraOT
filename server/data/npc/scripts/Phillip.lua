local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello, famous |PLAYERNAME|. It should be you teaching me!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Go and be careful. Remember what you have learned!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Go and be careful. Remember what you have learned!')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'To learn about gods, visit the temples and talk to the priests.'})
keywordHandler:addKeyword({'rebellion'}, StdModule.say, {npcHandler = npcHandler, text = 'Rebellion? What for? We are contend with our situation.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Phillip.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'My business is knowlegde and it is for free.'})
keywordHandler:addKeyword({'loremaster'}, StdModule.say, {npcHandler = npcHandler, text = 'If you are lucky you\'ll meet one in your journeys.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'This weapon is said to be very powerful and unique. It was hidden in ancient times and now is thought to be lost.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'He is a follower of evil. His powers were boosted by a sinister force and he is beyond human restrictions now.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'To learn about magic talk to the guild leaders.'})
keywordHandler:addKeyword({'rumour'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t like rumours.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Dungeons are places of danger and puzzles. In some of them a bright mind will serve you more then a blade.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'The southern king is called Tibianus. He and our queen Eloise are in a constant struggle.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Monsters come in different shape and power. It\'s said there is a zoo in the dwarfs\' town.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'To learn about weapons read appropriate books or talk to the smiths.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am honored to be teacher in this school.'})
keywordHandler:addKeyword({'teacher'}, StdModule.say, {npcHandler = npcHandler, text = 'I run this school, there are other travelling teachers who we call Loremasters.'})
keywordHandler:addKeyword({'lugri'}, StdModule.say, {npcHandler = npcHandler, text = 'This servant of evil is protected by the dark gods and can\'t be harmed.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I will provide you with all knowledge I have.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

