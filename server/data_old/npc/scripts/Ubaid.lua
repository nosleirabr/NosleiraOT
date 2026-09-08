local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Hail King Malor! See you on the battlefield, human worm.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Hail King Malor! See you on the battlefield, human worm.')
keywordHandler:addKeyword({'human'}, StdModule.say, {npcHandler = npcHandler, text = 'You are an inferior race of feeble, scheming jerks. No offence.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Well, what do you think? I keep watch around here to make sure people like you don\'t enter.'})
keywordHandler:addKeyword({'pharaoh'}, StdModule.say, {npcHandler = npcHandler, text = 'They say Ankrahmun is now ruled by a crazy pharaoh who wants to tell his whole people into drooling undead. That\'s humans. Sickos and weirdos the lot of them.'})
keywordHandler:addKeyword({'palace'}, StdModule.say, {npcHandler = npcHandler, text = 'One day we will sack that place and burn it to the ground.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Ubaid. Why do you want to know that, human? Hmm... suspicious.'})
keywordHandler:addKeyword({'djinn'}, StdModule.say, {npcHandler = npcHandler, text = 'We are a race of rulers and dominators! Or at least we, the Efreet, are!'})
keywordHandler:addKeyword({'rah'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you drunk?'})
keywordHandler:addKeyword({'zathroth'}, StdModule.say, {npcHandler = npcHandler, text = 'Zathroth is our father! Of course, the son always has a right to hate his father, right?'})
keywordHandler:addKeyword({'ankrahmun'}, StdModule.say, {npcHandler = npcHandler, text = 'I know that damn city well. A long time ago we laid siege to it. ...'})
keywordHandler:addKeyword({'alesar'}, StdModule.say, {npcHandler = npcHandler, text = 'I am not used to the sight of blueskins here in Mal\'ouquah, and it does not make me too happy to see one. I am keeping an eye on this guy, and if I should ever find that he is playing games with us I will personally break his neck!'})
keywordHandler:addKeyword({'war'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t know why I am stuck here! I should be at the front, killing Marid and humans. Well, perhaps I will kill you...'})
keywordHandler:addKeyword({'lamp'}, StdModule.say, {npcHandler = npcHandler, text = 'I am not taking a nap! I am on duty!'})
keywordHandler:addKeyword({'marid'}, StdModule.say, {npcHandler = npcHandler, text = 'Marid? When? Where? How many? RED ALERT! ...'})
keywordHandler:addKeyword({'gabel'}, StdModule.say, {npcHandler = npcHandler, text = 'I used to serve under Gabel, but he is no longer my king. If that wacky wimp should ever come here to Mal\'ouquah I will personally... you know... turn him away. Yes!'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'This world is ours by right, and we will take it!'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'How dare you utter that name in my presence, human. Don\'t strain my patience, worm! You may know the secret word, but... who knows... it is always possible that your head is torn off in some terrible accident.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Well, Malor is not officially king of all djinn yet, but now our beloved leader is back that is a mere formality.'})
keywordHandler:addKeyword({'scarab'}, StdModule.say, {npcHandler = npcHandler, text = 'They make good pets if you know how to keep them. Did you know they just adore human flesh?'})
keywordHandler:addKeyword({'ubaid'}, StdModule.say, {npcHandler = npcHandler, text = 'That is my name. I don\'t like it when a human pronounces it.'})
keywordHandler:addKeyword({'ascension'}, StdModule.say, {npcHandler = npcHandler, text = 'I think I\'ve heard that term before. Has to do with that weirdo pharaoh, right?'})
keywordHandler:addKeyword({'efreet'}, StdModule.say, {npcHandler = npcHandler, text = 'The Efreet are the true djinn! Those namby-pamby milksops who call themselves the Marid and still follow Gabel, no longer deserve the honour to call themselves djinn.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'Isn\'t that the name of some petty human settlement?'})
keywordHandler:addKeyword({'darashia'}, StdModule.say, {npcHandler = npcHandler, text = 'A human settlement to the west? I have not been there yet, but when I do I\'m sure I will be remembered.'})
keywordHandler:addKeyword({'gate'}, StdModule.say, {npcHandler = npcHandler, text = 'Only the mighty Efreet, the true djinn of Tibia, may enter Mal\'ouquah! ...'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

