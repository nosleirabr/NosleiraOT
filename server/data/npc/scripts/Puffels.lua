local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Yeah, another fool disturbing me, what a joy.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Whatever.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Whatever.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care about some remote cities.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I have to teach the spells of least importance to some fools.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Magister Puffels, any problem with that?'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Where might I hide a watch, you fool?'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'Fine army that is. Half of them have already deserted.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'I give nothing for kings, queens... or other people at all.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'The day will come even he makes a fatal casting mistake... I know what I am talking about.'})
keywordHandler:addKeyword({'spellbook'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask a shop owner for that.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Bah, the whole Tibia can &#&$*# my #$&*!'})
keywordHandler:addKeyword({'berserk'}, StdModule.say, {npcHandler = npcHandler, text = 'This spell is only for knights.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard in Thais the new brand of cheese was... uhm...'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'I was there once, almost died. The fools there mistook me for an ordinary rat, can you believe that!?'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'I have \'Magic Rope\', \'Levitate\', \'Haste\', \'Berserk\', \'Force Strike\', \'Energy Strike\', and \'Flame Strike\'.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'Hugo? I heared it was an accident that created this beast.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'Sciences are thriving on this isle.'})
keywordHandler:addKeyword({'beast'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t know more about it.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I have no use for such stuff.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

