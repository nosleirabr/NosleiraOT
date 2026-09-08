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
    local mission = player:getStorageValue(40003)

    if msgcontains(msg, "mission") then
        if mission < 1 then
            npcHandler:say("You are not a member of our guild yet! We have high standards for our mailmen. Would you like to join?", cid)
            npcHandler:setTopic(cid, 1)
        elseif mission == 1 then
            npcHandler:say("Your first task is simple. I need you to check our postal routes. Ask Captain Bluebear in Thais about his route, then Uzon, then Captain Seahorse, and finally Brodrosch. Come back when you checked all of them.", cid)
            player:setStorageValue(40003, 2)
        elseif mission == 2 then
            if player:getStorageValue(40010) >= 4 then
                npcHandler:say("Excellent! You checked all the routes. Now your next mission is to fix the broken mailbox on Folda. Take this crowbar and fix it, then report back to me.", cid)
                player:addItem(2416, 1) -- crowbar
                player:setStorageValue(40003, 3)
            else
                npcHandler:say("You haven't checked all the routes yet. Please do so.", cid)
            end
        elseif mission == 3 then
            if player:getStorageValue(40011) == 1 then
                npcHandler:say("Excellent, you got it fixed! Now you must deliver a bill to David Brassacres in Venore. He is hiding from creditors.", cid)
                player:addItem(2327, 1) -- bill
                player:setStorageValue(40003, 4)
            else
                npcHandler:say("The mailbox on Folda is still broken. Go fix it with the crowbar.", cid)
            end
        elseif mission == 4 then
            if player:getStorageValue(40012) == 1 then
                npcHandler:say("You truly got him? Quite impressive. Now, I need 20 bones for our postal dogs. Bring them to me.", cid)
                player:setStorageValue(40003, 5)
            else
                npcHandler:say("You haven't delivered the bill to David Brassacres yet.", cid)
            end
        elseif mission == 5 then
            if player:removeItem(2230, 20) then
                npcHandler:say("You have made it! We have enough bones for the fund! Now, take this present to Dermot in Fibula.", cid)
                player:addItem(2331, 1) -- present
                player:setStorageValue(40003, 6)
            else
                npcHandler:say("You do not have 20 bones with you.", cid)
            end
        elseif mission == 6 then
            if player:getStorageValue(40013) == 1 then
                npcHandler:say("Splendid. Now, we need new uniforms. Go to Venore and negotiate with Hugo.", cid)
                player:setStorageValue(40003, 7)
            else
                npcHandler:say("You haven't delivered the present to Dermot yet.", cid)
            end
        elseif mission == 7 then
            if player:getStorageValue(40014) == 1 then
                npcHandler:say("Good. Now bring me the measurements of our post officers: Benjamin, Lokur, Dove, Liane, Chrystal, and Olrik.", cid)
                player:setStorageValue(40003, 8)
            else
                npcHandler:say("You haven't negotiated with Hugo yet.", cid)
            end
        elseif mission == 8 then
            if player:getStorageValue(40015) >= 6 then
                npcHandler:say("Great! Our courier Waldo is missing. Find his posthorn and bring it to me.", cid)
                player:setStorageValue(40003, 9)
            else
                npcHandler:say("You haven't obtained all the measurements yet.", cid)
            end
        elseif mission == 9 then
            if player:removeItem(2332, 1) then -- Waldo's post horn
                npcHandler:say("You found it! Thank you. Now, deliver these letters to Santa Claus on Vega.", cid)
                player:setStorageValue(40003, 10)
            else
                npcHandler:say("You have not found Waldo's post horn yet.", cid)
            end
        elseif mission == 10 then
            if player:getStorageValue(40016) == 1 then
                npcHandler:say("Well done. Now for your final mission, deliver this letter to King Markwin in Mintwallin.", cid)
                player:addItem(2333, 1) -- letter
                player:setStorageValue(40003, 11)
            else
                npcHandler:say("You haven't delivered the letters to Santa Claus yet.", cid)
            end
        elseif mission == 11 then
            if player:getStorageValue(40017) == 1 then
                npcHandler:say("You have proven to be a true postman. I grant you the title of Archpostman! You now have full discounts on all ferry travels.", cid)
                player:setStorageValue(40003, 12)
                player:setStorageValue(40004, 4) -- Archpostman Rank
            else
                npcHandler:say("You haven't delivered the letter to King Markwin yet.", cid)
            end
        elseif mission >= 12 then
            npcHandler:say("You are an Archpostman. I have no more missions for you.", cid)
        end
    elseif state == 1 and msgcontains(msg, "yes") then
        npcHandler:say("Splendid! But you need to pass a test first. Ask me for a {mission}.", cid)
        player:setStorageValue(40003, 1) -- Inicia a Quest (Novice)
        player:setStorageValue(40004, 1)
        npcHandler:setTopic(cid, 0)
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:setMessage(MESSAGE_GREET, "Greetings |PLAYERNAME|, what brings you here?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Have a nice day.")
npcHandler:addModule(FocusModule:new())
