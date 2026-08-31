local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

-- Edron carpet pilot (Pino)
addTravelKeyword(keywordHandler, npcHandler, 'darashia', 40, TravelHarbours.carpetDarashia, 'Darashia', 'Hold on!')
addTravelKeyword(keywordHandler, npcHandler, 'femor', 60, TravelHarbours.carpetFemor, 'the Femor Hills', 'Hold on!')
addTravelKeyword(keywordHandler, npcHandler, 'hills', 60, TravelHarbours.carpetFemor, 'the Femor Hills', 'Hold on!')

local destinations = 'I can fly you to {Darashia} or the Femor {hills}.'
keywordHandler:addKeyword({'fly'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'ride'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a carpet pilot.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Pino.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'This is Edron. Where do you want to fly?'})

npcHandler:setMessage(MESSAGE_GREET, 'Daraman\'s blessings, |PLAYERNAME|. Need a carpet {ride}?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Daraman\'s blessings.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Daraman\'s blessings.')
npcHandler:addModule(FocusModule:new())
