local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

-- Femor Hills carpet
addTravelKeyword(keywordHandler, npcHandler, 'darashia', 60, TravelHarbours.carpetDarashia, 'Darashia', 'Hold on!')
addTravelKeyword(keywordHandler, npcHandler, 'edron', 60, TravelHarbours.carpetEdron, 'Edron', 'Hold on!')

local destinations = 'I can fly you to {Darashia} or {Edron}.'
keywordHandler:addKeyword({'fly'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'ride'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a licensed Darashian carpet pilot.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as Uzon Ibn Kalith.'})
keywordHandler:addKeyword({'femor'}, StdModule.say, {npcHandler = npcHandler, text = 'This is the Femor Hills. Where do you want to fly?'})
keywordHandler:addKeyword({'hills'}, StdModule.say, {npcHandler = npcHandler, text = 'This is the Femor Hills. Where do you want to fly?'})

npcHandler:setMessage(MESSAGE_GREET, 'Daraman\'s blessings, traveller |PLAYERNAME|. Looking for a carpet {ride}?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Daraman\'s blessings.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Daraman\'s blessings.')
npcHandler:addModule(FocusModule:new())
