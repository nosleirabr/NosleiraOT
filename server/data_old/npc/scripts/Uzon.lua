local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Daraman\'s blessings, traveller |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Daraman\'s blessings')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Daraman\'s blessings')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time right now. The next flight is scheduled soon.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a licensed Darashian carpetpilot. I can bring you to Darashia or Edron.'})
keywordHandler:addKeyword({'caliph'}, StdModule.say, {npcHandler = npcHandler, text = 'The caliph welcomes travellers to his land.'})
keywordHandler:addKeyword({'fly'}, StdModule.say, {npcHandler = npcHandler, text = 'I transport travellers to the continent of Darama for a small fee. So many want to see the wonders of the desert and learn the secrets of Darama.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as Uzon Ibn Kalith.'})
keywordHandler:addKeyword({'drefia'}, StdModule.say, {npcHandler = npcHandler, text = 'So you heared about haunted Drefia? Many adventures travel there to test their skills against the undead: vampires, mummies, and ghosts.'})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = 'I can fly you to Darashia on Darama or Edron if you like. Where do you want to go?'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'I would never transport this one.'})
keywordHandler:addKeyword({'continent'}, StdModule.say, {npcHandler = npcHandler, text = 'I could retell the tales of my travels for hours. Sadly another flight is scheduled soon.'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, there is so much to tell about Daraman. You better travel to Darama to learn about his teachings.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'I have seen almost every place on the continent.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'I heard too many news to recall them all.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is noisy and overcroweded. That\'s why I like Darashia more.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Just another Thais but with women to lead them.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'Some people claim it is hidden somewhere under the endless sands of the devourer desert in Darama.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

