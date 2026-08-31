local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'amulet of loss', 'aol'}, 2173, 50000, 'amulet of loss')
shopModule:addBuyableItem({'protection amulet'}, 2200, 700, 'protection amulet')

-- Return to Cormaya (Pemaret's ferry). Classic keywords: back / cormaya / passage / pemaret.
local function addReturnKeyword(words)
	local teleportKeyword = keywordHandler:addKeyword(words, StdModule.say, {
		npcHandler = npcHandler,
		text = 'Should I teleport you back to Pemaret?'
	})
	teleportKeyword:addChildKeyword({'yes'}, StdModule.travel, {
		npcHandler = npcHandler,
		premium = true,
		cost = 0,
		destination = TravelHarbours.cormaya,
		msg = 'Here you go!'
	})
	teleportKeyword:addChildKeyword({'no'}, StdModule.say, {
		npcHandler = npcHandler,
		text = 'Maybe later.',
		reset = true
	})
end

addReturnKeyword({'cormaya'})
addReturnKeyword({'back'})
addReturnKeyword({'passage'})
addReturnKeyword({'pemaret'})

keywordHandler:addKeyword({'job'}, StdModule.say, {
	npcHandler = npcHandler,
	text = 'I am a hermit. I live on this little island and offer travellers a return trip to Cormaya.'
})
keywordHandler:addKeyword({'name'}, StdModule.say, {
	npcHandler = npcHandler,
	text = 'I am Eremo.'
})
keywordHandler:addKeyword({'eremo'}, StdModule.say, {
	npcHandler = npcHandler,
	text = 'This is my little island. Ask for a {passage} if you wish to return to Cormaya.'
})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome to my little garden, adventurer |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. Visit me again sometime.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
npcHandler:addModule(FocusModule:new())
