local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to the Hard Rock Racing Track, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'You\'ll be back.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'You\'ll be back.')
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'The king is far away, so who cares?'})
keywordHandler:addKeyword({'amazon'}, StdModule.say, {npcHandler = npcHandler, text = 'I guess they just have not met the right man yet.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'Just call me Boozer. Everyone does that.'})
keywordHandler:addKeyword({'food'}, StdModule.say, {npcHandler = npcHandler, text = 'So you are looking for food? We have cookies, bread, cheese, ham, and meat.'})
keywordHandler:addKeyword({'swampelves'}, StdModule.say, {npcHandler = npcHandler, text = 'Some elves gone evil so to say. They now live in a small village to the south called Shadowthorn. No big deal. Who cares about some carrot-eating musicians at all?'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Good customers.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Guess he\'d be bad news for business.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you food and drinks. Get anything else somewhere else and don\'t bother me.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the bartender here at the racing track.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'People from all over Tibia come here to buy, sell, gamble, and get drunk until they puke.'})
keywordHandler:addKeyword({'drink'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you beer, wine, lemonade, and water.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'If you like that Thais that much just go there.'})
keywordHandler:addKeyword({'frodo'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard about his tiny tavern in Thais.'})
keywordHandler:addKeyword({'bogeyman'}, StdModule.say, {npcHandler = npcHandler, text = 'Just a tale to scare the kids.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Heard about that women there. Must visit that wenches someday.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'The swampelves, down at Shadowthorn, are up to some trouble again.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Heard about it now and then. Then again I also hear there a bogeyman somewhere in the swamps.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'lemonade'}, 2880, 2, 'lemonade')
shopModule:addBuyableItem({'cheese'}, 3607, 6, 'cheese')
shopModule:addBuyableItem({'bread'}, 3600, 4, 'bread')
shopModule:addBuyableItem({'ham'}, 3582, 8, 'ham')
shopModule:addBuyableItem({'cookie'}, 3598, 5, 'cookie')
shopModule:addBuyableItem({'meat'}, 3577, 5, 'meat')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

