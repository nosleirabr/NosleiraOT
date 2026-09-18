local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_FAREWELL, 'Woof! <wiggle>')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Woof! <wiggle>')
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Meeep! Meeep!'})
keywordHandler:addKeyword({'bo'}, StdModule.say, {npcHandler = npcHandler, text = '<wiggle>'})
keywordHandler:addKeyword({'th'}, StdModule.say, {npcHandler = npcHandler, text = '<sniff>'})
keywordHandler:addKeyword({'an'}, StdModule.say, {npcHandler = npcHandler, text = 'Grrrr!'})
keywordHandler:addKeyword({'ar'}, StdModule.say, {npcHandler = npcHandler, text = 'Woof!'})
keywordHandler:addKeyword({'go'}, StdModule.say, {npcHandler = npcHandler, text = 'Woof! Woof!'})

local function creatureSayCallback(cid, type, msg)
	if not npcHandler:isFocused(cid) then return false end
	local player = Player(cid)
	
	if player:getStorageValue(12455) == 7 then
		if msgcontains(msg, "sniff") then
			npcHandler:say("<sniff> <sniff>", cid)
			npcHandler.topic[cid] = 1
		elseif npcHandler.topic[cid] == 1 or msgcontains(msg, "fur") or msgcontains(msg, "banana") or msgcontains(msg, "cheese") then
			if msgcontains(msg, "banana") or msgcontains(msg, "skin") then
				npcHandler:say("Woof! <wiggles tail happily>", cid)
			elseif msgcontains(msg, "cheese") or msgcontains(msg, "mouldy") then
				npcHandler:say("Woof! <licks nose>", cid)
			elseif msgcontains(msg, "fur") or msgcontains(msg, "piece of fur") or msgcontains(msg, "dirty fur") or player:getItemCount(2220) > 0 or player:getItemCount(2221) > 0 then
				npcHandler:say("Grrrrrr! Woof! Woof! <barks furiously and backs away>", cid)
				player:setStorageValue(12455, 8)
				npcHandler.topic[cid] = 0
			else
				npcHandler:say("<sniff>", cid)
			end
		end
	end
	return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

