local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye and please come back soon.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye and please come back soon.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I plan to visit this city one day.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell potions and magic fluids.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am lady Sandra Astralian.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Buy a watch.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Do I look as if I\'d fraternize with such people?'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I was guest at his castle on my visits to Thais.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'A disgusting person indeed.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m selling life and mana fluids and several potions.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'The world is a place of barbarianism.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Nothing I would talk to you about.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'A city full of disgusting people with ill manners.'})
keywordHandler:addKeyword({'potion'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m selling potions of slime, blood, urine, oil, and distilled water.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'Isn\'t it a wonderful town?'})
keywordHandler:addKeyword({'deposit'}, StdModule.say, {npcHandler = npcHandler, text = 'I will pay you 5 gold for every empty vial. Ok?'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I am not interested in tales only kids belive in.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'life'}, 2006, 60, 10, 'life fluid')
shopModule:addBuyableItem({'mana'}, 2006, 100, 7, 'mana fluid')
shopModule:addBuyableItem({'vial'}, 2006, 10, 1, 'vial')
shopModule:addSellableItem({'vial'}, 2006, 5, 'vial')

npcHandler:addModule(FocusModule:new())


