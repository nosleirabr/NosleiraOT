local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Thousands greetings, |PLAYERNAME|. How may I help you?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May the gods bless your travels.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May the gods bless your travels.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'We do not buy any wares there. Our food is of high quality, Thaian origin.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell delicious food. May I be at your service?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Bonifacius.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time right now.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'I am glad about their healthy appetite.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Our wise king, Tibianus, be praised!'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I can offer you meat, salmons, fruits, cookies, rolls, eggs, and cheese.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Is that a new, exotic vegetable?'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'The world provides us with all kinds of delicious food.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard the corn prices in Thais are going to be increased.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'We recive food from thais with every arriving ship.'})
keywordHandler:addKeyword({'fruit'}, StdModule.say, {npcHandler = npcHandler, text = 'I have oranges, bananas, grapes, pumpkins and melons. What do you want?'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'Our climate is quite rough, so we can only grow wheat here, but no fruits.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Uh, I hate bugs of all kind.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'banana'}, 3587, 2, 'banana')
shopModule:addBuyableItem({'salmon'}, 3579, 4, 'salmon')
shopModule:addBuyableItem({'melon'}, 3593, 8, 'melon')
shopModule:addBuyableItem({'grape'}, 3592, 3, 'grape')
shopModule:addBuyableItem({'cookie'}, 3598, 2, 'cookie')
shopModule:addBuyableItem({'pumpkin'}, 3594, 10, 'pumpkin')
shopModule:addBuyableItem({'cheese'}, 3607, 5, 'cheese')
shopModule:addBuyableItem({'egg'}, 3606, 2, 'egg')
shopModule:addBuyableItem({'orange'}, 3586, 5, 'orange')
shopModule:addBuyableItem({'roll'}, 3601, 2, 'roll')
shopModule:addBuyableItem({'meat'}, 3577, 5, 'meat')

npcHandler:addModule(FocusModule:new())

