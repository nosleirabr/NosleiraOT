local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Ashari |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Asha Thrazi.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Asha Thrazi.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I think those humans are trespassing elven teritory far too often.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the overseer of the mines.'})
keywordHandler:addKeyword({'locked'}, StdModule.say, {npcHandler = npcHandler, text = 'I keep the keys to the mines.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Trolls are boring, I have no news to tell.'})
keywordHandler:addKeyword({'mines'}, StdModule.say, {npcHandler = npcHandler, text = 'We hardly get the ore we need. The worthless trolls are lazy workers. I keep them locked up the whole time.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am called Shirith Blooddancer.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time.'})
keywordHandler:addKeyword({'olrik'}, StdModule.say, {npcHandler = npcHandler, text = 'As a post officer he has some use ... as a troll has some use for mining.'})
keywordHandler:addKeyword({'dwarfs'}, StdModule.say, {npcHandler = npcHandler, text = 'They could be of ... some use.'})
keywordHandler:addKeyword({'abdaisim'}, StdModule.say, {npcHandler = npcHandler, text = 'Let them go, we don\'t need them.'})
keywordHandler:addKeyword({'deraisim'}, StdModule.say, {npcHandler = npcHandler, text = 'They could do more for us if they would try more hard.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Nonsense.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'He should be destroyed.'})
keywordHandler:addKeyword({'elves'}, StdModule.say, {npcHandler = npcHandler, text = 'We are a superior race, indeed.'})
keywordHandler:addKeyword({'troll'}, StdModule.say, {npcHandler = npcHandler, text = 'We give these useless creatures a reason to live by serving us.'})
keywordHandler:addKeyword({'cenath'}, StdModule.say, {npcHandler = npcHandler, text = 'They think they are better then us.'})
keywordHandler:addKeyword({'human'}, StdModule.say, {npcHandler = npcHandler, text = 'Humans are more annoying than our trolls.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is far away as all humans should be.'})
keywordHandler:addKeyword({'teshial'}, StdModule.say, {npcHandler = npcHandler, text = 'Who needs dreamers in these days?'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'If it comes to trade, I can respect those merchants. As long as they leave as soon as they finished buisness, that is.'})
keywordHandler:addKeyword({'kuridai'}, StdModule.say, {npcHandler = npcHandler, text = 'We keep this society running. Without our tools and work our case would be a lost one.'})
keywordHandler:addKeyword({'roderick'}, StdModule.say, {npcHandler = npcHandler, text = 'We don\'t need him or any other ambassador here.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

