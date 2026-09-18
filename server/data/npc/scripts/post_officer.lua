local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid) npcHandler:onCreatureAppear(cid) end
function onCreatureDisappear(cid) npcHandler:onCreatureDisappear(cid) end
function onThink() npcHandler:onThink() end
function onCreatureSay(cid, type, msg) npcHandler:onCreatureSay(cid, type, msg) end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'parcel'}, 2595, 15, 'parcel')
shopModule:addBuyableItem({'letter'}, 2597, 8, 'letter')
shopModule:addBuyableItem({'label'}, 2599, 1, 'label')

local officerStorages = {
    ["ben"] = 12462,
    ["lokur"] = 12463,
    ["dove"] = 12464,
    ["liane"] = 12465,
    ["chrystal"] = 12466,
    ["olrik"] = 12467
}

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)
    
    if msgcontains(msg, "measurements") then
        local missionProgress = player:getStorageValue(12456)
        if missionProgress >= 1 and missionProgress < 7 then
            local npcName = string.lower(Npc():getName())
            local storageKey = officerStorages[npcName] or 12468
            
            if player:getStorageValue(storageKey) < 1 then
                -- Registra medição individual do oficial e avança o progresso global da missão
                player:setStorageValue(storageKey, 1)
                player:setStorageValue(12456, missionProgress + 1)
                npcHandler:say("Oh, I don't know my measurements. You should just guess them.", cid)
            else
                npcHandler:say("I already gave you my measurements!", cid)
            end
        else
            npcHandler:say("I have nothing to measure.", cid)
        end
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Greetings |PLAYERNAME|! Welcome to my post office.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)
