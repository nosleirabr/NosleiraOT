local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

addTravelKeyword(keywordHandler, npcHandler, 'mainland', 0, TravelHarbours.jackMainland, 'the mainland')
addTravelKeyword(keywordHandler, npcHandler, 'senja', 0, TravelHarbours.senja, 'Senja')
addTravelKeyword(keywordHandler, npcHandler, 'island', 0, TravelHarbours.senja, 'the island')

local destinations = 'I can take you to the {mainland} or over to {Senja}.'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Captain Jack. I ferry people between the ice islands and the mainland.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Captain Jack.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Captain Jack.'})

npcHandler:setMessage(MESSAGE_GREET, 'Ahoy, |PLAYERNAME|. Need a {passage}?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Safe travels.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Safe travels.')
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
