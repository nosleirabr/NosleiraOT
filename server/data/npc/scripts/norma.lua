local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'I\'m sorry |PLAYERNAME|, but I only serve premium account customers.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye, bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye, bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is about the current time. I am so sorry, I have no watches to sell. Do you want to buy something else?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a merchant. What can I do for you?'})
keywordHandler:addKeyword({'equipment'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell torches, bags, scrolls, shovels, picks, backpacks, sickles, scythes, ropes, fishing rods and sixpacks of worms. Just tell me what you want to buy.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Norma. Do you want to buy something?'})
keywordHandler:addKeyword({'pick'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I fear Al Dee owns the last ones on this isle.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell much. Just read the blackboards for my awesome wares or just ask me.'})
keywordHandler:addKeyword({'bug'}, StdModule.say, {npcHandler = npcHandler, text = 'Bugs plague this isle, but my wares are bugfree, totally bugfree.'})
keywordHandler:addKeyword({'stuff'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell equipment of all kinds, all kind available on this isle. Just ask me about my wares if you are interested.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'One day I will return to the continent as a rich, a very rich woman!'})
keywordHandler:addKeyword({'sewer'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, our sewer system is very primitive; so primitive it\'s overrun by rats. But the stuff I sell is safe from them. Do you want to buy some of it?'})
keywordHandler:addKeyword({'dallheim'}, StdModule.say, {npcHandler = npcHandler, text = 'Some call him a hero.'})
keywordHandler:addKeyword({'shield'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell wooden shields and studded shields. Just tell me what you want to buy.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'If you want to explore the dungeons, you have to equip yourself with the vital stuff I am selling. It\'s vital in the deepest sense of the word.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'The king encouraged salesmen to travel here, but only some dared to take the risk, and a risk it was!'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'If you want to challenge the monsters, you need some weapons and armor I sell. You need them definitely!'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is a crowded town.'})
keywordHandler:addKeyword({'worm'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell worms only in sixpacks for 5 gold each, how many sixpacks of worms do you want to buy?'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell spears, rapiers, sabres, daggers, hand axes, axes, and short swords. Just tell me what you want to buy.'})
keywordHandler:addKeyword({'helmet'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell leather helmets, studded helmets, and chain helmets. Just tell me what you want to buy.'})
keywordHandler:addKeyword({'wares'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell weapons, shields, armor, helmets, and equipment. For what do you want to ask?'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell stuff to prices that low, that all other merchants would mock at my stupidity.'})
keywordHandler:addKeyword({'armor'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell jackets, coats, doublets, leather armor, and leather legs. Just tell me what you want to buy.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'bread'}, 2689, 4, 1, 'bread')
shopModule:addBuyableItem({'cheese'}, 2696, 6, 1, 'cheese')
shopModule:addBuyableItem({'ham'}, 2671, 8, 1, 'ham')
shopModule:addBuyableItem({'meat'}, 2666, 5, 1, 'meat')
shopModule:addBuyableItem({'mug'}, 2012, 2, 3, 'mug of beer')
shopModule:addBuyableItem({'mug'}, 2012, 1, 1, 'mug of water')
shopModule:addBuyableItem({'mug'}, 2012, 3, 2, 'mug of wine')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)






