local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings |PLAYERNAME|, seeker of delicacies.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May Daraman\'s wisdom enlighten your soul.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May Daraman\'s wisdom enlighten your soul.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'This town must be far away, we rarely even hear about it here.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell meat, ham and salmon.'})
keywordHandler:addKeyword({'caliph'}, StdModule.say, {npcHandler = npcHandler, text = 'Caliph Kazzan is our worldly leader.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as Mugluf the younger.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you looking for food? I have meat, ham, and salmon.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time is nothing but another illusion.'})
keywordHandler:addKeyword({'noodles'}, StdModule.say, {npcHandler = npcHandler, text = 'That must be an important Thaian noble. Regulary Darashian delicacies are sent for him to Thais.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Who might that be?'})
keywordHandler:addKeyword({'desert'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a challenge to body and soul. Praised be Daraman to have brought us here to grow on this constant test.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'The world is an illusion, don\'t get trapped in it.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'People say there is a dark cloud gathering in the west.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'I think we have some kind of trade agreements with them.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you meat, ham, and salmon.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'O seeker of artifacts, I have no need for other weapons then a fork, a spoon, and a knife.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'ham'}, 3582, 10, 'ham')
shopModule:addBuyableItem({'meat'}, 3577, 7, 'meat')
shopModule:addBuyableItem({'salmon'}, 3579, 6, 'salmon')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

