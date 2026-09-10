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
    local state = npcHandler:getTopic(cid)
    local faction = player:getStorageValue(40000)
    local mission = player:getStorageValue(40001) -- Marid mission state

    if msgcontains(msg, "mission") then
        if faction == 2 then
            npcHandler:say("You are an ally of the Efreet! Begone!", cid)
            return false
        end

        if faction == -1 or faction == 0 then
            npcHandler:say("Are you offering your help to the Marid?", cid)
            npcHandler:setTopic(cid, 1)
        elseif faction == 1 then
            if mission < 3 then
                npcHandler:say("You have sworn loyalty to us, but you must first complete the missions given by Bo'ques and Fa'hradin.", cid)
            elseif mission == 3 then
                npcHandler:say("Fa'hradin has told me about your extraordinary exploit. I have one final mission for you. We need to retrieve Fa'hradin's lamp from the Orc King and place it in Malor's chambers. Are you prepared to do us that final favour?", cid)
                npcHandler:setTopic(cid, 2)
            elseif mission == 4 then
                npcHandler:say("Have you found Fa'hradin's lamp and placed it in Malor's personal chambers?", cid)
                npcHandler:setTopic(cid, 3)
            elseif mission >= 5 then
                npcHandler:say("You are a true friend of the Marid. You may now trade with Haroun and Nah'Bob.", cid)
            end
        end
    elseif state == 1 and msgcontains(msg, "yes") then
        npcHandler:say("Very well! You are now an ally of the Marid. You can never join the Efreet. Talk to Bo'ques for your first mission.", cid)
        player:setStorageValue(40000, 1) -- Set to Marid Faction
        player:setStorageValue(40001, 1) -- Start Marid missions
        npcHandler:setTopic(cid, 0)
    elseif state == 2 and msgcontains(msg, "yes") then
        npcHandler:say("All right. Listen! Sneak into Ulderek's Rock and find the lamp, then enter Mal'ouquah again and exchange his sleeping lamp with Fa'hradin's lamp!", cid)
        player:setStorageValue(40001, 4) -- Started final mission
        npcHandler:setTopic(cid, 0)
    elseif state == 3 and msgcontains(msg, "yes") then
        if player:getStorageValue(40007) == 1 then -- Assume swapping the lamp in Mal'ouquah sets this storage
            npcHandler:say("Daraman shall bless you and all humans! You have done us all a huge service! You are now welcome to trade with Haroun and Nah'bob!", cid)
            player:setStorageValue(40001, 5) -- Completed Marid quest
        else
            npcHandler:say("I don't think you have exchanged the lamp yet. Do not return until it is done!", cid)
        end
        npcHandler:setTopic(cid, 0)
    end
    return true
end

keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the King of the Marid.'})

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Welcome, human |PLAYERNAME|.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
npcHandler:addModule(FocusModule:new())
