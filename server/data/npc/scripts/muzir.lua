local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome |PLAYERNAME|! Daraman\'s blessings.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Daraman\'s blessings.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Daraman\'s blessings.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am honoured to be the grandwezir of the caliph.'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'I take it upon me to involve myself with worldly issues for the prosperity of our community. I hope the taint of wealth does not harm my soul too much.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is exactly the current time.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Muzir.'})
keywordHandler:addKeyword({'wezir'}, StdModule.say, {npcHandler = npcHandler, text = 'I am responsible for the wealth of our beloved and wise caliph. I can also change money for you.'})
keywordHandler:addKeyword({'caliph'}, StdModule.say, {npcHandler = npcHandler, text = 'I am caretaker for the fortune of our beloved and wise caliph.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'vial'}, 2006, 5, 1, 'vial')
shopModule:addSellableItem({'blank'}, 2260, 10, 'blank rune')
shopModule:addSellableItem({'life'}, 2006, 60, 'life fluid')
shopModule:addSellableItem({'mana'}, 2006, 100, 'mana fluid')
shopModule:addSellableItem({'spellbook'}, 2217, 150, 'spellbook')

npcHandler:addModule(FocusModule:new())


