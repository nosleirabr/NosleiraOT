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
    local mission = player:getStorageValue(40002)

    if msgcontains(msg, "mission") then
        if faction == 1 then
            npcHandler:say("You are an ally of the Marid! Begone!", cid)
            return false
        elseif faction ~= 2 then
            npcHandler:say("You are not allied with the Efreet yet.", cid)
            return false
        end

        if mission < 1 then
            npcHandler:say("So you want to fight for the Efreet? We have a problem with a human thief in Thais named Partos. Find him in the prison and report back. Do you accept this mission?", cid)
            npcHandler:setTopic(cid, 1)
        elseif mission == 1 then
            npcHandler:say("Have you found Partos in Thais and spoken with him?", cid)
            npcHandler:setTopic(cid, 2)
        elseif mission >= 2 then
            npcHandler:say("You have already completed my mission. Talk to Alesar for your next assignment.", cid)
        end
    elseif state == 1 and msgcontains(msg, "yes") then
        npcHandler:say("Excellent! Find him in the Thais prison and learn what he did with our supplies.", cid)
        player:setStorageValue(40002, 1) -- Started mission 1
        npcHandler:setTopic(cid, 0)
    elseif state == 2 and msgcontains(msg, "yes") then
        if player:getStorageValue(40006) == 1 then -- Assume Partos sets this storage when spoken to
            npcHandler:say("Well done! You have proven your worth. You may now ask Alesar for a mission.", cid)
            player:setStorageValue(40002, 2) -- Completed mission 1
        else
            npcHandler:say("Do not lie to me, human! You have not spoken with him yet.", cid)
        end
        npcHandler:setTopic(cid, 0)
    end
    return true
end

keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the commander-in-chief of King Malor\'s army.'})

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Welcome, human |PLAYERNAME|. Speak up.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
npcHandler:addModule(FocusModule:new())
