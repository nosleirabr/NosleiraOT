local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome in my humble hut, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|!')
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'The king does much to enhance the life of his people, but he could do more.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'The gods of good take care of us.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My Name is Albert Fibulanian.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now, it is the current time.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'I dream of times which see no need for armies or warriors.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'The fallen one is a perfect example where evil leads us to.'})
keywordHandler:addKeyword({'kaine'}, StdModule.say, {npcHandler = npcHandler, text = 'Another victim of his own ambitions. I mourn for his soul.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Tibia is a world big enough for everyone. I wish people would realize that.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'The sinful city of Thais is a monument of corruption and murder. I am glad I left for Edron and thank the gods every day for this isle.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a healer.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I have only news about weather, taxes, and harvests. I heared nothing that might interest a traveller like you.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s only another instrument of pain and destruction.'})
keywordHandler:addKeyword({'daniel'}, StdModule.say, {npcHandler = npcHandler, text = 'I healed his wounds, but nothing can heal his soul after the betrayal of some of his knightly brethren.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

