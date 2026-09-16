local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings, |PLAYERNAME|. Welcome to the distance fighting booth of the Ironhouse.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Goodbye, and may the gods be with you.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Goodbye, and may the gods be with you.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t know, maybe what you really need is a watch.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the humble supplier for distance fighting weapons of the Ironhouse, owned by Abran Ironeye.'})
keywordHandler:addKeyword({'Xed'}, StdModule.say, {npcHandler = npcHandler, text = 'Yeah, nice name, eh?'})
keywordHandler:addKeyword({'ammo'}, StdModule.say, {npcHandler = npcHandler, text = 'Do you need arrows for a bow, or bolts for a crossbow?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'People call me Xed, but my full name is Xedem.'})
keywordHandler:addKeyword({'hurt'}, StdModule.say, {npcHandler = npcHandler, text = 'Go to a priest. I am sure they will fix you up.'})
keywordHandler:addKeyword({'amazons'}, StdModule.say, {npcHandler = npcHandler, text = 'They are a band or tribe of strange women that have nothing in common with civilized men like me.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'We supply the archers of the army with distance fighting weapons.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Yeah, these awful beasts. They live in the swamps near the city and in dark dungeons.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard rumours somewhere that his father was called Hugo.'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'I am selling bows, crossbows, and ammunition. Do you need anything?'})
keywordHandler:addKeyword({'Kaz'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, that\'s short for Kazordoon.'})
keywordHandler:addKeyword({'honest'}, StdModule.say, {npcHandler = npcHandler, text = 'Well, I overheard the boss discussing some shady deals with a man in a black cloak.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell items of the distance type.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Some people say Ferumbras isn\'t really dead. Crazy kids!'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, they are all over. You never see more of them than in Kaz, though.'})
keywordHandler:addKeyword({'general'}, StdModule.say, {npcHandler = npcHandler, text = 'You must be talking of the great general Benjamin. He saved the kingdom from ferumbras you know.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I think that was the sword they were talking about. Said something about a man in Edron that could get it for him.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'arrow'}, 3447, 2, 'arrow')
shopModule:addBuyableItem({'bow'}, 3350, 400, 'bow')
shopModule:addBuyableItem({'crossbow'}, 3349, 500, 'crossbow')
shopModule:addBuyableItem({'bolt'}, 3446, 3, 'bolt')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

