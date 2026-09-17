local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Ah, the wind brings in another visitor. Feel welcome |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Daraman\'s blessings!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Daraman\'s blessings!')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'That city is getting noisier and more crowded each month.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a licensed carpetpilot and responsible for the Darashian airmail. I can bring you to the Femor Hills, Edron, or you can buy letters and parcels.'})
keywordHandler:addKeyword({'caliph'}, StdModule.say, {npcHandler = npcHandler, text = 'The caliph depends heavily on his carpetfleet for commerce and for war alike.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Chemar Ibn Kalith.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time, precisely.'})
keywordHandler:addKeyword({'drefia'}, StdModule.say, {npcHandler = npcHandler, text = 'In the west a big city existed. Its people were corrupted and drew the wrath of the djinn upon them and Drefia was destroyed.'})
keywordHandler:addKeyword({'passage'}, StdModule.say, {npcHandler = npcHandler, text = 'I can fly you to Femor Hills or Edron if you like. Where do you want to go?'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'This scourge of the west may have connections to the evil soils in Drefia.'})
keywordHandler:addKeyword({'femur'}, StdModule.say, {npcHandler = npcHandler, text = 'Are you sure that you are not talking about the FEMOR Hills?'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'The prophet of our people; praised be his name.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Our carpetpilots bring in too many news to recall them all.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'I think it\'s a rolemodel for what befalls people if they forget the teachings of Daraman.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I have been almost everywhere in the world and think it\'s only a myth.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)


addTravelKeyword(keywordHandler, npcHandler, 'femor hills', 60, TravelHarbours.carpetFemor, 'Femor Hills')
addTravelKeyword(keywordHandler, npcHandler, 'femor', 60, TravelHarbours.carpetFemor, 'Femor Hills')
addTravelKeyword(keywordHandler, npcHandler, 'edron', 40, TravelHarbours.carpetEdron, 'Edron')

shopModule:addBuyableItem({'parcel'}, 2595, 15, 1, 'parcel')
shopModule:addBuyableItem({'label'}, 2599, 1, 1, 'label')
shopModule:addBuyableItem({'letter'}, 2597, 8, 1, 'letter')
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


