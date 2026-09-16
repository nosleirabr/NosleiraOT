local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Oh, |PLAYERNAME| is that you? You look inconveniently healthy.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye.')
keywordHandler:addKeyword({'vladruc'}, StdModule.say, {npcHandler = npcHandler, text = 'Better don\'t cross the master!'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'You may be interested in my life and mana fluids.'})
keywordHandler:addKeyword({'deposit'}, StdModule.say, {npcHandler = npcHandler, text = 'I will pay you 5 gold for every empty vial. Ok?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'They call me Digger, that fine with me.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'An upstart of minor skills and great ambitions.'})
keywordHandler:addKeyword({'digger'}, StdModule.say, {npcHandler = npcHandler, text = 'So what?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am selling some potions.'})
keywordHandler:addKeyword({'sorcerer'}, StdModule.say, {npcHandler = npcHandler, text = 'The way of the magicwielder is the only way to true power.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'This is the magic market. Just have a look around.'})
keywordHandler:addKeyword({'frans'}, StdModule.say, {npcHandler = npcHandler, text = 'I think the FRANS is bugged.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Just a knights\' legend.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
-- Life fluid: ID 2006 subtype 10 (life fluid), preco classico 7.4
shopModule:addBuyableItem({'life', 'life fluid'}, 2006, 60, 10, 'life fluid')
-- Mana fluid: ID 2006 subtype 7 (mana fluid), preco classico 7.4
shopModule:addBuyableItem({'mana', 'mana fluid'}, 2006, 100, 7, 'mana fluid')
-- Vial vazio: NPCs que compram vials do jogador usam addSellableItem
shopModule:addSellableItem({'vial', 'empty vial'}, 2006, 5, 'vial')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

