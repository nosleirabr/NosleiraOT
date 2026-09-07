local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Ahoi, |PLAYERNAME|. You want to buy some fresh fish?')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye and come again!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye and come again!')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'My job is to catch fish and to sell them here.'})
keywordHandler:addKeyword({'aneus'}, StdModule.say, {npcHandler = npcHandler, text = 'Hmm, I don\'t know him very well. But he has a very nice story to tell.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Bruno.'})
keywordHandler:addKeyword({'marlene'}, StdModule.say, {npcHandler = npcHandler, text = 'Ah yes, my lovely wife. God forgive her, but she can\'t stop talking. So my work is a great rest for my poor ears. *laughs loudly*'})
keywordHandler:addKeyword({'graubart'}, StdModule.say, {npcHandler = npcHandler, text = 'I like this old salt. I learned much from him. Whatever. You like some fish? *grin*'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)
shopModule:addBuyableItem({'fish'}, 3578, 5, 'fish')

npcHandler:addModule(FocusModule:new())

