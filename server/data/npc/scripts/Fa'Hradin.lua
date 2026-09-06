local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Farewell, human. I will always remember you. Unless I forget you, of course.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Farewell, human. I will always remember you. Unless I forget you, of course.')
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Djinns do not have kings. Gabel has long abdicated the title because of his convictions, and Malor... Well, I suppose he would not refuse to take the crown, but I doubt he will ever get a chance to do so.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'Well, you could say I am the wizard of the Marid. Of course, I know that all djinn are magical creatures. But let us put it this way: I am slightly better at wielding magic then your average djinn in the street.'})
keywordHandler:addKeyword({'alesar'}, StdModule.say, {npcHandler = npcHandler, text = 'That name brings up bad memories. I never really liked him, but you just had to admire his skills at the forge. His desertion was a great loss for our cause.'})
keywordHandler:addKeyword({'palace'}, StdModule.say, {npcHandler = npcHandler, text = 'The pharaoh\'s palace in Ankrahmun is an impressive building. At least that is how I remember it to be. ...'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as Fa\'hradin.'})
keywordHandler:addKeyword({'djinn'}, StdModule.say, {npcHandler = npcHandler, text = 'Our race is in a deplorable state at the moment. However, it is interesting from a scientific point of view. I am really curious to see if the Efreet and the Marid are really going to develop into two completely different species...'})
keywordHandler:addKeyword({'melchior'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah. I remember him. A trader, was he not? I haven\'t seen him for a long time.'})
keywordHandler:addKeyword({'ankrahmun'}, StdModule.say, {npcHandler = npcHandler, text = 'That is one of the oldest human settlements in the whole of Tibia. I understand it is currently ruled by the pharaoh - some sort of undead priest-king. I am sure that must be a charming fellow.'})
keywordHandler:addKeyword({'zathroth'}, StdModule.say, {npcHandler = npcHandler, text = 'He created our race, but we find it hard to love him. Sometimes I think that whole war has erupted because there is something like a design flaw in us djinns, an inconsistency in the way we are. ...'})
keywordHandler:addKeyword({'malor'}, StdModule.say, {npcHandler = npcHandler, text = 'That treacherous snake has been waiting for a chance to seize power for as long as I can remember. He and Gabel used to be as close as brothers, you know.'})
keywordHandler:addKeyword({'human'}, StdModule.say, {npcHandler = npcHandler, text = 'You are a curious species: Weak, yet strong. Stupid, yet clever. Evil, yet good. Fascinating, really. ...'})
keywordHandler:addKeyword({'war'}, StdModule.say, {npcHandler = npcHandler, text = 'For a long time it seemed that the war was over for good. But now that Malor is free again he will surely kindle the flame of war again. ...'})
keywordHandler:addKeyword({'lamp'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah yes. We djinn sleep in lamps. We have a natural ability to dematerialise, you see.'})
keywordHandler:addKeyword({'marid'}, StdModule.say, {npcHandler = npcHandler, text = 'That is what we call ourselves. We like to think of ourselves as the true inheritors of the djinn legacy.'})
keywordHandler:addKeyword({'gabel'}, StdModule.say, {npcHandler = npcHandler, text = 'He is our leader. He does have his mistakes, but then he always tries to do what he thinks is right, and I suppose that makes him a good leader.'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'I have met him myself. He was a sharp thinker and a charismatic conversationalist. ...'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Eons ago when I was still young I felt the world was a place of wonder and joy. Now all I see is a badly working system full of design flaws. ...'})
keywordHandler:addKeyword({'rah'}, StdModule.say, {npcHandler = npcHandler, text = 'Another cornerstone of the undead pharaoh\'s theological theories. I do not know much more about it, I\'m afraid.'})
keywordHandler:addKeyword({'scarab'}, StdModule.say, {npcHandler = npcHandler, text = 'An interesting species. Oh, they are as thick as two short planks, of course, but there is definitely something magic about them. ...'})
keywordHandler:addKeyword({'ascension'}, StdModule.say, {npcHandler = npcHandler, text = 'A fundamental part of the pharaoh\'s cult. I have not studied it in any detail, though.'})
keywordHandler:addKeyword({'efreet'}, StdModule.say, {npcHandler = npcHandler, text = 'I have not be been able to figure out exactly why the Efreet have developed a different skin colour. ...'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'I am not much of a traveller, but I would like to see the northern cities everbody is talking about. Perhaps one day I will do that. Oh, I will use some kind of magical disguise, of course.'})
keywordHandler:addKeyword({'darashia'}, StdModule.say, {npcHandler = npcHandler, text = 'Darashia is comparatively young. The local ruler managed to establish his own little caliphate thanks to the riches he accumulated. ...'})
keywordHandler:addKeyword({'pharaoh'}, StdModule.say, {npcHandler = npcHandler, text = 'Apparently the whole issue of dying in order to extend the natural life span was his idea. Those humans. You never know what they come up with next!'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

