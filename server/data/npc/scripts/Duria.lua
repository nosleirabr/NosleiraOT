local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hiho, visitor |PLAYERNAME|. Whatdoyouwant?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Goodbye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Goodbye.')
keywordHandler:addKeyword({'knight'}, StdModule.say, {npcHandler = npcHandler, text = 'Knights are proud of being dwarfs, jawoll.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Was there once. Can\'t handle the crime overthere.'})
keywordHandler:addKeyword({'hero'}, StdModule.say, {npcHandler = npcHandler, text = 'Heroes are rare in this days, jawoll.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Iam the Highknight of the dwarfs.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, selling spells only to knights, jawoll.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Dunno.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Duria Steelbender, daughter of Fire, of the Dragoneaters.'})
keywordHandler:addKeyword({'vocation'}, StdModule.say, {npcHandler = npcHandler, text = 'Vocation, vocation, wouldratherlike a vacation.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Bah, to much plantsandstuff, to few tunnels ifyoudaskme.'})
keywordHandler:addKeyword({'spellbook'}, StdModule.say, {npcHandler = npcHandler, text = 'Sellingno spellbooks here. Do I look like a sorc?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

