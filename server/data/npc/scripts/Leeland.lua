local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|. Make sure to visit my shop.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|. Make sure to visit my shop.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'So it is a watch you need? Make sure to buy one downstairs.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the owner of the Useful Things Warehouse.'})
keywordHandler:addKeyword({'gambling'}, StdModule.say, {npcHandler = npcHandler, text = 'I just love bets and gambling. It inspires people doing such interesting things.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Slim, Leeland Slim.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Your question suggests you are interested in military? I am sure you will find something interesting in my warehouse.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Do I hear envy in your voice? Is it that you realy want? To be ... king? Well, one never knows ... perhaps you find something royal in my warehouse.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, Ferumbras. I remember selling him torches for his first adventures as if it was yesterday.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I was there some time ago. I exchanged ideas with some important people there and even could sell them something that furthered their cause.'})
keywordHandler:addKeyword({'warehouse'}, StdModule.say, {npcHandler = npcHandler, text = 'I offer many things. Actually I am sure you will find something you have desired for a long time.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'I have seen most of it. And I like it. <chuckles>'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I would love to have the time to chat and exchange gossip, but sadly business always comes first, you know?'})
keywordHandler:addKeyword({'privilege'}, StdModule.say, {npcHandler = npcHandler, text = 'Privileges have to be paid for. The one way ... or the other.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Perhaps one day I will settle in thais again. I love the city\'s potential.'})
keywordHandler:addKeyword({'tax'}, StdModule.say, {npcHandler = npcHandler, text = 'Taxes are a necessary evil, people say. I like that.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'That\'s one of the few things even I can\'t aquire for you.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'rope'}, 2120, 50, 1, 'rope')
shopModule:addBuyableItem({'shovel'}, 2554, 50, 1, 'shovel')
shopModule:addBuyableItem({'backpack'}, 1988, 20, 1, 'backpack')
shopModule:addBuyableItem({'bag'}, 1987, 4, 1, 'bag')
shopModule:addBuyableItem({'torch'}, 2054, 2, 1, 'torch')
shopModule:addBuyableItem({'scythe'}, 2550, 50, 1, 'scythe')
shopModule:addBuyableItem({'pick'}, 2553, 50, 1, 'pick')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)



