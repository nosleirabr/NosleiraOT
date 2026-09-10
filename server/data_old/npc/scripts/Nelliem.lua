local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Greetings, |PLAYERNAME|, traveller from afar...')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Go...! Learn the secret to green thumbs and may Crunor be good to you...')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Go...! Learn the secret to green thumbs and may Crunor be good to you...')
keywordHandler:addKeyword({'crunor'}, StdModule.say, {npcHandler = npcHandler, text = 'May he bless all plants.'})
keywordHandler:addKeyword({'equipment'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell shovels, picks, scythes, machetes, ropes, pitchforks, rakes, hoes, brooms, fishing rods, sixpacks of worms and brandnew crowbars from Kazordoon.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'To keep my thumbs green and to sell our garden equipment, as you can see on that shelves.'})
keywordHandler:addKeyword({'worm'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell worms only in sixpacks for 5 gold each, how many sixpacks of worms do you want to buy?'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'It\'s a good time to sow some seeds.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Nelliem.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'machete'}, 3308, 35, 'machete')
shopModule:addBuyableItem({'rake'}, 3452, 20, 'rake')
shopModule:addBuyableItem({'scythe'}, 3453, 25, 'scythe')
shopModule:addBuyableItem({'pick'}, 3456, 50, 'pick')
shopModule:addBuyableItem({'crowbar'}, 3304, 260, 'crowbar')
shopModule:addBuyableItem({'rod'}, 3483, 150, 'rod')
shopModule:addBuyableItem({'shovel'}, 3457, 20, 'shovel')
shopModule:addBuyableItem({'rope'}, 3003, 50, 'rope')
shopModule:addBuyableItem({'hoe'}, 3455, 15, 'hoe')
shopModule:addBuyableItem({'broom'}, 3454, 12, 'broom')
shopModule:addBuyableItem({'pitchfork'}, 3451, 25, 'pitchfork')

npcHandler:addModule(FocusModule:new())

