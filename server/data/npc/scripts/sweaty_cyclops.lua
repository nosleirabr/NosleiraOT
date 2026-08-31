local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onThink() npcHandler:onThink() end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)

    if msgcontains(msg, "amulet") then
        npcHandler:say("Me can do holy amulet! But me need melted gold and holy symbol!", cid)
    
    elseif msgcontains(msg, "melted gold") then
        if player:removeItem(2157, 1) then -- gold ingot
            npcHandler:say("Here is melted gold!", cid)
            player:addItem(2015, 1) -- cup of melted gold
        else
            npcHandler:say("You no have gold to melt!", cid)
        end

    elseif msgcontains(msg, "royal steel") then
        if player:removeItem(2487, 1) then -- crown armor
            npcHandler:say("Uhm, crown armor for royal steel. Here!", cid)
            player:addItem(5887, 1) -- piece of royal steel
        else
            npcHandler:say("You no have crown armor to melt!", cid)
        end

    elseif msgcontains(msg, "draconian steel") then
        if player:removeItem(2516, 1) then -- dragon shield
            npcHandler:say("Uhm, dragon shield for draconian steel. Here!", cid)
            player:addItem(5889, 1) -- piece of draconian steel
        else
            npcHandler:say("You no have dragon shield to melt!", cid)
        end

    elseif msgcontains(msg, "hell steel") then
        if player:removeItem(2462, 1) then -- devil helmet
            npcHandler:say("Uhm, devil helmet for hell steel. Here!", cid)
            player:addItem(5888, 1) -- piece of hell steel
        else
            npcHandler:say("You no have devil helmet to melt!", cid)
        end

    elseif msgcontains(msg, "chunk of iron") then
        if player:removeItem(2393, 1) then -- giant sword
            npcHandler:say("Uhm, giant sword for chunk of iron. Here!", cid)
            player:addItem(5892, 1) -- chunk of iron
        else
            npcHandler:say("You no have giant sword to melt!", cid)
        end

    elseif msgcontains(msg, "warlord sword") then
        npcHandler:say("Me not give you warlord sword! Me keeping it! You need bring me 100 chunks of iron first!", cid)
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Hum Humn! Welcume lil' |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Good bye lil' one.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Good bye lil' one.")
npcHandler:addModule(FocusModule:new())
