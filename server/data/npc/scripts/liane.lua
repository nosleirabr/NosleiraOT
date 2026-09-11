local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello |PLAYERNAME|. May I help you?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'It was a pleasure to help you.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'It was a pleasure to help you.')
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Our wonderful town is protected by the wise Queen Eloise.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am working here at the post office. If you have questions about the Royal Carlin Mail System or the depots ask me.'})
keywordHandler:addKeyword({'ghostlands'}, StdModule.say, {npcHandler = npcHandler, text = 'We don\'t deliver letters or parcels there, sorry.'})
keywordHandler:addKeyword({'benjamin'}, StdModule.say, {npcHandler = npcHandler, text = 'He is the postman in Thais and somewhat stupid. But he never sents wrong letters or parcels.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now it\'s the current time.'})
keywordHandler:addKeyword({'headquarter'}, StdModule.say, {npcHandler = npcHandler, text = 'Its just south oh Kazordoon. Follow the road and you will run right into it.'})
keywordHandler:addKeyword({'office'}, StdModule.say, {npcHandler = npcHandler, text = 'I rarely leave my office. You are welcome at any time.'})
keywordHandler:addKeyword({'kevin'}, StdModule.say, {npcHandler = npcHandler, text = 'Kevin Postner was already leader of the guild as I joined. I can\'t imagine anyone better for that position.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Liane.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'A town ruled by men, a dangerous place. Anyway, we bring also letters and parcels there.'})
keywordHandler:addKeyword({'queen'}, StdModule.say, {npcHandler = npcHandler, text = 'Our Queen\'s rule makes Carlin prosper.'})
keywordHandler:addKeyword({'wally'}, StdModule.say, {npcHandler = npcHandler, text = 'Wally and I became pen-pals in the course of years.'})
keywordHandler:addKeyword({'join'}, StdModule.say, {npcHandler = npcHandler, text = 'You might apply for a membership in our haedquarter.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())


local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then
        return false
    end
    
    local player = Player(cid)
    if msgcontains(msg, "measurements") then
        if player:getStorageValue(12456) >= 1 then
            npcHandler:say("I think I should not tell you... but you leave me no choice. I am 1.83m and I weight... none of your business.", cid)
            player:setStorageValue(12456, player:getStorageValue(12456) + 1)
            npcHandler.topic[cid] = 0
        end
    end
    return true
end
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
