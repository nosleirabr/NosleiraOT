local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Remember - this conversation never took place!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Remember - this conversation never took place!')
keywordHandler:addKeyword({'password'}, StdModule.say, {npcHandler = npcHandler, text = '\'Pied Piper\'. Hilarious. Fa\'Hradin has a very strange sense of humour.'})
keywordHandler:addKeyword({'alesar'}, StdModule.say, {npcHandler = npcHandler, text = 'His defection was a serious blow to our cause. Both Gabel and Fa\'hradin are more concerned about it than they dare admit. ...'})
keywordHandler:addKeyword({'ascension'}, StdModule.say, {npcHandler = npcHandler, text = 'I am not much into religion, but from what I know this is an important part of that foolish pharaoh\'s creed.'})
keywordHandler:addKeyword({'lamp'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh to sleep in warm, comfy lamp! It\'s been such a long time!'})
keywordHandler:addKeyword({'trade'}, StdModule.say, {npcHandler = npcHandler, text = 'Trade? Look at me! Do I look as if I had any pockets to stash stuff in?'})
keywordHandler:addKeyword({'djinn'}, StdModule.say, {npcHandler = npcHandler, text = 'I used to be one, too. That was before Fa\'hradin had the bright idea to turn me into a flea-ridden rodent.'})
keywordHandler:addKeyword({'darashia'}, StdModule.say, {npcHandler = npcHandler, text = 'I have heard nice things about that city. I wish I had an assignment there rather than in this god-forsaken place.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m a spy. Now guess what I\'ve come here for!'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'Daraman? Well, he was a great prophet, but... look, this is not a good point of time to discuss philosophy, ok?'})
keywordHandler:addKeyword({'ankrahmun'}, StdModule.say, {npcHandler = npcHandler, text = 'That is the one place where I would hate to work even more. My sources there have told me the city is now controlled by some loony who thinks he is a god or something.'})
keywordHandler:addKeyword({'melchior'}, StdModule.say, {npcHandler = npcHandler, text = 'Hm. No - doesn\'t ring a bell.'})
keywordHandler:addKeyword({'palace'}, StdModule.say, {npcHandler = npcHandler, text = 'The palace in Ankrahmun used to be renowned for its splendour and its hospitable atmosphere. Now I suppose rats are the only living creatures that are still tolerated in this place. Hang on... I hope this does not give Gabel ideas.'})
keywordHandler:addKeyword({'efreet'}, StdModule.say, {npcHandler = npcHandler, text = 'After many months of careful study I have come to the conclusion the efreet are much more different from us Marid then I thought! Their skin is green, for a start!'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'No more kings for us! We are a democratic people now! Well, sort of.'})
keywordHandler:addKeyword({'rah'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes... rings a bell. Has to do with Ankrahmun\'s pharaoh, hasn\'t it?'})
keywordHandler:addKeyword({'marid'}, StdModule.say, {npcHandler = npcHandler, text = 'I haven\'t seen my brothers for a long time.'})
keywordHandler:addKeyword({'pharaoh'}, StdModule.say, {npcHandler = npcHandler, text = 'They say the new pharaoh is completely out of his mind. Rumour has it that he became an undead on his own free will! I think that says it all.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'I have heard lots about the human cities to the north. Perhaps I will be sent there one day. That would be a lovely change.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'A nice world. I think I prefer it to all others. Not that I have seen any others, of course.'})
keywordHandler:addKeyword({'scarab'}, StdModule.say, {npcHandler = npcHandler, text = 'A scarab? What? Where? Hey, don\'t give me shock like that! Did you know they eat rats?!'})
keywordHandler:addKeyword({'human'}, StdModule.say, {npcHandler = npcHandler, text = 'So Fa\'hradin turned you into a human? That\'s really hard, buddy. Rats, humans... what comes next?'})
keywordHandler:addKeyword({'gabel'}, StdModule.say, {npcHandler = npcHandler, text = 'Gabel is our undisputed leader, even though he is too modest to brag with it. Even though Fa\'hradin coordinates all military operations it is always Gabel who has the final say.'})
keywordHandler:addKeyword({'zathroth'}, StdModule.say, {npcHandler = npcHandler, text = 'Zathroth was the creator of our race. Which doesn\'t mean we like him. But too be honest, I don\'t think this is the time and place to discuss religious matters.'})
keywordHandler:addKeyword({'malor'}, StdModule.say, {npcHandler = npcHandler, text = 'I have found out all kinds of things about him! He is left-handed, his favourite dish is hyena chop roasted in sandwasp honey marinade, and he has this weird habit of scratching his right ear whenever he is angry - which happens quite often, I might add.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I have many names and faces. But I suppose you can call me Rata\'mari.'})
keywordHandler:addKeyword({'rat'}, StdModule.say, {npcHandler = npcHandler, text = 'Your power of observation is stunning. Yes, I\'m a rat.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

