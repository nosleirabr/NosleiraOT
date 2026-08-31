local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'axe'}, 2386, 20, 'axe')
shopModule:addBuyableItem({'dagger'}, 2379, 5, 'dagger')
shopModule:addBuyableItem({'mace'}, 2398, 90, 'mace')
shopModule:addBuyableItem({'rapier'}, 2384, 15, 'rapier')
shopModule:addBuyableItem({'sabre'}, 2385, 35, 'sabre')
shopModule:addBuyableItem({'short sword'}, 2406, 30, 'short sword')
shopModule:addBuyableItem({'spear'}, 2389, 10, 'spear')
shopModule:addBuyableItem({'sword'}, 2376, 85, 'sword')
shopModule:addBuyableItem({'sickle'}, 2405, 7, 'sickle')
shopModule:addBuyableItem({'battle axe'}, 2378, 235, 'battle axe')
shopModule:addBuyableItem({'hand axe'}, 2380, 8, 'hand axe')
shopModule:addBuyableItem({'halberd'}, 2381, 400, 'halberd')
shopModule:addBuyableItem({'morning star'}, 2394, 430, 'morning star')
shopModule:addBuyableItem({'battle hammer'}, 2417, 350, 'battle hammer')
shopModule:addBuyableItem({'clerical mace'}, 2397, 170, 'clerical mace')
shopModule:addBuyableItem({'two handed sword'}, 2377, 950, 'two handed sword')

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Allen."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a weapon smith."})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = "I sell many kinds of weapons."})

npcHandler:setMessage(MESSAGE_GREET, "Hello, |PLAYERNAME|. Need a {weapon}?")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Goodbye.")

npcHandler:addModule(FocusModule:new())
