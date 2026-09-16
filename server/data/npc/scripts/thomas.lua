local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Feel welcome, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Never been there.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Selling spellbooks, notebooks, scrolls, documents, parchments, inkwells, and the like.'})
keywordHandler:addKeyword({'book'}, StdModule.say, {npcHandler = npcHandler, text = 'I offer different kind of books: brown, black and small books. Which book do you want?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'Thomas.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'No idea.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask in the castle.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Know nothing interesting about him.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Only heard of him.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'Selling scrolls, documents, parchments, spellbooks, books, and inkwells.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Like it here best.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Nothing interesting.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Never been there.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'This town.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'No idea.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'small'}, 2839, 15, 'small')
shopModule:addBuyableItem({'inkwell'}, 3509, 8, 'inkwell')
shopModule:addBuyableItem({'brown'}, 2837, 15, 'brown')
shopModule:addBuyableItem({'document'}, 2834, 12, 'document')
shopModule:addBuyableItem({'spellbook'}, 3059, 150, 'spellbook')
shopModule:addBuyableItem({'black'}, 2838, 15, 'black')
shopModule:addBuyableItem({'parchment'}, 2835, 8, 'parchment')
shopModule:addBuyableItem({'scroll'}, 2815, 5, 'scroll')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

