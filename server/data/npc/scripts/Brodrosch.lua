local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

-- Kazordoon steamship -> Cormaya only (Farmine is post-7.4)
addTravelKeyword(keywordHandler, npcHandler, 'cormaya', 150, TravelHarbours.steamCormaya, 'Cormaya')

local destinations = 'Where do you want me to take you? To {Cormaya}?'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the steamship captain!'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'Of course, I am the captain.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Brodrosch Steamtrousers.'})
keywordHandler:addKeyword({'kazordoon'}, StdModule.say, {npcHandler = npcHandler, text = 'Hey, we ARE at Kazordoon!'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'This is a steamship that travels only subterraneously.'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'This is a steamship that travels only subterraneously.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'This is a steamship that travels only subterraneously.'})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|! May Earth protect you, even whilst sailing! Need a {passage}?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Until next time.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Until next time.')
npcHandler:addModule(FocusModule:new())
