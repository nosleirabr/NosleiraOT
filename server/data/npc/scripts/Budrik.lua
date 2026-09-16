local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hiho, Hiho |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye, bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye, bye.')
keywordHandler:addKeyword({'dwarfs'}, StdModule.say, {npcHandler = npcHandler, text = 'We understand the ways of the earth like nobody else does.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the foreman of this mine.'})
keywordHandler:addKeyword({'trouble'}, StdModule.say, {npcHandler = npcHandler, text = 'The Horned Fox is leading his bandits in sneak attacks and raids on us.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Precisely the current time, young one.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Budrik Deepdigger, son of Earth, from the Molten Rock.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a miner, ask someone else.'})
keywordHandler:addKeyword({'hideout'}, StdModule.say, {npcHandler = npcHandler, text = 'The hideout of the Horned Fox is probably a dangerous if not lethal place for the unexperienced ones.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'This is no funhouse. Leave the miners and their drilling-worms alone and get out! We have already enough trouble without you.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'In the deeper mines we discover some nasty beasts now and then.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

