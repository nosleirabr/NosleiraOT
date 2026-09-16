local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Oh, please come in, |PLAYERNAME|. What do you need?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye.')
keywordHandler:addKeyword({'elane'}, StdModule.say, {npcHandler = npcHandler, text = 'She is the leader of all paladins.'})
keywordHandler:addKeyword({'ammo'}, StdModule.say, {npcHandler = npcHandler, text = 'Do you need arrows for a bow, or bolts for a crossbow?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Galuna, paladin and fletcher.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Don\'t bother me. Go and buy a watch.'})
keywordHandler:addKeyword({'paladin'}, StdModule.say, {npcHandler = npcHandler, text = 'We are feared warriors and good marksmen. Ask Elane if want to know more about the guild.'})
keywordHandler:addKeyword({'elf'}, StdModule.say, {npcHandler = npcHandler, text = 'It is rumored that they live in the northeast of Tibia. They are the best in archery.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I am selling bows, crossbows, and ammunition. Do you need anything?'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Tibia, a green island. Here it is wunderful to walk into the forests and to hunt with a bow.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'We have visitors of all kind in Thais, only elves show up seldom.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the local fletcher. I am selling bows, crossbows, and ammunition. Do you need anything?'})
keywordHandler:addKeyword({'gorn'}, StdModule.say, {npcHandler = npcHandler, text = 'I supplied him with my goods in the past, now I sell them myself.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'arrow'}, 3447, 2, 'arrow')
shopModule:addBuyableItem({'bow'}, 3350, 400, 'bow')
shopModule:addBuyableItem({'crossbow'}, 3349, 500, 'crossbow')
shopModule:addBuyableItem({'bolt'}, 3446, 3, 'bolt')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

