local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

addTravelKeyword(keywordHandler, npcHandler, 'thais', 160, TravelHarbours.thais, 'Thais')
addTravelKeyword(keywordHandler, npcHandler, 'carlin', 110, TravelHarbours.carlin, 'Carlin')
addTravelKeyword(keywordHandler, npcHandler, 'ab\'dendriel', 70, TravelHarbours.abdendriel, 'Ab\'Dendriel')
addTravelKeyword(keywordHandler, npcHandler, 'abdendriel', 70, TravelHarbours.abdendriel, 'Ab\'Dendriel')
addTravelKeyword(keywordHandler, npcHandler, 'venore', 40, TravelHarbours.venore, 'Venore')
addTravelKeyword(keywordHandler, npcHandler, 'ankrahmun', 160, TravelHarbours.ankrahmun, 'Ankrahmun')
addTravelKeyword(keywordHandler, npcHandler, 'cormaya', 20, TravelHarbours.cormaya, 'Cormaya')

local destinations = 'Where do you want to go? To {Thais}, {Carlin}, {Ab\'Dendriel}, {Venore}, {Ankrahmun} or {Cormaya}?'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this sailing ship.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this sailing ship.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Captain Seahorse of the Royal Tibia Line.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'This is Edron. Where do you want to go?'})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome on board, |PLAYERNAME|. Where can I {sail} you today?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. Recommend us if you were satisfied with our service.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye then.')
npcHandler:addModule(FocusModule:new())
