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
    local fugioStorage = 50202
    local catacombsStorage = 50203

    -- Healing Logic
	if msgcontains(msg, 'heal') then
        if player:getCondition(CONDITION_FIRE) then
            player:removeCondition(CONDITION_FIRE)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_GREEN)
            npcHandler:say('You are burning. Let me quench those flames.', cid)
        elseif player:getCondition(CONDITION_POISON) then
            player:removeCondition(CONDITION_POISON)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
            npcHandler:say('You are poisoned. Let me soothe your pain.', cid)
        elseif player:getCondition(CONDITION_ENERGY) then
            player:removeCondition(CONDITION_ENERGY)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_GREEN)
            npcHandler:say('You are electrified, my child. Let me help you to stop trembling.', cid)
        elseif player:getHealth() < 65 then
            local health = player:getHealth()
            player:addHealth(65 - health)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
            npcHandler:say('You are hurt, my child. I will heal your wounds.', cid)
        else
            npcHandler:say('You aren\'t looking that bad. Sorry, I can\'t help you. Come back when you are badly wounded or poisoned.', cid)
        end
        return true
    end

    if msgcontains(msg, "fugio") then
        if player:getStorageValue(catacombsStorage) < 1 then
            npcHandler:say("To be honest, I fear the omen in my dreams may be true. Perhaps Fugio is unable to see the danger down there. Perhaps ... you are willing to investigate this matter?", cid)
            npcHandler:setTopic(cid, 1)
        elseif player:getStorageValue(fugioStorage) < 1 then
            npcHandler:say("Have you found his {diary}?", cid)
        else
            npcHandler:say("May he rest in peace.", cid)
        end
    elseif msgcontains(msg, "diary") then
        if player:getStorageValue(catacombsStorage) >= 1 and player:getStorageValue(fugioStorage) < 1 then
            npcHandler:say("Did you find brother Fugio's diary?", cid)
            npcHandler:setTopic(cid, 2)
        elseif player:getStorageValue(fugioStorage) >= 1 then
            npcHandler:say("Thank you again for returning it to us.", cid)
        end
    elseif state == 1 and msgcontains(msg, "yes") then
        npcHandler:say("Thank you very much! From now on you may open the warded doors to the catacombs.", cid)
        player:setStorageValue(catacombsStorage, 1)
        npcHandler:setTopic(cid, 0)
    elseif state == 2 and msgcontains(msg, "yes") then
        -- 1957, 1970, 1958, 1959 are generic books
        if player:removeItem(1957, 1) or player:removeItem(1970, 1) or player:removeItem(1958, 1) or player:removeItem(1959, 1) then
            npcHandler:say("By the gods! This is brother Fugio's handwriting and what I read is horrible indeed! You have done our order a great favour by giving this diary to me! Take this blessed Ankh. May it protect you in even your darkest hours.", cid)
            player:setStorageValue(fugioStorage, 1)
            player:addItem(2193, 1) -- Blessed Ankh
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
        else
            npcHandler:say("You don't have it.", cid)
        end
        npcHandler:setTopic(cid, 0)
    elseif msgcontains(msg, "passage") then
        if player:getStorageValue(catacombsStorage) >= 1 then
            npcHandler:say("Oh of course, I will order Jack and the fisher Windtrouser to give you transportation if needed.", cid)
            player:setStorageValue(50204, 1) -- Transport permission
        else
            npcHandler:say("You should not be here at all and I won't allow anyone to transport you from or to this isle.", cid)
        end
    end

	return true
end

keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a humble servant of the gods. I can {heal} you if you are wounded or poisoned.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask me to {heal} you if you are hurt.'})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|! If you are wounded or poisoned, I can {heal} you.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May the gods bless you, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May the gods watch over you.')
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:addModule(FocusModule:new())