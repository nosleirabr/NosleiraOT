local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Ashari |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Asha Thrazi.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Asha Thrazi.')
keywordHandler:addKeyword({'kuridai'}, StdModule.say, {npcHandler = npcHandler, text = 'Their knowledge is limited.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell mystic runes, spellbooks, wands, rods and fluids of life or mana.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Shiriel Sharaziel.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time was mastered by my people long ago.'})
keywordHandler:addKeyword({'dwarfs'}, StdModule.say, {npcHandler = npcHandler, text = 'Not worth to bother about.'})
keywordHandler:addKeyword({'abdaisim'}, StdModule.say, {npcHandler = npcHandler, text = 'I think they are lost forever.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'A humanbreed abnomination.'})
keywordHandler:addKeyword({'elves'}, StdModule.say, {npcHandler = npcHandler, text = 'Our noble race has knowledge of secrets beyond your comprehension.'})
keywordHandler:addKeyword({'troll'}, StdModule.say, {npcHandler = npcHandler, text = 'We should eradicate them all.'})
keywordHandler:addKeyword({'cenath'}, StdModule.say, {npcHandler = npcHandler, text = 'We are the teachers to the other castes.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'News are secrets and you are not worthy of my secrets.'})
keywordHandler:addKeyword({'crunor'}, StdModule.say, {npcHandler = npcHandler, text = 'I have no time for superstition.'})
keywordHandler:addKeyword({'humans'}, StdModule.say, {npcHandler = npcHandler, text = 'Cursed with a short livespan and not worth to be remembered.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'I could teach you some spells ... but I won\'t.'})
keywordHandler:addKeyword({'teshial'}, StdModule.say, {npcHandler = npcHandler, text = 'They were not prepared for what they encountered in their quest for knowledge. WE will be prepared.'})
keywordHandler:addKeyword({'deraisim'}, StdModule.say, {npcHandler = npcHandler, text = 'They lack the patience that suits a race with our lifespan.'})
keywordHandler:addKeyword({'deposit'}, StdModule.say, {npcHandler = npcHandler, text = 'I will pay you 5 gold for every empty vial, ok?'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I would love to analyse it one day.'})
keywordHandler:addKeyword({'rune'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell blank runes and spell runes.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'blank'}, 2260, 10, 1, 'blank rune')
shopModule:addBuyableItem({'spellbook'}, 2217, 400, 1, 'spellbook')
shopModule:addBuyableItem({'life'}, 2006, 60, 10, 'life fluid')
shopModule:addBuyableItem({'mana'}, 2006, 100, 7, 'mana fluid')
shopModule:addBuyableItem({'bow'}, 2456, 400, 1, 'bow')
shopModule:addBuyableItem({'crossbow'}, 2455, 500, 1, 'crossbow')
shopModule:addBuyableItem({'arrow'}, 2544, 2, 1, 'arrow')
shopModule:addBuyableItem({'bolt'}, 2543, 3, 1, 'bolt')
shopModule:addSellableItem({'bow'}, 2456, 130, 'bow')
shopModule:addSellableItem({'crossbow'}, 2455, 160, 'crossbow')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)



