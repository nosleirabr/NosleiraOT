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

    if msgcontains(msg, "dead rat") or (msgcontains(msg, "rat") and not msgcontains(msg, "rats")) then
        npcHandler:say("Have you brought a dead rat to me to collect your bounty?", cid)
        npcHandler:setTopic(cid, 1)
    elseif state == 1 and msgcontains(msg, "yes") then
        if player:removeItem(2813, 1) then -- Fresh dead rat
            npcHandler:say("Excellent! Here is your reward of 2 gold coins.", cid)
            player:addMoney(2)
        else
            npcHandler:say("You don't have any fresh dead rats.", cid)
        end
        npcHandler:setTopic(cid, 0)
    elseif msgcontains(msg, "key") then
        if player:getStorageValue(50031) < 1 then
            npcHandler:say("Here is the key for the training room. Don't lose it!", cid)
            local key = player:addItem(2087, 1) -- Wooden Key
            if key then
                key:setAttribute(ITEM_ATTRIBUTE_ACTIONID, 4600)
            end
            player:setStorageValue(50031, 1)
        else
            npcHandler:say("I already gave you a key.", cid)
        end
        npcHandler:setTopic(cid, 0)
    end

	return true
end

npcHandler:setMessage(MESSAGE_GREET, 'Greetings, |PLAYERNAME|! I am the head of this academy. If you need a {mission} or want to sell {dead rats}, just ask.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May the gods protect you.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May the gods protect you.')
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:addModule(FocusModule:new())