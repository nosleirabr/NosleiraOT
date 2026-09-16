local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onThink() npcHandler:onThink() end

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then
        if msgcontains(msg, 'hi') or msgcontains(msg, 'hello') then
            local player = Player(cid)
            -- Orc King's trap happens once per player (to ensure everyone gets the 7.4 scare experience)
            if player:getStorageValue(40010) ~= 1 then
                npcHandler:say("Arrrrgh! A balif! Guards! Guards!", cid)
                player:setStorageValue(40010, 1)
                
                local pos = npcHandler:getCreature():getPosition()
                Game.createMonster("Slime", Position(pos.x - 1, pos.y, pos.z))
                Game.createMonster("Slime", Position(pos.x + 1, pos.y, pos.z))
                Game.createMonster("Slime", Position(pos.x, pos.y - 1, pos.z))
                Game.createMonster("Orc Leader", Position(pos.x - 1, pos.y - 1, pos.z))
                Game.createMonster("Orc Leader", Position(pos.x + 1, pos.y - 1, pos.z))
                Game.createMonster("Orc Warlord", Position(pos.x, pos.y + 1, pos.z))
                return false
            else
                npcHandler:onCreatureSay(cid, type, msg)
                npcHandler:addFocus(cid)
            end
        end
        return false
    end

    local player = Player(cid)
    local state = npcHandler:getTopic(cid)

    if msgcontains(msg, "lamp") then
        if player:getStorageValue(40001) == 2 or player:getStorageValue(40002) == 2 then -- Djinn War mission
            npcHandler:say("I can sense your evil intentions to steal my magic lamp! But I won't let you! ... Wait, you want it for the Djinns? Hmmm. Take it and begone!", cid)
            player:addItem(2344, 1) -- Magic Lamp
            -- Advance Djinn mission (Blue or Green)
            if player:getStorageValue(40001) == 2 then
                player:setStorageValue(40001, 3)
            elseif player:getStorageValue(40002) == 2 then
                player:setStorageValue(40002, 3)
            end
        else
            npcHandler:say("I will never give my magic lamp to you!", cid)
        end
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "What do you want from me, |PLAYERNAME|?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Begone!")
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
