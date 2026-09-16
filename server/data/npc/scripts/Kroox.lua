local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Welcome to Kroox Quality Armor, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye. Come back soon.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye. Come back soon.')
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s the current time now.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell best armor in land. My armor save you life. Better buy much.'})
keywordHandler:addKeyword({'mines'}, StdModule.say, {npcHandler = npcHandler, text = 'Foreigners not welcome in mines. An evil basilisk rob our deeper mines.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Kroox Shieldbearer, son of Earth, from the Molten Rock.'})
keywordHandler:addKeyword({'thanks'}, StdModule.say, {npcHandler = npcHandler, text = 'I you thank, too.'})
keywordHandler:addKeyword({'trousers'}, StdModule.say, {npcHandler = npcHandler, text = 'I am selling chain legs, and brass legs. What you need?'})
keywordHandler:addKeyword({'helmet'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell chain helmets, brass helmets, iron helmets, and steel helmets. What you want?'})
keywordHandler:addKeyword({'buy'}, StdModule.say, {npcHandler = npcHandler, text = 'What you need? I sell armor, helmets, shields, and legs.'})
keywordHandler:addKeyword({'measurements'}, StdModule.say, {npcHandler = npcHandler, text = 'UH? No clue what you are talking about, jawoll.'})
keywordHandler:addKeyword({'shield'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell steel shields, dwarven shields, brass shields, and plate shields. What you want?'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Much fun you can have in dungeons. Much battle and much gold, jawoll!'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'You not be afraid, here you be save.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask in the shop next tunnel about that.'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'I offer armor, helmets, legs, and shields.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell and buy all kinds of armor. Dwarfish are the best, jawoll!'})
keywordHandler:addKeyword({'armor'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell chain armor, brass armor, and plate armor. What you need?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'chain'}, 2464, 200, 1, 'chain armor')
shopModule:addBuyableItem({'brass'}, 2465, 450, 1, 'brass armor')
shopModule:addBuyableItem({'plate'}, 2463, 1200, 1, 'plate armor')
shopModule:addBuyableItem({'chain'}, 2458, 52, 1, 'chain helmet')
shopModule:addBuyableItem({'brass'}, 2460, 120, 1, 'brass helmet')
shopModule:addBuyableItem({'steel'}, 2457, 580, 1, 'steel helmet')
shopModule:addBuyableItem({'plate'}, 2510, 125, 1, 'plate shield')
shopModule:addBuyableItem({'steel'}, 2509, 240, 1, 'steel shield')
shopModule:addBuyableItem({'chain'}, 2648, 50, 1, 'chain legs')
shopModule:addBuyableItem({'brass'}, 2478, 195, 1, 'brass legs')
shopModule:addSellableItem({'chain'}, 2464, 70, 'chain armor')
shopModule:addSellableItem({'brass'}, 2465, 150, 'brass armor')
shopModule:addSellableItem({'plate'}, 2463, 400, 'plate armor')
shopModule:addSellableItem({'chain'}, 2458, 17, 'chain helmet')
shopModule:addSellableItem({'brass'}, 2460, 30, 'brass helmet')
shopModule:addSellableItem({'steel'}, 2457, 190, 'steel helmet')
shopModule:addSellableItem({'plate'}, 2510, 45, 'plate shield')
shopModule:addSellableItem({'steel'}, 2509, 80, 'steel shield')
shopModule:addSellableItem({'chain'}, 2648, 25, 'chain legs')
shopModule:addSellableItem({'brass'}, 2478, 49, 'brass legs')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then
        return false
    end
    
    local player = Player(cid)
    if msgcontains(msg, "measurements") then
        if player:getStorageValue(12456) >= 1 then
            npcHandler:say("Hm, well I guess its ok to tell you ... <tells you about Lokurs measurements>", cid)
            player:setStorageValue(12456, player:getStorageValue(12456) + 1)
            npcHandler.topic[cid] = 0
        end
    end
    return true
end
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)


