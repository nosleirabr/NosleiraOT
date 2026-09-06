local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Oh, a customer. Hello |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Oh, good bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Oh, good bye.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, these women ... oh, go away.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, I am a tailor, can\'t you see?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m Rudolph, you know.'})
keywordHandler:addKeyword({'shoes'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, I have wonderful leather boots and sandals.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, now it\'s the current time.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, such handsome guys and such ugly uniforms.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, the king. What a well dressed man he is.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, dear.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, I have wonderful clothes and shoes.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, there is not much sense for fashion in this world.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, we tailors learn much, but don\'t talk about it. It\'s the tailors\' code of honor, you know.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, what a lovely city it was once.'})
keywordHandler:addKeyword({'clothes'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, I have wonderful jackets, capes, tunics, leather legs, and scarfs.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, what a lovely city it is.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, that thing must be dangerous. One could hurt himself quite badly with it I guess.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'sandals'}, 3551, 2, 'sandals')
shopModule:addBuyableItem({'leather'}, 3552, 2, 'leather')
shopModule:addBuyableItem({'scarf'}, 3572, 15, 'scarf')
shopModule:addBuyableItem({'cape'}, 3565, 9, 'cape')
shopModule:addBuyableItem({'leather'}, 3559, 10, 'leather')
shopModule:addBuyableItem({'jacket'}, 3561, 12, 'jacket')
shopModule:addBuyableItem({'tunic'}, 3563, 10, 'tunic')

npcHandler:addModule(FocusModule:new())

