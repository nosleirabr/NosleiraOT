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

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)
    
    if msgcontains(msg, "measurements") then
        local mission = player:getStorageValue(40003)
        if mission == 8 then
            npcHandler:say("Oh, I don't know my measurements. You should just guess them.", cid)
            -- A simplificação: o npc já deu a "measurement". 
            -- Na quest original usava storage separada para cada um, mas para o M2 a key já indica progresso
            -- Podemos apenas avançar o storage da mission principal para quem já pegou todos ou não, mas
            -- a quest "Kevin" assume que pegou e avança para 9 na conversa dele, então aqui é só lore.
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
