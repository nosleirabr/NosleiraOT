local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Beeee Greeeeted |PLAYERNAME|. What is your neeeed?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Bye.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Bye.')
keywordHandler:addKeyword({'vladruc'}, StdModule.say, {npcHandler = npcHandler, text = 'Heeee is the bossss. Better don\'t messss with him!'})
keywordHandler:addKeyword({'offer'}, StdModule.say, {npcHandler = npcHandler, text = 'What do youuuu think I am? A lousy barberrrr? I\'m selliiiing ruuuunes and spellboooooks.'})
keywordHandler:addKeyword({'market'}, StdModule.say, {npcHandler = npcHandler, text = 'Yes, that\'s a market heeeere, smarty ... Nice to seeeee I am not the only one without a braiiiin here.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a FRANS.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'Wouldn\'t he beeee the perfect FRANS?'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am selliiiing ruuuunes, wands, roooods and spellbooooooks.'})
keywordHandler:addKeyword({'sorcerer'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorcerorssss, druidssss, they all come to ussss.'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'Is aaaall about magic more or lesssss, isn\'t it?'})
keywordHandler:addKeyword({'frans'}, StdModule.say, {npcHandler = npcHandler, text = 'Floating ReeeeAnimated Necromantic Seeeervant ... FRANS.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'We FRANSes don\'t liiiike any bugssss.'})
keywordHandler:addKeyword({'rune'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell blank ruuuuunes and spell ruuuuunes.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'blank'}, 2260, 10, 1, 'blank rune')
shopModule:addBuyableItem({'spellbook'}, 2217, 400, 1, 'spellbook')
shopModule:addBuyableItem({'life'}, 2006, 60, 10, 'life fluid')
shopModule:addBuyableItem({'mana'}, 2006, 100, 7, 'mana fluid')

npcHandler:addModule(FocusModule:new())


