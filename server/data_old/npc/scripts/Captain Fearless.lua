local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

addTravelKeyword(keywordHandler, npcHandler, 'thais', 170, TravelHarbours.thais, 'Thais')
addTravelKeyword(keywordHandler, npcHandler, 'carlin', 130, TravelHarbours.carlin, 'Carlin')
addTravelKeyword(keywordHandler, npcHandler, 'ab\'dendriel', 90, TravelHarbours.abdendriel, 'Ab\'Dendriel')
addTravelKeyword(keywordHandler, npcHandler, 'abdendriel', 90, TravelHarbours.abdendriel, 'Ab\'Dendriel')
addTravelKeyword(keywordHandler, npcHandler, 'edron', 40, TravelHarbours.edron, 'Edron')
addTravelKeyword(keywordHandler, npcHandler, 'ankrahmun', 150, TravelHarbours.ankrahmun, 'Ankrahmun')

-- Classic Venore→Darashia: warn about ghost ship, then ~10% chance to land there.
-- Source: TibiaWiki Ghostship / Realesta 7.4 wiki (10%). Bluebear does NOT sail this route.
local darashiaNode = keywordHandler:addKeyword({'darashia'}, StdModule.say, {
	npcHandler = npcHandler,
	text = 'Do you seek a passage to Darashia for 60 gold?'
})
local confirmNode = darashiaNode:addChildKeyword({'yes'}, StdModule.say, {
	npcHandler = npcHandler,
	text = 'I warn you! This route is haunted by a ghost ship. Do you really want to go there?'
})
confirmNode:addChildKeyword({'yes'}, StdModule.travel, {
	npcHandler = npcHandler,
	premium = true,
	cost = 60,
	destination = function()
		if math.random(10) == 1 then
			return TravelHarbours.ghostShip
		end
		return TravelHarbours.darashia
	end
})
confirmNode:addChildKeyword({'no'}, StdModule.say, {
	npcHandler = npcHandler,
	text = 'We would like to serve you some time.',
	reset = true
})
darashiaNode:addChildKeyword({'no'}, StdModule.say, {
	npcHandler = npcHandler,
	text = 'We would like to serve you some time.',
	reset = true
})

local destinations = 'Where do you want to go? To {Thais}, {Carlin}, {Ab\'Dendriel}, {Edron}, {Darashia} or {Ankrahmun}?'
keywordHandler:addKeyword({'sail'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'trip'}, StdModule.say, {npcHandler = npcHandler, text = destinations})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this ship.'})
keywordHandler:addKeyword({'captain'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the captain of this ship.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Captain Fearless of the Royal Tibia Line.'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'This is Venore. Where do you want to go?'})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome on board, |PLAYERNAME|. Where can I {sail} you today?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. Recommend us if you were satisfied with our service.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye then.')
npcHandler:addModule(FocusModule:new())
