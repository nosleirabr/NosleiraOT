local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

addTravelKeyword(keywordHandler, npcHandler, 'thais', 110, TravelHarbours.thais, 'Thais')
addTravelKeyword(keywordHandler, npcHandler, 'ab\'dendriel', 80, TravelHarbours.abdendriel, 'Ab\'Dendriel')
addTravelKeyword(keywordHandler, npcHandler, 'abdendriel', 80, TravelHarbours.abdendriel, 'Ab\'Dendriel')
addTravelKeyword(keywordHandler, npcHandler, 'edron', 110, TravelHarbours.edron, 'Edron')
addTravelKeyword(keywordHandler, npcHandler, 'venore', 130, TravelHarbours.venore, 'Venore')

local destinations = 'Where do you want to go? To {Thais}, {Ab\'Dendriel}, {Venore} or {Edron}?'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this sailing ship.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this sailing ship.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Captain Greyhound of the Royal Tibia Line.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'This is Carlin. Where do you want to go?'})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome on board, |PLAYERNAME|. Where can I {sail} you today?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. Recommend us if you were satisfied with our service.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye then.')
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
