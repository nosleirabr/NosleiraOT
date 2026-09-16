local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'vial'}, 2006, 5, 1, 'vial')
shopModule:addSellableItem({'blank'}, 2260, 10, 'blank rune')
shopModule:addSellableItem({'life'}, 2006, 60, 'life fluid')
shopModule:addSellableItem({'mana'}, 2006, 100, 'mana fluid')
shopModule:addSellableItem({'spellbook'}, 2217, 150, 'spellbook')

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'vial'}, 2006, 5, 1, 'vial')
shopModule:addSellableItem({'blank'}, 2260, 10, 'blank rune')
shopModule:addSellableItem({'life'}, 2006, 60, 'life fluid')
shopModule:addSellableItem({'mana'}, 2006, 100, 'mana fluid')
shopModule:addSellableItem({'spellbook'}, 2217, 150, 'spellbook')



