local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end
function onThink() npcHandler:onThink() end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)
    local state = npcHandler:getTopic(cid)
    
    -- In real map, banshee quest seals are usually mapped to 6 distinct storages.
    -- However, the existing script used a single counter (50000) for seals.
    -- We'll assume the player has passed the seals if 50000 == 6 for compatibility,
    -- but provide the full dialogue sequence as requested.
    
    if msgcontains(msg, "seventh seal") or msgcontains(msg, "seventh") then
        if player:getLevel() < 60 then
            npcHandler:say("You are not experienced enough to master the challenges ahead or to receive knowledge about the seventh seal. Go and learn more before asking me again.", cid)
        elseif player:getStorageValue(50000) >= 7 then
            npcHandler:say("You already have my kiss and the final seal.", cid)
        else
            npcHandler:say("If you have passed the first six seals and entered the blue fires that lead to the chamber of the seal you might receive my {kiss} ... It will open the last seal. Do you think you are ready?", cid)
            npcHandler:setTopic(cid, 2)
        end
    elseif state == 2 and msgcontains(msg, "yes") then
        if player:getStorageValue(50000) >= 6 then
            npcHandler:say("Yessss, I can sense you have passed the seal of sacrifice. Have you passed any other seal yet?", cid)
            npcHandler:setTopic(cid, 3)
        else
            npcHandler:say("You have not passed the seal of sacrifice yet. Return to me when you are better prepared.", cid)
            npcHandler:setTopic(cid, 0)
        end
    elseif state == 3 and msgcontains(msg, "yes") then
        npcHandler:say("I sense you have passed the hidden seal as well. Have you passed any other seal yet?", cid)
        npcHandler:setTopic(cid, 4)
    elseif state == 4 and msgcontains(msg, "yes") then
        npcHandler:say("Oh yes, you have braved the plagueseal. Have you passed any other seal yet?", cid)
        npcHandler:setTopic(cid, 5)
    elseif state == 5 and msgcontains(msg, "yes") then
        npcHandler:say("Ah, I can sense the power of the seal of demonrage burning in your heart. Have you passed any other seal yet?", cid)
        npcHandler:setTopic(cid, 6)
    elseif state == 6 and msgcontains(msg, "yes") then
        npcHandler:say("So, you have managed to pass the seal of the true path. Have you passed any other seal yet?", cid)
        npcHandler:setTopic(cid, 7)
    elseif state == 7 and msgcontains(msg, "yes") then
        npcHandler:say("I see! You have mastered the seal of logic. You have made the sacrifice, you have seen the unseen, you possess fortitude, you have filled yourself with power and found your path. You may ask me for my {kiss} now.", cid)
        npcHandler:setTopic(cid, 8)
    elseif (msgcontains(msg, "kiss")) then
        if player:getStorageValue(50000) >= 7 then
            npcHandler:say("You have already received my kiss. You should know better then to ask for it.", cid)
        elseif npcHandler:getTopic(cid) == 8 or player:getStorageValue(50000) == 6 then
            npcHandler:say("Are you prepared to receive my kiss, even though this will mean that your death as well as a part of your soul will forever belong to me, my dear?", cid)
            npcHandler:setTopic(cid, 1)
        else
            npcHandler:say("To receive my kiss you have to pass all other seals first.", cid)
        end
    elseif state == 1 and msgcontains(msg, "yes") then
        npcHandler:say("So be it! Hmmmmmm...", cid)
        player:setStorageValue(50000, 7) -- The 7th Seal
        player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
        npcHandler:setTopic(cid, 0)
    elseif msgcontains(msg, "spectral dress") or msgcontains(msg, "spectral") then
        npcHandler:say("Your wish for a spectral dress is silly. Allthough I will grant you the permission to take one. My maidens left one in a box in a room, directly south of here.", cid)
        player:setStorageValue(40005, 1) -- Set spectral dress permission
        npcHandler:setTopic(cid, 0)
    end
    return true
end

keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'It is my curse to be the eternal guardian of this ancient place.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'It hurts me to even think about my mortal past. Its long lost and forgotten. So don\'t ask me about it!'})

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Be greeted, dear visitor. Come and stay ... a while.")
npcHandler:setMessage(MESSAGE_FAREWELL, "We will meet again.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "We will meet again.")
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
