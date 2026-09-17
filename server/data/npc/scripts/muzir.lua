local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome |PLAYERNAME|! Daraman\'s blessings.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Daraman\'s blessings.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Daraman\'s blessings.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am honoured to be the grandwezir of the caliph.'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'I take it upon me to involve myself with worldly issues for the prosperity of our community. I hope the taint of wealth does not harm my soul too much.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It is exactly the current time.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Muzir.'})
keywordHandler:addKeyword({'wezir'}, StdModule.say, {npcHandler = npcHandler, text = 'I am responsible for the wealth of our beloved and wise caliph. I can also change money for you.'})
keywordHandler:addKeyword({'caliph'}, StdModule.say, {npcHandler = npcHandler, text = 'I am caretaker for the fortune of our beloved and wise caliph.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'vial'}, 2006, 5, 1, 'vial')
shopModule:addSellableItem({'blank'}, 2260, 10, 'blank rune')
shopModule:addSellableItem({'life'}, 2006, 60, 'life fluid')
shopModule:addSellableItem({'mana'}, 2006, 100, 'mana fluid')
shopModule:addSellableItem({'spellbook'}, 2217, 150, 'spellbook')

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

