local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Pssst! Be silent. Do you wish to buy something?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye. Tell others about... my little shop here.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye. Tell others about... my little shop here.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am selling some... things.'})
keywordHandler:addKeyword({'berfasmur'}, StdModule.say, {npcHandler = npcHandler, text = 'Never heard that name!'})
keywordHandler:addKeyword({'rebellion'}, StdModule.say, {npcHandler = npcHandler, text = 'Uhm... who sent you?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'Names don\'t matter.'})
keywordHandler:addKeyword({'gamel'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, you know my name. Please don\'t tell it to the others.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell maces, staffs, daggers and brass helmets.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'mace'}, 3286, 90, 'mace')
shopModule:addBuyableItem({'brass'}, 3354, 120, 'brass')
shopModule:addBuyableItem({'staff'}, 3289, 40, 'staff')
shopModule:addBuyableItem({'dagger'}, 3267, 5, 'dagger')
shopModule:addBuyableItem({'throwing'}, 3298, 25, 'throwing')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

