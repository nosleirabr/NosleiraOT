local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome |PLAYERNAME|! Whats your need?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time is of no meaning to us sorcerers.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the head alchemist of Carlin. I keep the secret recipies of our ancestors. Besides, I am selling mana and life fluids, spellbooks, wands, rods and runes.'})
keywordHandler:addKeyword({'vocation'}, StdModule.say, {npcHandler = npcHandler, text = 'Your vocation is your profession. There are four vocations in Tibia: Sorcerers, paladins, knights, and druids.'})
keywordHandler:addKeyword({'ancestor'}, StdModule.say, {npcHandler = npcHandler, text = 'We are a guild of old traditions and even older secrets.'})
keywordHandler:addKeyword({'patience'}, StdModule.say, {npcHandler = npcHandler, text = 'You have to free yourself from unpatience to learn the deeper secrets of magic.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the illusterous Rachel, of course.'})
keywordHandler:addKeyword({'power'}, StdModule.say, {npcHandler = npcHandler, text = 'Power is important, but it is just the way, not the ultimate goal.'})
keywordHandler:addKeyword({'sorcerer'}, StdModule.say, {npcHandler = npcHandler, text = 'Spells are the minor parts that make a sorcerer. To be one is a state of mind, not of a full spellbook.'})
keywordHandler:addKeyword({'wisdom'}, StdModule.say, {npcHandler = npcHandler, text = 'Wisdom arises from patience.'})
keywordHandler:addKeyword({'goal'}, StdModule.say, {npcHandler = npcHandler, text = 'This secrect will be taught you by life, not by me.'})
keywordHandler:addKeyword({'deposit'}, StdModule.say, {npcHandler = npcHandler, text = 'I will pay you 5 gold for every empty vial. Ok?'})
keywordHandler:addKeyword({'rune'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell blank runes and spell runes.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'mana'}, 2006, 100, 7, 'mana fluid')
shopModule:addBuyableItem({'life'}, 2006, 60, 10, 'life fluid')
shopModule:addBuyableItem({'blank'}, 2260, 10, 1, 'blank rune')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)




