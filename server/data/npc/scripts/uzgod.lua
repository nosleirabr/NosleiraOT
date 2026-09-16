local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hiho |PLAYERNAME|! Wanna weapon, eh?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Guut bye. Coming back soon.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Guut bye. Coming back soon.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time is the current time now.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Me a blacksmith is, an\' weapons me sell. You want buy weapons?'})
keywordHandler:addKeyword({'mines'}, StdModule.say, {npcHandler = npcHandler, text = 'Me hacking and smashing rocks as me was little dwarf, jawoll.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'Me is Uzgod Hammerslammer, son of Fire, from the Savage Axes. You can say you to me.'})
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = 'Me enjoy doing that.'})
keywordHandler:addKeyword({'prison'}, StdModule.say, {npcHandler = npcHandler, text = 'Bad ones locked up there. Never come out again there, jawoll.'})
keywordHandler:addKeyword({'helmet'}, StdModule.say, {npcHandler = npcHandler, text = 'Me just sell weapons.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'You want sell me excalibug for 1000 platinum coins and an enchanted armor?'})
keywordHandler:addKeyword({'pickaxe'}, StdModule.say, {npcHandler = npcHandler, text = 'True dwarven pickaxes having to be maded by true weaponsmith! Me order book full though.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'We no dungeon need. We prison isle have.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Me make often hunt on big nasties. Me small, but very big muscles me have, jawoll.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'Me offer you light an\' heavy weapons.'})
keywordHandler:addKeyword({'light'}, StdModule.say, {npcHandler = npcHandler, text = 'Me having clubs, daggers, spears, axes, swords, maces, rapiers, and sabres. What is your choice?'})
keywordHandler:addKeyword({'heavy'}, StdModule.say, {npcHandler = npcHandler, text = 'Me having the best two handed swords in tibia. I also sell battle hammers. What is your choice?'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'You can buy the weapons me maked or sell weapons you have, jawoll.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'sword'}, 2376, 25, 1, 'sword')
shopModule:addBuyableItem({'mace'}, 2398, 30, 1, 'mace')
shopModule:addBuyableItem({'axe'}, 2386, 20, 1, 'axe')
shopModule:addBuyableItem({'battle'}, 2378, 235, 1, 'battle axe')
shopModule:addBuyableItem({'clerical'}, 2423, 540, 1, 'clerical mace')
shopModule:addSellableItem({'sword'}, 2376, 7, 'sword')
shopModule:addSellableItem({'mace'}, 2398, 8, 'mace')
shopModule:addSellableItem({'axe'}, 2386, 7, 'axe')
shopModule:addSellableItem({'battle'}, 2378, 80, 'battle axe')
shopModule:addSellableItem({'halberd'}, 2381, 400, 'halberd')
shopModule:addSellableItem({'morning'}, 2394, 90, 'morning star')
shopModule:addSellableItem({'clerical'}, 2423, 170, 'clerical mace')
shopModule:addSellableItem({'battle'}, 2417, 120, 'battle hammer')
shopModule:addSellableItem({'two'}, 2377, 450, 'two handed sword')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)




