local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

-- Cormaya steamship -> Kazordoon only (Farmine is post-7.4)
addTravelKeyword(keywordHandler, npcHandler, 'kazordoon', 150, TravelHarbours.steamKazordoon, 'Kazordoon')

local destinations = 'Where do you want me to take you? To {Kazordoon}?'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am operating a steamship.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes, I\'m the captain of this ship.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m Gurbasch Firejuggler.'})
keywordHandler:addKeyword({'cormaya'}, StdModule.say, {npcHandler = npcHandler, text = 'Hey, we ARE at Cormaya!'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'How do you expect me to get there? Fly? Hm, wait... NO, sorry.'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'How do you expect me to get there? Fly? Hm, wait... NO, sorry.'})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|! Lovely steamboat, ain\'t it? I can offer you a {passage} if you like.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Until next time.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Until next time.')
npcHandler:addModule(FocusModule:new())
