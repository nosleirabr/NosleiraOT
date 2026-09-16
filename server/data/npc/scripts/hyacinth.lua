local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings, traveller |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May Crunor bless you.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May Crunor bless you.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time does not matter to me.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'As far as I know there is a library in the village. Teach yourself about the gods.'})
keywordHandler:addKeyword({'cipfried'}, StdModule.say, {npcHandler = npcHandler, text = 'His healing powers equal even mine.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Hyacinth.'})
keywordHandler:addKeyword({'obi'}, StdModule.say, {npcHandler = npcHandler, text = 'A greedy and annoying person as most people are.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'I just sell some revitalizing life fluids.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'It is shaped by the will of the gods, so we don\'t have to question it.'})
keywordHandler:addKeyword({'sewer'}, StdModule.say, {npcHandler = npcHandler, text = 'I rarely visit the town.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'I am one of the few magic users on this isle. But I sense a follower of the dark path of magic hiding somewhere in the depths of the dungeons.'})
keywordHandler:addKeyword({'dallheim'}, StdModule.say, {npcHandler = npcHandler, text = 'A man of the sword.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'The dungeons are dangerous for unexperienced adventurers.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care about kings, queens, and the like.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Most of the so called monsters of this isle are just creatures of the gods. On the mainland there are some beasts that truly are monstrous.'})
keywordHandler:addKeyword({'amber'}, StdModule.say, {npcHandler = npcHandler, text = 'I never talked to her longer.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'I can\'t teach you magic. On the mainland you will learn your spells soon enough.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care much about weapons.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a druid and healer, a follower of Crunor.'})
keywordHandler:addKeyword({'seymour'}, StdModule.say, {npcHandler = npcHandler, text = 'He has some inner devils that torture him.'})
keywordHandler:addKeyword({'deposit'}, StdModule.say, {npcHandler = npcHandler, text = 'I will pay you 5 gold for every empty vial. Ok?'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I can only sell life fluids, ask Cipfried for further help.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
-- Life fluid: ID 2006 subtype 10 (life fluid), preco classico 7.4
shopModule:addBuyableItem({'life', 'life fluid'}, 2006, 60, 10, 'life fluid')
-- Vial vazio: jogador pode vender vials vazios por 5gp
shopModule:addSellableItem({'vial', 'empty vial'}, 2006, 5, 'vial')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

