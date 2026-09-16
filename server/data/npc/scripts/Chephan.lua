local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Ah, looking for some cooking gear today, |PLAYERNAME|?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'So long, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'So long, |PLAYERNAME|.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Watches are sold in the south east part of this warehouse.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell all the cooking gear you can dream of.'})
keywordHandler:addKeyword({'gambling'}, StdModule.say, {npcHandler = npcHandler, text = 'Thanks to that taxes I have not enough spare money to gamble much.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Chephan, at your service.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'They brought most of their cooking gear from thais.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Even a king needs a fork now and then. To scratch his back or to poke servants for example.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'See this fork? Now imagine what a hero like you could do to an evil sorcerer with that fork! Care to buy one?'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'So many women and so little intrest in cooking, horrible.'})
keywordHandler:addKeyword({'warehouse'}, StdModule.say, {npcHandler = npcHandler, text = 'Here you can by so many things you will need one day or another. Just have a look.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'The world is flat as this plate. You should buy one as a symbol for Tibia.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'My recipies are family secrets, sorry.'})
keywordHandler:addKeyword({'privilege'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t feel that privileged. In fact our beloved city is bleeding for the profit of Thais.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thaian cooking gear is of inferior quality. Make sure to upgrade yours here as soon as you can.'})
keywordHandler:addKeyword({'tax'}, StdModule.say, {npcHandler = npcHandler, text = 'Those taxes are killing me. And they are getting worse each year!'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'That would be: Buckets, bottles, mugs, cups, jugs, plates, baking trays, pots, pans, forks, spoons, knifes, wooden spoons, cleavers, spatulas, and rolling pins.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Just an oversized kitchenknife. Better buy the real thing.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'meat'}, 2666, 5, 1, 'meat')
shopModule:addBuyableItem({'ham'}, 2671, 8, 1, 'ham')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)



