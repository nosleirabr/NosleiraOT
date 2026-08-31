local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

shopModule:addBuyableItem({'spellbook'}, 2175, 150, 'spellbook')
shopModule:addBuyableItem({'magic lightwand', 'lightwand'}, 2162, 400, 'magic lightwand')
shopModule:addBuyableItem({'blank rune', 'blank'}, 2260, 10, 'blank rune')
shopModule:addBuyableItem({'life fluid', 'lifefluid'}, 2006, 60, 10, 'life fluid')
shopModule:addBuyableItem({'mana fluid', 'manafluid'}, 2006, 55, 7, 'mana fluid')

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Frans."})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a sorcerer and I run this magic shop."})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = "I sell blank runes, spellbooks, and fluids."})
keywordHandler:addKeyword({'rune'}, StdModule.say, {npcHandler = npcHandler, text = "I only sell blank runes. You must learn the spells to create magic runes."})
keywordHandler:addKeyword({'fluid'}, StdModule.say, {npcHandler = npcHandler, text = "I sell life fluids and mana fluids."})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = "Venore is a city of trade and magic."})

npcHandler:setMessage(MESSAGE_GREET, "Welcome to my magic shop, |PLAYERNAME|!")
npcHandler:setMessage(MESSAGE_FAREWELL, "Farewell.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Farewell.")

npcHandler:addModule(FocusModule:new())
