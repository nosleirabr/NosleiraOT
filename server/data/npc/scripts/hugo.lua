local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Be greeted, |PLAYERNAME|!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Good bye, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Good bye, |PLAYERNAME|.')
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am tailor and designer extraordinaire.'})
keywordHandler:addKeyword({'gambling'}, StdModule.say, {npcHandler = npcHandler, text = 'I too love to gamble now and then in the Hard Rock tavern.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am known as Hugo Chief.'})
keywordHandler:addKeyword({'supermodel'}, StdModule.say, {npcHandler = npcHandler, text = 'A model with incredible superpowers. Do you think they call them supermodels for nothing?'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, a watch would ruin my stylish outfit.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Women should know better than to hide in ugly armor. Like all followers of ugliness they will be punished one day.'})
keywordHandler:addKeyword({'army'}, StdModule.say, {npcHandler = npcHandler, text = 'I think they should not wear that ugly armor in town. I will see to assure that will be changed soon.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = 'The ferumbras-bad-ass-fashion is incredibly outdated since years.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'A world filled with ugly dressed people needs the skills of a fashion-hero.'})
keywordHandler:addKeyword({'warehouse'}, StdModule.say, {npcHandler = npcHandler, text = 'I would call it a \'wearhouse\'.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'He does not care much about us, we don\'t care much about him. I consider that a fair deal.'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = 'My newest models are top secret, sorry.'})
keywordHandler:addKeyword({'privilege'}, StdModule.say, {npcHandler = npcHandler, text = 'The city was granted a few privileges by the king. I can\'t even tell which. They don\'t affect me that much.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is kind of a fashion hell. If there was an award for the most ugly citizens, it would go to Thais.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'Well it\'s not my real name. I took it because people think it\'s scaring and manly. I hate people doubting my manhood for being a tailor, you know.'})
keywordHandler:addKeyword({'tax'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care about such mundane things like \'taxes\'.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'I don\'t care for such fairytales.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)


local function creatureSayCallback(cid, type, msg)
	if not npcHandler:isFocused(cid) then return false end
	local player = Player(cid)
	
	if msgcontains(msg, "uniforms") then
		if player:getStorageValue(12455) == 1 then
			npcHandler:say("A new uniform for the post officers? I am sorry but my dog ate the last dress pattern we used. You need to supply us with a new dress pattern.", cid)
			npcHandler.topic[cid] = 1
		end
	elseif msgcontains(msg, "dress pattern") then
		if npcHandler.topic[cid] == 1 then
			npcHandler:say("It was ... wonderous beyond wildest imaginations! I have no clue where Kevin Postner got it from. Better ask him.", cid)
			player:setStorageValue(12455, 2)
		elseif player:getStorageValue(12455) == 11 then
			npcHandler:say("By the gods of fashion! Didn't it do that I fed the last dress pattern to my poor dog? Will this mocking of all which is taste and fashion never stop?? Ok, ok, you will get those ugly, stinking uniforms and now get lost, fashion terrorist.", cid)
			player:setStorageValue(12455, 12)
		end
		npcHandler.topic[cid] = 0
	end
	return true
end
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:addModule(FocusModule:new())


