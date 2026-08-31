local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

-- Cormaya ferry: Edron (paid) + Eremo (free fare, still premium)
addTravelKeyword(keywordHandler, npcHandler, 'edron', 20, TravelHarbours.edron, 'Edron')

local function addEremoKeyword(words)
	local eremoKeyword = keywordHandler:addKeyword(words, StdModule.say, {
		npcHandler = npcHandler,
		text = 'Oh, you know the good old sage Eremo. I can bring you to his little island. Do you want me to do that?'
	})
	eremoKeyword:addChildKeyword({'yes'}, StdModule.travel, {
		npcHandler = npcHandler,
		premium = true,
		cost = 0,
		destination = TravelHarbours.eremo,
		msg = 'Set the sails!'
	})
	eremoKeyword:addChildKeyword({'no'}, StdModule.say, {
		npcHandler = npcHandler,
		text = 'Maybe another time.',
		reset = true
	})
end

addEremoKeyword({'eremo'})
addEremoKeyword({'sage'})

local destinations = 'Do you want to sail to {Edron} or to {Eremo}?'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'boat'}, StdModule.say, {npcHandler = npcHandler, text = 'My boat is ready to bring you to Edron or to Eremo.'})
keywordHandler:addKeyword({'ship'}, StdModule.say, {npcHandler = npcHandler, text = 'My boat is ready to bring you to Edron or to Eremo.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m a fisherman and I take along people to Edron. You can also buy some fresh fish.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'I ferry travellers between Cormaya, Edron and Eremo\'s island.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Pemaret, the fisherman.'})
keywordHandler:addKeyword({'cormaya'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a lovely and peaceful isle. Did you already visit the nice sandy beach?'})
keywordHandler:addKeyword({'isle'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a lovely and peaceful isle. Did you already visit the nice sandy beach?'})

npcHandler:setMessage(MESSAGE_GREET, 'Greetings, young man. Looking for a {passage} or some fish, |PLAYERNAME|?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|. You are welcome.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
npcHandler:addModule(FocusModule:new())
