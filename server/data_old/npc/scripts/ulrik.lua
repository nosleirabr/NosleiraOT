local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello |PLAYERNAME|. What can I do for you?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye for now.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye for now.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'We live too far away from Thais to hear anything that truly is \'new\'.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Every now and then an adventurer like you comes here looking for it.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Ulrik.'})
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = 'You are welcome.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, I only heard frigthening tales about him.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'What do you need? I sell weapons and armor.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m sorry, but I don\'t buy used equipment.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'They say north of Thais is a deep dungeon.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'What can a simple man as me say about a king?'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Most monsters live far away, so you can feel safe here in Greenshore.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'I have longswords, battle hammers, and battle axes. What do you want?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a smith. Do you need anything I make?'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'My offers are weapons and armor.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I have no clue how to help you.'})
keywordHandler:addKeyword({'armor'}, StdModule.say, {npcHandler = npcHandler, text = 'I have scale armor, soldier helmets, and steel shields. What do you want?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'longsword'}, 3285, 160, 'longsword')
shopModule:addBuyableItem({'battle'}, 3305, 350, 'battle')
shopModule:addBuyableItem({'steel'}, 3409, 240, 'steel')
shopModule:addBuyableItem({'scale'}, 3377, 260, 'scale')
shopModule:addBuyableItem({'battle'}, 3266, 235, 'battle')
shopModule:addBuyableItem({'soldier'}, 3375, 110, 'soldier')

npcHandler:addModule(FocusModule:new())

