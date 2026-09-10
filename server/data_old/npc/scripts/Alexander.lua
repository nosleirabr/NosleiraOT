local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'soulfire'}, 3195, 210, 'soulfire')
shopModule:addBuyableItem({'desintegrate'}, 3197, 80, 'desintegrate')
shopModule:addBuyableItem({'moonlight'}, 3070, 1000, 'moonlight')
shopModule:addBuyableItem({'blank'}, 3147, 10, 'blank')
shopModule:addBuyableItem({'envenom'}, 3179, 130, 'envenom')
shopModule:addBuyableItem({'animate'}, 3203, 375, 'animate')
shopModule:addBuyableItem({'wand'}, 3073, 10000, 'wand')
shopModule:addBuyableItem({'life'}, 3052, 900, 'life')
shopModule:addBuyableItem({'wand'}, 3072, 5000, 'wand')
shopModule:addBuyableItem({'quagmire'}, 3065, 10000, 'quagmire')
shopModule:addBuyableItem({'paralyze'}, 3165, 700, 'paralyze')
shopModule:addBuyableItem({'energy'}, 3149, 325, 'energy')
shopModule:addBuyableItem({'tempest'}, 3067, 15000, 'tempest')
shopModule:addBuyableItem({'poison'}, 3173, 170, 'poison')
shopModule:addBuyableItem({'magic'}, 3180, 350, 'magic')
shopModule:addBuyableItem({'wand'}, 3074, 500, 'wand')
shopModule:addBuyableItem({'volcanic'}, 3069, 5000, 'volcanic')
shopModule:addBuyableItem({'wand'}, 3075, 1000, 'wand')
shopModule:addBuyableItem({'crystal'}, 3076, 530, 'crystal')
shopModule:addBuyableItem({'wand'}, 3071, 15000, 'wand')
shopModule:addBuyableItem({'snakebite'}, 3066, 500, 'snakebite')

shopModule:addSellableItem({'sell'}, 3076, 190, 'sell')
shopModule:addSellableItem({'sell'}, 3061, 85, 'sell')
shopModule:addSellableItem({'sell'}, 3062, 170, 'sell')

npcHandler:addModule(FocusModule:new())

