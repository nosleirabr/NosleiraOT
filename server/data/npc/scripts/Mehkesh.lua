local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
-- Life fluid: ID 2006 subtype 10 (life fluid), preco classico 7.4
shopModule:addBuyableItem({'life', 'life fluid'}, 2006, 60, 10, 'life fluid')
-- Mana fluid: ID 2006 subtype 7 (mana fluid), preco classico 7.4
shopModule:addBuyableItem({'mana', 'mana fluid'}, 2006, 100, 7, 'mana fluid')


local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

