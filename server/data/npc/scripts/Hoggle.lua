local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to my humble home!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'No, this is not the time to go fishing.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am just a poor fisherman.'})
keywordHandler:addKeyword({'map'}, StdModule.say, {npcHandler = npcHandler, text = 'If you go north-west you will find Lubo and his adventurer shop. I think he sells maps.'})
keywordHandler:addKeyword({'boat'}, StdModule.say, {npcHandler = npcHandler, text = 'My boat sunk. I thought it would be more aerodynamic with holes in it.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Hoggle. I live in this house.'})
keywordHandler:addKeyword({'finger'}, StdModule.say, {npcHandler = npcHandler, text = 'No, fish don\'t have fingers.'})
keywordHandler:addKeyword({'fisherman'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a very hard job, cause without a boat I have to swim and fish at the same time!'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'If you are hungry you can go downstairs, perhaps you will find some fish. You can also take some shoes if you want.'})
keywordHandler:addKeyword({'stupid'}, StdModule.say, {npcHandler = npcHandler, text = 'My mom always said, stupid is who stupid does.'})
keywordHandler:addKeyword({'fish'}, StdModule.say, {npcHandler = npcHandler, text = 'I think they can talk, but they are wise enough to be silent. Once I saw a mermaid.'})
keywordHandler:addKeyword({'secret'}, StdModule.say, {npcHandler = npcHandler, text = 'Can you keep a secret? I think fish can\'t breath on land!'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'There are stories about a city behind the mountain, but why should I go there? There is enough fish here.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'I know this city. Sometimes I sell fish to Frodo.'})
keywordHandler:addKeyword({'frodo'}, StdModule.say, {npcHandler = npcHandler, text = 'He buys my fish.'})
keywordHandler:addKeyword({'mermaid'}, StdModule.say, {npcHandler = npcHandler, text = 'I saw one! She had the body of a fish, and also the head of a fish. Amazing!'})
keywordHandler:addKeyword({'mountain'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes, there is a mountain to the north, but it\'s of no interest. There isn\'t any fish on it.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

