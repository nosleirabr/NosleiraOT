local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end
function onThink() npcHandler:onThink() end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then
        return false
    end

    local player = Player(cid)
    local state = npcHandler:getTopic(cid)
    msg = msg:lower()

    if msgcontains(msg, 'change gold') then
        npcHandler:say('How many platinum coins would you like to get?', cid)
        npcHandler:setTopic(cid, 1)
    elseif msgcontains(msg, 'change platinum') then
        npcHandler:say('Would you like to change your platinum coins into {gold} or {crystal}?', cid)
        npcHandler:setTopic(cid, 2)
    elseif msgcontains(msg, 'change crystal') then
        npcHandler:say('How many crystal coins would you like to change into platinum?', cid)
        npcHandler:setTopic(cid, 3)
        
    -- Gold -> Platinum
    elseif state == 1 then
        local amount = tonumber(msg)
        if amount and amount > 0 then
            local cost = amount * 100
            if player:removeItem(2148, cost) then
                player:addItem(2152, amount)
                npcHandler:say('Here you are.', cid)
            else
                npcHandler:say('You do not have enough gold coins.', cid)
            end
        else
            npcHandler:say('Please tell me how many platinum coins you would like to get.', cid)
        end
        npcHandler:setTopic(cid, 0)

    -- Platinum choices
    elseif state == 2 then
        if msgcontains(msg, 'gold') then
            npcHandler:say('How many platinum coins would you like to change into gold?', cid)
            npcHandler:setTopic(cid, 4)
        elseif msgcontains(msg, 'crystal') then
            npcHandler:say('How many crystal coins would you like to get?', cid)
            npcHandler:setTopic(cid, 5)
        else
            npcHandler:say('Well, can I help you with something else?', cid)
            npcHandler:setTopic(cid, 0)
        end
        
    -- Crystal -> Platinum
    elseif state == 3 then
        local amount = tonumber(msg)
        if amount and amount > 0 then
            if player:removeItem(2160, amount) then
                player:addItem(2152, amount * 100)
                npcHandler:say('Here you are.', cid)
            else
                npcHandler:say('You do not have enough crystal coins.', cid)
            end
        else
            npcHandler:say('Please tell me how many crystal coins you would like to change.', cid)
        end
        npcHandler:setTopic(cid, 0)
        
    -- Platinum -> Gold
    elseif state == 4 then
        local amount = tonumber(msg)
        if amount and amount > 0 then
            if player:removeItem(2152, amount) then
                player:addItem(2148, amount * 100)
                npcHandler:say('Here you are.', cid)
            else
                npcHandler:say('You do not have enough platinum coins.', cid)
            end
        else
            npcHandler:say('Please tell me how many platinum coins you would like to change.', cid)
        end
        npcHandler:setTopic(cid, 0)

    -- Platinum -> Crystal
    elseif state == 5 then
        local amount = tonumber(msg)
        if amount and amount > 0 then
            local cost = amount * 100
            if player:removeItem(2152, cost) then
                player:addItem(2160, amount)
                npcHandler:say('Here you are.', cid)
            else
                npcHandler:say('You do not have enough platinum coins.', cid)
            end
        else
            npcHandler:say('Please tell me how many crystal coins you would like to get.', cid)
        end
        npcHandler:setTopic(cid, 0)
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
