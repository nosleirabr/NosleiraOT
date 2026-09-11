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
shopModule:addBuyableItem({'chain'}, 3358, 200, 'chain')
shopModule:addBuyableItem({'dwarven'}, 3425, 500, 'dwarven')
shopModule:addBuyableItem({'plate'}, 3410, 125, 'plate')
shopModule:addBuyableItem({'plate'}, 3357, 1200, 'plate')
shopModule:addBuyableItem({'brass'}, 3411, 65, 'brass')
shopModule:addBuyableItem({'steel'}, 3409, 240, 'steel')
shopModule:addBuyableItem({'chain'}, 3558, 80, 'chain')
shopModule:addBuyableItem({'chain'}, 3352, 52, 'chain')
shopModule:addBuyableItem({'brass'}, 3354, 120, 'brass')
shopModule:addBuyableItem({'brass'}, 3372, 195, 'brass')
shopModule:addBuyableItem({'iron'}, 3353, 390, 'iron')
shopModule:addBuyableItem({'steel'}, 3351, 580, 'steel')
shopModule:addBuyableItem({'brass'}, 3359, 450, 'brass')
shopModule:addSellableItem({'sell'}, 3356, 450, 'sell')
shopModule:addSellableItem({'sell'}, 3358, 40, 'sell')
shopModule:addSellableItem({'sell'}, 3412, 3, 'sell')
shopModule:addSellableItem({'sell'}, 3367, 66, 'sell')
shopModule:addSellableItem({'sell'}, 3410, 45, 'sell')
shopModule:addSellableItem({'sell'}, 3357, 240, 'sell')
shopModule:addSellableItem({'sell'}, 3411, 16, 'sell')
shopModule:addSellableItem({'sell'}, 3413, 60, 'sell')
shopModule:addSellableItem({'sell'}, 3371, 375, 'sell')
shopModule:addSellableItem({'sell'}, 3352, 12, 'sell')
shopModule:addSellableItem({'sell'}, 3425, 100, 'sell')
shopModule:addSellableItem({'sell'}, 3354, 30, 'sell')
shopModule:addSellableItem({'sell'}, 3558, 20, 'sell')
shopModule:addSellableItem({'sell'}, 3372, 49, 'sell')
shopModule:addSellableItem({'sell'}, 3353, 145, 'sell')
shopModule:addSellableItem({'sell'}, 3351, 293, 'sell')
shopModule:addSellableItem({'sell'}, 3557, 115, 'sell')
shopModule:addSellableItem({'sell'}, 3359, 112, 'sell')
shopModule:addSellableItem({'sell'}, 3369, 696, 'sell')

npcHandler:addModule(FocusModule:new())


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
