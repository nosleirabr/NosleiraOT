local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'I welcome thee, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Goodbye and please bring more gold next time <chuckles>. I mean, it would be nice to see you again.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Goodbye and please bring more gold next time <chuckles>. I mean, it would be nice to see you again.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the current time.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'It says the amazons are looking for a certain magical weapon in this area.'})
keywordHandler:addKeyword({'amazon'}, StdModule.say, {npcHandler = npcHandler, text = 'I wonder how they finance themselves. I bet they are secretly trading in some strange stuff.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard the amazons are after it.'})
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = 'You are welcome.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Our warehouse is the main supplier of the local garrison.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Make sure to buy some extra weapons before facing that one.'})
keywordHandler:addKeyword({'swamp'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t go exploring without weapons. Especially you\'ll need a machete.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'The only royal thing we feel here is the royal tax.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Just buy enough weapons and you don\'t have to fear them.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'I have hand axes, axes, spears, maces, battle hammers, swords, rapiers, daggers, sabres, and machetes. What\'s your choice?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Romella, and I will be serving you today.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell several weapons.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'The weapons we sell are all help you need.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'bread'}, 2689, 2, 1, 'bread')
shopModule:addBuyableItem({'cheese'}, 2696, 5, 1, 'cheese')
shopModule:addBuyableItem({'cookie'}, 2687, 2, 1, 'cookie')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


