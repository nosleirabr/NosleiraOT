local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local function creatureSayCallback(cid, type, msg)
	if not npcHandler:isFocused(cid) then
		return false
	end

	local player = Player(cid)
    local state = npcHandler:getTopic(cid)
    local storage = 50030 -- Amber's notebook storage

    if msgcontains(msg, "notebook") then
        if player:getStorageValue(storage) < 1 then
            npcHandler:say("Oh, you found my notebook! Will you give it to me?", cid)
            npcHandler:setTopic(cid, 1)
        else
            npcHandler:say("You already returned my notebook to me. Thank you!", cid)
        end
    elseif state == 1 and msgcontains(msg, "yes") then
        if player:removeItem(1968, 1) or player:removeItem(1957, 1) then -- Book
            npcHandler:say("Thank you very much. Let me reward you with this short sword.", cid)
            player:setStorageValue(storage, 1)
            player:addItem(2406, 1) -- Short Sword
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
        else
            npcHandler:say("You don't have it.", cid)
        end
        npcHandler:setTopic(cid, 0)
    end

	return true
end

npcHandler:setMessage(MESSAGE_GREET, 'Hello, |PLAYERNAME|! What brings you here?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye, bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye, bye.')
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:addModule(FocusModule:new())