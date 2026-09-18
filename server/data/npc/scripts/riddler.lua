local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, '|PLAYERNAME|! HEHEHEHE! Another fool! Excellent!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'HEHEHE! I knew you don\'t have the stomach.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'HEHEHE! I knew you don\'t have the stomach.')
keywordHandler:addKeyword({'tower'}, StdModule.say, {npcHandler = npcHandler, text = 'This tower, of course, silly one. It holds my master\'s treasure.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the guardian of the paradox tower.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is the age of the talon.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as the riddler. That is all you need to know.'})
keywordHandler:addKeyword({'key'}, StdModule.say, {npcHandler = npcHandler, text = 'The key of this tower! You will never find it! A malicious plant spirit is guarding it!'})
keywordHandler:addKeyword({'master'}, StdModule.say, {npcHandler = npcHandler, text = 'His name is none of your business.'})
keywordHandler:addKeyword({'guard'}, StdModule.say, {npcHandler = npcHandler, text = 'I am guarding the treasures of the tower. Only those who pass the test of the three sigils may pass.'})
local function creatureSayCallback(cid, type, msg)
	if not npcHandler:isFocused(cid) then return false end
	local player = Player(cid)
	local topic = npcHandler.topic[cid] or 0

	if msgcontains(msg, "test") or msgcontains(msg, "riddle") then
		npcHandler:say("Death awaits those who fail the test of the three seals! Do you really want me to test you?", cid)
		npcHandler.topic[cid] = 1

	elseif topic == 1 then
		if msgcontains(msg, "yes") then
			npcHandler:say("First Question: How many years did the war of the djinns last?", cid)
			npcHandler.topic[cid] = 2
		else
			npcHandler:say("HEHEHE! I knew you don't have the stomach for it!", cid)
			npcHandler.topic[cid] = 0
		end

	elseif topic == 2 then
		if msgcontains(msg, "2060") or msgcontains(msg, "2050") then
			npcHandler:say("Correct! Second Question: What is the name of the librarian in Hellgate?", cid)
			npcHandler.topic[cid] = 3
		else
			npcHandler:say("WRONG! HEHEHEHE!", cid)
			player:teleportTo(Position(32626, 31862, 10))
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
			npcHandler.topic[cid] = 0
		end

	elseif topic == 3 then
		if msgcontains(msg, "blinky") or msgcontains(msg, "486486") then
			npcHandler:say("Correct! Third Question: How many structure points does a magic wall have?", cid)
			npcHandler.topic[cid] = 4
		else
			npcHandler:say("WRONG! HEHEHEHE!", cid)
			player:teleportTo(Position(32626, 31862, 10))
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
			npcHandler.topic[cid] = 0
		end

	elseif topic == 4 then
		if msgcontains(msg, "4") or msgcontains(msg, "four") then
			npcHandler:say("Correct! Fourth Question: What is the number of the key to the prison of Mintwallin?", cid)
			npcHandler.topic[cid] = 5
		else
			npcHandler:say("WRONG! HEHEHEHE!", cid)
			player:teleportTo(Position(32626, 31862, 10))
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
			npcHandler.topic[cid] = 0
		end

	elseif topic == 5 then
		if msgcontains(msg, "3666") then
			npcHandler:say("Correct! Fifth Question: Who is the mother of Hugo?", cid)
			npcHandler.topic[cid] = 6
		else
			npcHandler:say("WRONG! HEHEHEHE!", cid)
			player:teleportTo(Position(32626, 31862, 10))
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
			npcHandler.topic[cid] = 0
		end

	elseif topic == 6 then
		if msgcontains(msg, "charlotta") or msgcontains(msg, "yenny") then
			npcHandler:say("Congratulations! You have passed the test! You may enter the treasure room above!", cid)
			player:setStorageValue(12001, 4)
			player:teleportTo(Position(32478, 31903, 1))
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
			npcHandler.topic[cid] = 0
		else
			npcHandler:say("WRONG! HEHEHEHE!", cid)
			player:teleportTo(Position(32626, 31862, 10))
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
			npcHandler.topic[cid] = 0
		end
	end
	return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

