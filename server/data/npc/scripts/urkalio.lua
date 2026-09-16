local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to the pits of the Hard Rock Tavern, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Have a good fight, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Have a good fight, |PLAYERNAME|.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'No clue, it\'s equally dark down here at any time.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am responsible for the Hard Rock Pits Tavern.'})
keywordHandler:addKeyword({'pits'}, StdModule.say, {npcHandler = npcHandler, text = 'Choose your enemies with care.'})
keywordHandler:addKeyword({'amazon'}, StdModule.say, {npcHandler = npcHandler, text = 'Some came here to challenge the local champions. I can\'t say I was impressed by their skills. However, they took a few heads as trophies.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Urkalio.'})
keywordHandler:addKeyword({'asrak'}, StdModule.say, {npcHandler = npcHandler, text = 'He\'s the best. To be the man, you\'ll have to beat the minotaur, so to say. Not that you could provoke him to a fight at all.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'I have cookies, bread, cheese, ham, and meat.'})
keywordHandler:addKeyword({'swampelves'}, StdModule.say, {npcHandler = npcHandler, text = 'If they want a fight that bad, why don\'t they just come here and fight in the pits?'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'A shame they don\'t visit our pits for some training.'})
keywordHandler:addKeyword({'maria'}, StdModule.say, {npcHandler = npcHandler, text = 'She\'s kind of my boss.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'THAT would be some attraction down here.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell food and drinks for the hungry and thirsty.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Sooner or later everyone comes here, so why bother to travel.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care about their \'independence war\'.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Down here everyone is king as far as where his weapons reach.'})
keywordHandler:addKeyword({'drink'}, StdModule.say, {npcHandler = npcHandler, text = 'So do you want beer, wine, lemonade, or ... uhm ... water?'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I bet you want to hear about those swampelves from Shadowthorn.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Such a boring city. I wonder why anyone would live there.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I would love to see that weapon in a fight.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'meat'}, 2666, 5, 1, 'meat')
shopModule:addBuyableItem({'ham'}, 2671, 8, 1, 'ham')
shopModule:addBuyableItem({'beer'}, 20003, 2, 1, 'beer')
shopModule:addBuyableItem({'wine'}, 20015, 3, 1, 'wine')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)




