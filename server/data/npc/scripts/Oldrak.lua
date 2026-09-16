local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome |PLAYERNAME|! Rarely I can welcome visitors in these days.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|!')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I guard this humble temple as a monument for the order of the nightmare knights.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'They created Tibia and all life on it ... and unlife, too.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Oldrak.'})
keywordHandler:addKeyword({'extinct'}, StdModule.say, {npcHandler = npcHandler, text = 'Many perished in their battles against evil, some went mad, not able to stand their nightmares any longer. Others were seduced by the darkness.'})
keywordHandler:addKeyword({'yenny'}, StdModule.say, {npcHandler = npcHandler, text = 'Yenny, known as the Gentle, was one of most powerfull magicwielders in ancient times and known throughout the world for her mercy and kindness.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now, it is the current time.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'A weapon of myth and legend. It was lost in ancient times ... perhaps lost forever.'})
keywordHandler:addKeyword({'dreamwalking'}, StdModule.say, {npcHandler = npcHandler, text = 'While the dreamwalkers of the elves experienenced the brightest dreams of pleasure, the humans strangely had dreams of dark omen.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'That\'s where we are. The world of Tibia.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'These plains are not safe for ordinary travellers. It will take heroes to survive here.'})
keywordHandler:addKeyword({'dreamers'}, StdModule.say, {npcHandler = npcHandler, text = 'They learned the ancient art of dreamwalking from some elves they befriended.'})
keywordHandler:addKeyword({'goshnar'}, StdModule.say, {npcHandler = npcHandler, text = 'The greatest necromant who ever cursed our land with the steps of his feet. He was defeated by the nightmare knights.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, the bane of the Plains of Havoc, the hidden beast, the unbeatable foe. I live here for years and I am sure it\'s only a myth.'})
keywordHandler:addKeyword({'unlife'}, StdModule.say, {npcHandler = npcHandler, text = 'Beware the foul undead!'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I can\'t help you, sorry!'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

