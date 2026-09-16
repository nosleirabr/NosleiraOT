local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|!')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Other cities are of no importance. Ankrahmun will become the center of the known world anyways.'})
keywordHandler:addKeyword({'Arkhothep'}, StdModule.say, {npcHandler = npcHandler, text = 'The pharaoh wants not to be disturbed. I am his grand vizier and responsible for the daily affairs of the city and promotions of heroes.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Ishebad the chosen.'})
keywordHandler:addKeyword({'ashmunrah'}, StdModule.say, {npcHandler = npcHandler, text = 'The fallen pharaoh did not see it was time to step back and let his son rule. So he met the fate that he deserved.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time does not matter to the undead.'})
keywordHandler:addKeyword({'Ankrahmun'}, StdModule.say, {npcHandler = npcHandler, text = 'Our city will become the capital of a worldwide empire.'})
keywordHandler:addKeyword({'eremo'}, StdModule.say, {npcHandler = npcHandler, text = 'It is said that he lives on a small island near Edron. Maybe the people there know more about him.'})
keywordHandler:addKeyword({'temple'}, StdModule.say, {npcHandler = npcHandler, text = 'The temple will take care of your spiritual matters.'})
keywordHandler:addKeyword({'mourn'}, StdModule.say, {npcHandler = npcHandler, text = 'You mortals are all to be mourned for your miserable existance.'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'Some lunatic who was driven mad by the heat of the desert and dehydration.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'This world just awaits the wisdom of our pharaoh. It needs that wisdom and will soon learn to appreciate it.'})
keywordHandler:addKeyword({'undead'}, StdModule.say, {npcHandler = npcHandler, text = 'Undeath is only for the choosen.'})
keywordHandler:addKeyword({'scarab'}, StdModule.say, {npcHandler = npcHandler, text = 'The scarabs are keepers of secrets. Some secrets are not ment for your mortals. Ever keep that in mind.'})
keywordHandler:addKeyword({'ascension'}, StdModule.say, {npcHandler = npcHandler, text = 'Consult a priest to learn how you could achieve ascension.'})
keywordHandler:addKeyword({'pharaoh'}, StdModule.say, {npcHandler = npcHandler, text = 'Our immortal ruler, may he be blessed, is the keeper of our enlightenment and our saviour.'})
keywordHandler:addKeyword({'darashia'}, StdModule.say, {npcHandler = npcHandler, text = 'This village is so insignificant that our wise pharaoh has choosen to ignore it.'})
keywordHandler:addKeyword({'darama'}, StdModule.say, {npcHandler = npcHandler, text = 'The rule of our beloved pharaoh will soon spread this continent and one day the whole known world.'})
keywordHandler:addKeyword({'mortality'}, StdModule.say, {npcHandler = npcHandler, text = 'If you please our pharaoh, he will reward you and free you from your mortality.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

