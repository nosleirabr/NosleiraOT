local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

-- Thais harbour (z=7 on this map)
addTravelKeyword(keywordHandler, npcHandler, 'carlin', 110, TravelHarbours.carlin, 'Carlin')
addTravelKeyword(keywordHandler, npcHandler, 'ab\'dendriel', 130, TravelHarbours.abdendriel, 'Ab\'Dendriel')
addTravelKeyword(keywordHandler, npcHandler, 'abdendriel', 130, TravelHarbours.abdendriel, 'Ab\'Dendriel')
addTravelKeyword(keywordHandler, npcHandler, 'edron', 160, TravelHarbours.edron, 'Edron')
addTravelKeyword(keywordHandler, npcHandler, 'venore', 170, TravelHarbours.venore, 'Venore')

local destinations = 'Where do you want to go? To {Carlin}, {Ab\'Dendriel}, {Venore} or {Edron}?'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this sailing ship.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this sailing ship.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Captain Bluebear of the Royal Tibia Line.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'This is Thais. Where do you want to go?'})
keywordHandler:addKeyword({'darashia'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m not sailing there. That route is haunted by a ghost ship! Captain Fearless from Venore sails there.'})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome on board, |PLAYERNAME|. Where can I {sail} you today?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. Recommend us if you were satisfied with our service.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye then.')
npcHandler:addModule(FocusModule:new())
