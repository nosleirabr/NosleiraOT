local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Take good care of yourself traveler. Would be a shame to lose such a courageous wanderer to those green monsters.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Take good care of yourself traveler. Would be a shame to lose such a courageous wanderer to those green monsters.')
keywordHandler:addKeyword({'enemies'}, StdModule.say, {npcHandler = npcHandler, text = 'The enemies I fear most here are these nasty orcs.'})
keywordHandler:addKeyword({'tower'}, StdModule.say, {npcHandler = npcHandler, text = 'This is a watchtower of the city of carlin. From here I can see pretty much all of the surrounding lands. Hardly anybody can startle me up here. I see all enemies long before they can see me.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m an amazon guard. It\'s my job to keep my eyes open and to keep enemies from passing by. My job here truely is one of the toughest. All because of these nerve-racking beasts.'})
keywordHandler:addKeyword({'mission'}, StdModule.say, {npcHandler = npcHandler, text = 'Well, I cannot provide you with a mission, I have a mission to fulfill myself. ...'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Thanita. Nice to meet you.'})
keywordHandler:addKeyword({'amazon'}, StdModule.say, {npcHandler = npcHandler, text = 'I see you have heard of amazons before. Well let me tell you, probably everything you heard is true. We are much stronger and tougher than people think. Also, we know how to fight and could teach many men how to handle a weapon. ...'})
keywordHandler:addKeyword({'fight'}, StdModule.say, {npcHandler = npcHandler, text = 'To get rid of them, you need to be quite good in different martial arts.'})
keywordHandler:addKeyword({'beasts'}, StdModule.say, {npcHandler = npcHandler, text = 'These green, orcish raiders come in masses. Hundreds of them. They are worse than those goblins I have to deal with from time to time. ...'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

