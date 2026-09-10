local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye and don\'t forget me!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye and don\'t forget me!')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m a merchant. I sail all over the world with my ship and trade with many different races!'})
keywordHandler:addKeyword({'weapons'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, sold out.'})
keywordHandler:addKeyword({'work'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m sorry, but it is too dangerous nowadays. Too many storms out there. Come back in some months and we will see.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Graubart, captain of the great Seahawk!'})
keywordHandler:addKeyword({'bruno'}, StdModule.say, {npcHandler = npcHandler, text = 'Bruno is one of the best sailors I know. He is nearly as good as me. *laughs loudly*'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, sold out. Ask Bruno.'})
keywordHandler:addKeyword({'races'}, StdModule.say, {npcHandler = npcHandler, text = 'You know; elves, dwarfs, lizardmen, minotaurs and many others.'})
keywordHandler:addKeyword({'ship'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, my whole proud: My ship named Seahawk. We rode out so many stormy nights together. I think I couldn\'t live without it.'})
keywordHandler:addKeyword({'water'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, sold out.'})
keywordHandler:addKeyword({'aneus'}, StdModule.say, {npcHandler = npcHandler, text = 'Hmm, I don\'t know him very well. But he has a very nice story to tell.'})
keywordHandler:addKeyword({'trade'}, StdModule.say, {npcHandler = npcHandler, text = 'I trade nearly everything, for example weapons, food, water, and even magic runes.'})
keywordHandler:addKeyword({'merchant'}, StdModule.say, {npcHandler = npcHandler, text = 'A merchant is someone who trades goods with other people and tries to make a little profit. *laughs*'})
keywordHandler:addKeyword({'marlene'}, StdModule.say, {npcHandler = npcHandler, text = 'Pssst. Marlene is not near right now...? You know... she is a lovely woman, but she talks too much! So I always try to keep distance from her because she can\'t stop talking.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

