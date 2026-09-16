local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

-- Blind Orc Trade System
local items = {
    ["batt"] = {id = 2456, price = 400}, -- Bow
    ["pio"] = {id = 2544, price = 3}, -- Arrow
    ["maka"] = {id = 2467, price = 25}, -- Leather Armor
    ["tulook"] = {id = 2526, price = 50}, -- Studded Shield
    ["ikem"] = {id = 2461, price = 12} -- Leather Helmet
}

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then
        if msgcontains(msg, "charach") then
            npcHandler:addFocus(cid)
            npcHandler:say("Charach " .. Player(cid):getName() .. "!", cid)
        end
        return false
    end

    if msgcontains(msg, "futaba") then
        npcHandler:say("Futaba!", cid)
        npcHandler:releaseFocus(cid)
        return true
    end

    local player = Player(cid)
    local state = npcHandler:getTopic(cid)

    if msgcontains(msg, "burka") then
        for name, data in pairs(items) do
            if msgcontains(msg, name) then
                npcHandler:say("Maruk " .. name .. "? " .. data.price .. " gold?", cid)
                npcHandler:setTopic(cid, data.price * 1000 + data.id) -- Encodes price and ID
                return true
            end
        end
        npcHandler:say("Burka?", cid)
    elseif state > 0 and msgcontains(msg, "mok") then
        local price = math.floor(state / 1000)
        local itemId = state % 1000

        if player:removeMoney(price) then
            player:addItem(itemId, 1)
            npcHandler:say("Mok!", cid)
        else
            npcHandler:say("Nix gold!", cid)
        end
        npcHandler:setTopic(cid, 0)
    elseif state > 0 and msgcontains(msg, "nix") then
        npcHandler:say("Nix?", cid)
        npcHandler:setTopic(cid, 0)
    end

    return true
end

-- Override default greeting
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
