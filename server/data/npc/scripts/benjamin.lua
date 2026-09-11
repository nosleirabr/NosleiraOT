local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Hello. How may I help you |PLAYERNAME|?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'It was a pleasure to help you.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'It was a pleasure to help you.')
keywordHandler:addKeyword({'sherry'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t drink alcohol while on duty.'})
keywordHandler:addKeyword({'headquarter'}, StdModule.say, {npcHandler = npcHandler, text = 'Its just... I mean... there was that road, oh yes, its that house at that road.'})
keywordHandler:addKeyword({'gregor'}, StdModule.say, {npcHandler = npcHandler, text = 'Never heared of him.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I don\'t read the letters we transmit.'})
keywordHandler:addKeyword({'office'}, StdModule.say, {npcHandler = npcHandler, text = 'I am always in my office. You are welcome at any time.'})
keywordHandler:addKeyword({'xodet'}, StdModule.say, {npcHandler = npcHandler, text = 'The young sorcerer is a good businessman.'})
keywordHandler:addKeyword({'muriel'}, StdModule.say, {npcHandler = npcHandler, text = 'This Muriel has a lot of correspondence.'})
keywordHandler:addKeyword({'marvik'}, StdModule.say, {npcHandler = npcHandler, text = 'He is always talking of healing me but I am fine... I fear he is a little nuts, poor man.'})
keywordHandler:addKeyword({'sam'}, StdModule.say, {npcHandler = npcHandler, text = 'Ham? No thanks, I ate fish already.'})
keywordHandler:addKeyword({'frodo'}, StdModule.say, {npcHandler = npcHandler, text = 'Frodo... Frodo... ? Uhm... isn\'t that the man that brings me food at lunchtime?'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'You can sent letters and parcels to Carlin.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Oops, the king? I... can\'t remember his name...'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I can\'t remember that someone named like that lives here.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'This is the town you are currently in.'})
keywordHandler:addKeyword({'gorn'}, StdModule.say, {npcHandler = npcHandler, text = 'He sells equipment.'})
keywordHandler:addKeyword({'kevin'}, StdModule.say, {npcHandler = npcHandler, text = 'That name sounds familiar... who might that be...'})
keywordHandler:addKeyword({'elane'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, she lives next door. I think she\'s a dentist, I sometimes hear some cries.'})
keywordHandler:addKeyword({'quero'}, StdModule.say, {npcHandler = npcHandler, text = 'I love his music! He is my best friend and I visit him as often as I can.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'TO THE ARMS! MAN THE WALLS! FERUMBRAS IS NEAR!'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now it\'s the current time. Maybe you want to buy a watch?'})
keywordHandler:addKeyword({'quentin'}, StdModule.say, {npcHandler = npcHandler, text = 'Ooooh, nice man, visits me often... I think.'})
keywordHandler:addKeyword({'join'}, StdModule.say, {npcHandler = npcHandler, text = 'Uh... oh... Uhm... Join what?'})
keywordHandler:addKeyword({'harkath'}, StdModule.say, {npcHandler = npcHandler, text = 'Oh, young Harkath will be a fine warrior some day.'})
keywordHandler:addKeyword({'lynda'}, StdModule.say, {npcHandler = npcHandler, text = 'She is SO pretty!'})
keywordHandler:addKeyword({'baxter'}, StdModule.say, {npcHandler = npcHandler, text = 'This naughty child, always stealing apples!'})
keywordHandler:addKeyword({'bozo'}, StdModule.say, {npcHandler = npcHandler, text = 'He hangs around here quite often. He claimes, I inspire him.'})
keywordHandler:addKeyword({'tibianus'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah, King Tibianus, our wise ruler. He is sick for some time, isn\'t he?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am working here at the post office. If you have questions about the Royal Tibia Mail System or the depots ask me.'})
keywordHandler:addKeyword({'lugri'}, StdModule.say, {npcHandler = npcHandler, text = 'NO! NO! NO! GO AWAY!.'})
keywordHandler:addKeyword({'depot'}, StdModule.say, {npcHandler = npcHandler, text = 'The depots are very easy to use. Just step in front of them and you will find your items in them. They are free for all tibian citizens. Hail our king!'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Benjamin.'})

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
            npcHandler:say("Oh they don't change that much since in the old days as... <tells a boring and confusing story about a cake, a parcel, himself and two squirrels, at least he tells you his measurements in the end>", cid)
            player:setStorageValue(12456, player:getStorageValue(12456) + 1)
            npcHandler.topic[cid] = 0
        end
    end
    return true
end
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
