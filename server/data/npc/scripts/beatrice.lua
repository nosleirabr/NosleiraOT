local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello, hiho, and ashari |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'See you later.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'See you later.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Though they rebelled against our king it\'s said that the city is very lovely.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'My job is to sell all kind of useful equipment.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am called Beatrice.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time right now.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'I supply them with some basic stuff.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I have seen him once. What a handsome man he is.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'I vaguely remember that name.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'My inventory is large, just have a look at the blackboard.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t like travelling much. I prefer to live in the safety of our city.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'There are always rumors about the dangers in the far north of Edron.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'We are no longer in need to be supplied from there.'})
keywordHandler:addKeyword({'worm'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell worms only in sixpacks for 5 gold each, how many sixpacks of worms do you want to buy?'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the best place to live at.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'A myth like the screwdriver of Kurik or the endless vial of manafluid.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'torch'}, 2054, 2, 1, 'torch')
shopModule:addBuyableItem({'bag'}, 1987, 4, 1, 'bag')
shopModule:addBuyableItem({'scroll'}, 1949, 5, 1, 'scroll')
shopModule:addBuyableItem({'shovel'}, 2554, 50, 1, 'shovel')
shopModule:addBuyableItem({'backpack'}, 1988, 20, 1, 'backpack')
shopModule:addBuyableItem({'scythe'}, 2550, 50, 1, 'scythe')
shopModule:addBuyableItem({'rope'}, 2120, 50, 1, 'rope')
shopModule:addBuyableItem({'watch'}, 2036, 20, 1, 'watch')
shopModule:addBuyableItem({'fishing'}, 2580, 150, 1, 'fishing rod')
shopModule:addBuyableItem({'letter'}, 2597, 8, 1, 'letter')
shopModule:addBuyableItem({'parcel'}, 2595, 15, 1, 'parcel')
shopModule:addBuyableItem({'label'}, 2599, 1, 1, 'label')

npcHandler:addModule(FocusModule:new())




