local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Be greeted, |PLAYERNAME|! May I help you?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'music'}, StdModule.say, {npcHandler = npcHandler, text = 'Music is the food of love.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I make instruments and sometimes I\'m wandering through the lands of Tibia as a bard.'})
keywordHandler:addKeyword({'bard'}, StdModule.say, {npcHandler = npcHandler, text = 'Bards from all over the world come here to buy their instruments.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I don\'t know what time it is.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'Here you can buy lyres, lutes, drums, and simple fanfares. I also have a piano and a harp.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'lute'}, 2950, 195, 'lute')
shopModule:addBuyableItem({'drum'}, 2952, 140, 'drum')
shopModule:addBuyableItem({'lyre'}, 2949, 120, 'lyre')
shopModule:addBuyableItem({'piano'}, 2807, 200, 'piano')
shopModule:addBuyableItem({'harp'}, 2808, 50, 'harp')
shopModule:addBuyableItem({'simple'}, 2954, 150, 'simple')

npcHandler:addModule(FocusModule:new())

