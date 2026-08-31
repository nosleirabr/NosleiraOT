local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local function creatureSayCallback(cid, type, msg)
	if not npcHandler:isFocused(cid) then
		return false
	end

	if not msgcontains(msg, 'heal') then
		return true
	end

	local player = Player(cid)
	if player:getCondition(CONDITION_FIRE) then
		player:removeCondition(CONDITION_FIRE)
		player:getPosition():sendMagicEffect(CONST_ME_MAGIC_GREEN)
		npcHandler:say('You are burning. Let me quench those flames.', cid)
	elseif player:getCondition(CONDITION_POISON) then
		player:removeCondition(CONDITION_POISON)
		player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
		npcHandler:say('You are poisoned. Let me soothe your pain.', cid)
	elseif player:getCondition(CONDITION_ENERGY) then
		player:removeCondition(CONDITION_ENERGY)
		player:getPosition():sendMagicEffect(CONST_ME_MAGIC_GREEN)
		npcHandler:say('You are electrified, my child. Let me help you to stop trembling.', cid)
	elseif player:getHealth() < 65 then
		local health = player:getHealth()
		player:addHealth(65 - health)
		player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
		npcHandler:say('You are hurt, my child. I will heal your wounds.', cid)
	else
		npcHandler:say('You aren\'t looking that bad. Sorry, I can\'t help you. Come back when you are badly wounded or poisoned.', cid)
	end
	return true
end

keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a humble servant of the gods. I can {heal} you if you are wounded or poisoned, and bestow the Embrace of Tibia.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'Ask me to {heal} you if you are hurt.'})

local blessKeyword = keywordHandler:addKeyword({'embrace'}, StdModule.say, {npcHandler = npcHandler, text = 'Would you like to receive the Embrace of Tibia for 10000 gold?'})
blessKeyword:addChildKeyword({'yes'}, StdModule.bless, {npcHandler = npcHandler, premium = true, cost = 10000, bless = 2})
blessKeyword:addChildKeyword({'no'}, StdModule.say, {npcHandler = npcHandler, text = 'Maybe another time.', reset = true})

local blessKeyword2 = keywordHandler:addKeyword({'bless'}, StdModule.say, {npcHandler = npcHandler, text = 'Would you like to receive the Embrace of Tibia for 10000 gold?'})
blessKeyword2:addChildKeyword({'yes'}, StdModule.bless, {npcHandler = npcHandler, premium = true, cost = 10000, bless = 2})
blessKeyword2:addChildKeyword({'no'}, StdModule.say, {npcHandler = npcHandler, text = 'Maybe another time.', reset = true})

npcHandler:setMessage(MESSAGE_GREET, 'Welcome, |PLAYERNAME|! If you are wounded or poisoned, I can {heal} you.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May the gods bless you, |PLAYERNAME|.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May the gods watch over you.')
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:addModule(FocusModule:new())
