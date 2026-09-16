local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye, bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye, bye.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now it\'s the current time. Did you notice this is a xelor watch I am wearing?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a salesperson here, but one day I might become a tailor, or a supermodel perhaps!'})
keywordHandler:addKeyword({'xelor'}, StdModule.say, {npcHandler = npcHandler, text = 'Xelor, the dwarf of the chromancers guild, makes the most stylish watches in all the land.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Norbert.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t think they dress that well.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Even the king of Thais, blessed be his name, can\'t buy a better wardrobe then ours.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Those evil mages dress so ugly.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Women could do better then to wear armor. Women in leather scare my in particular.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Our tailors are influenced by styles of the whole known world.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I heared the colour of the next season will be orange.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thaian wear is not that stylish anymore.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'He\'s our boss, a great tailor and designer.'})
keywordHandler:addKeyword({'clothes'}, StdModule.say, {npcHandler = npcHandler, text = 'I have wonderful jackets, coats, lovely doublets, even warlike leather armor, and impressive studded armor.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell very stylish clothes indeed.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I fear such a weapon will ruin a silk shirt with one blow.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'doublet'}, 3379, 16, 'doublet')
shopModule:addBuyableItem({'jacket'}, 3561, 12, 'jacket')
shopModule:addBuyableItem({'leather'}, 3361, 25, 'leather')
shopModule:addBuyableItem({'coat'}, 3562, 8, 'coat')
shopModule:addBuyableItem({'studded'}, 3378, 90, 'studded')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

