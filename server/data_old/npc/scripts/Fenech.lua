local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'wand'}, 3075, 1000, 'wand')
shopModule:addBuyableItem({'tempest'}, 3067, 15000, 'tempest')
shopModule:addBuyableItem({'ultimate'}, 3160, 175, 'ultimate')
shopModule:addBuyableItem({'wand'}, 3071, 15000, 'wand')
shopModule:addBuyableItem({'snakebite'}, 3066, 500, 'snakebite')
shopModule:addBuyableItem({'fireball'}, 3189, 95, 'fireball')
shopModule:addBuyableItem({'energy'}, 3166, 340, 'energy')
shopModule:addBuyableItem({'destroy'}, 3148, 45, 'destroy')
shopModule:addBuyableItem({'heavy'}, 3198, 125, 'heavy')
shopModule:addBuyableItem({'convince'}, 3177, 80, 'convince')
shopModule:addBuyableItem({'volcanic'}, 3069, 5000, 'volcanic')
shopModule:addBuyableItem({'fire'}, 3188, 85, 'fire')
shopModule:addBuyableItem({'intense'}, 3152, 95, 'intense')
shopModule:addBuyableItem({'blank'}, 3147, 10, 'blank')
shopModule:addBuyableItem({'fire'}, 3192, 235, 'fire')
shopModule:addBuyableItem({'antidote'}, 3153, 65, 'antidote')
shopModule:addBuyableItem({'wand'}, 3072, 5000, 'wand')
shopModule:addBuyableItem({'wand'}, 3073, 10000, 'wand')
shopModule:addBuyableItem({'wand'}, 3074, 500, 'wand')
shopModule:addBuyableItem({'moonlight'}, 3070, 1000, 'moonlight')
shopModule:addBuyableItem({'quagmire'}, 3065, 10000, 'quagmire')
shopModule:addBuyableItem({'explosion'}, 3200, 250, 'explosion')
shopModule:addBuyableItem({'light'}, 3174, 40, 'light')
shopModule:addBuyableItem({'energy'}, 3164, 115, 'energy')
shopModule:addBuyableItem({'spellbook'}, 3059, 150, 'spellbook')
shopModule:addBuyableItem({'chameleon'}, 3178, 210, 'chameleon')
shopModule:addBuyableItem({'poison'}, 3172, 65, 'poison')
shopModule:addBuyableItem({'poison'}, 3176, 210, 'poison')
shopModule:addBuyableItem({'sudden'}, 3155, 325, 'sudden')
shopModule:addBuyableItem({'great'}, 3191, 180, 'great')
shopModule:addBuyableItem({'fire'}, 3190, 245, 'fire')


npcHandler:addModule(FocusModule:new())

