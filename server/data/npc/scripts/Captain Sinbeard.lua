local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

addTravelKeyword(keywordHandler, npcHandler, 'edron', 160, TravelHarbours.edron, 'Edron')
addTravelKeyword(keywordHandler, npcHandler, 'venore', 150, TravelHarbours.venore, 'Venore')
addTravelKeyword(keywordHandler, npcHandler, 'darashia', 100, TravelHarbours.darashia, 'Darashia')

local destinations = 'Where do you want to go? To {Edron}, {Venore} or {Darashia}?'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this sailing ship.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this sailing ship.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Captain Sinbeard of the Royal Tibia Line.'})
keywordHandler:addKeyword({'ankrahmun'}, StdModule.say, {npcHandler = npcHandler, text = 'This is Ankrahmun. Where do you want to go?'})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome on board, |PLAYERNAME|. Where can I {sail} you today?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. Recommend us if you were satisfied with our service.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye then.')
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
