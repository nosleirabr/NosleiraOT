local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Be greeted, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am tailor and designer extraordinaire.'})
keywordHandler:addKeyword({'gambling'}, StdModule.say, {npcHandler = npcHandler, text = 'I too love to gamble now and then in the Hard Rock tavern.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as Hugo Chief.'})
keywordHandler:addKeyword({'supermodel'}, StdModule.say, {npcHandler = npcHandler, text = 'A model with incredible superpowers. Do you think they call them supermodels for nothing?'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, a watch would ruin my stylish outfit.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Women should know better than to hide in ugly armor. Like all followers of ugliness they will be punished one day.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'I think they should not wear that ugly armor in town. I will see to assure that will be changed soon.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'The ferumbras-bad-ass-fashion is incredibly outdated since years.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'A world filled with ugly dressed people needs the skills of a fashion-hero.'})
keywordHandler:addKeyword({'warehouse'}, StdModule.say, {npcHandler = npcHandler, text = 'I would call it a \'wearhouse\'.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'He does not care much about us, we don\'t care much about him. I consider that a fair deal.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'My newest models are top secret, sorry.'})
keywordHandler:addKeyword({'privilege'}, StdModule.say, {npcHandler = npcHandler, text = 'The city was granted a few privileges by the king. I can\'t even tell which. They don\'t affect me that much.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is kind of a fashion hell. If there was an award for the most ugly citizens, it would go to Thais.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'Well it\'s not my real name. I took it because people think it\'s scaring and manly. I hate people doubting my manhood for being a tailor, you know.'})
keywordHandler:addKeyword({'tax'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care about such mundane things like \'taxes\'.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care for such fairytales.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)



