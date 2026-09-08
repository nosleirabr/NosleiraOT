local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Just great, another ... \'customer\'. Hello, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'That\'s music in my ears.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'That\'s music in my ears.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Is it time for lunch already? Hey, stop making fun of me!'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a salesman, I sell headgear ... uhm ... oh well, and shoes.'})
keywordHandler:addKeyword({'amazon'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard that chicks wear some revealing pieces of armor!'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I\'m Aldo. No one calls me \'lucky Aldo\' though, guess why!'})
keywordHandler:addKeyword({'shoes'}, StdModule.say, {npcHandler = npcHandler, text = '<sigh> We sell leather boots and sandals.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'So many feet ... so many ... a nightmare!'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Can\'t be worse than my wife.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Hey, I am a man. Look for some women to share gossip.'})
keywordHandler:addKeyword({'wife'}, StdModule.say, {npcHandler = npcHandler, text = 'Leave me alone with her while I am working at least. My only pleasure around here!'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'I doubt I will ever see much of it. It\'s like i am cursed to haunt this site here for the rest of my life.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'A city ruled by women!? Could anything be worse?'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'One day I will sell the king a pair of shoes made by me and will get out of that stinky hole I live in and my family will never find me. HE, HE!'})
keywordHandler:addKeyword({'trouser'}, StdModule.say, {npcHandler = npcHandler, text = 'We offer leather legs and studded legs.'})
keywordHandler:addKeyword({'bill'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes, I have to pay o lot of bills, and some georges, and a john, and several steves.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'I will never in my life make it there.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'My boss, an evil slaver of good people like me.'})
keywordHandler:addKeyword({'headgear'}, StdModule.say, {npcHandler = npcHandler, text = 'We have leather helmets and studded helmets.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I am damned to sell headgear, trousers, and shoes for the rest of my life.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I have other stuff to worry about, like paying my bills.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'studded'}, 3376, 63, 'studded')
shopModule:addBuyableItem({'sandals'}, 3551, 2, 'sandals')
shopModule:addBuyableItem({'leather'}, 3552, 2, 'leather')
shopModule:addBuyableItem({'leather'}, 3559, 10, 'leather')
shopModule:addBuyableItem({'studded'}, 3362, 60, 'studded')
shopModule:addBuyableItem({'leather'}, 3355, 12, 'leather')

npcHandler:addModule(FocusModule:new())

