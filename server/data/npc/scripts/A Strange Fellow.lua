-- NPC: A Strange Fellow
-- Localização: Isle of the Mists (mapa 7.4 realmap)
-- Comportamento: NPC misterioso com diálogos de orientação/lore.
-- Não vende itens. Não tem quest log associado.
-- Fonte: comportamento original Tibia 7.4 / Miracle74

local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)          npcHandler:onCreatureAppear(cid)          end
function onCreatureDisappear(cid)       npcHandler:onCreatureDisappear(cid)       end
function onCreatureSay(cid, type, msg)  npcHandler:onCreatureSay(cid, type, msg)  end
function onThink()                      npcHandler:onThink()                      end

-- Saudação misteriosa ao se aproximar
npcHandler:setMessage(MESSAGE_GREET,   "Shh... you shouldn't be here. Go back while you still can.")
npcHandler:setMessage(MESSAGE_FAREWELL,"Remember what I told you...")
npcHandler:setMessage(MESSAGE_WALKAWAY,"...")

-- Palavras-chave com diálogos de lore 7.4
local node1 = keywordHandler:addKeyword({"name"}, StdModule.say, {npcHandler = npcHandler,
    text = "I have no name. Not anymore."})

local node2 = keywordHandler:addKeyword({"here", "place", "island"}, StdModule.say, {npcHandler = npcHandler,
    text = "This island... it exists between worlds. Few find it by accident."})

local node3 = keywordHandler:addKeyword({"danger", "dangerous"}, StdModule.say, {npcHandler = npcHandler,
    text = "Everything here is dangerous. The mists, the creatures, and especially the silence."})

local node4 = keywordHandler:addKeyword({"help"}, StdModule.say, {npcHandler = npcHandler,
    text = "I cannot help you. I can only warn you: turn back."})

local node5 = keywordHandler:addKeyword({"annihilator", "challenge"}, StdModule.say, {npcHandler = npcHandler,
    text = "You seek the annihilator? Then you seek death. Many have tried. Few speak of it afterwards."})


local function creatureSayCallback(cid, type, msg)
	if not npcHandler:isFocused(cid) then return false end
	local player = Player(cid)
	
	if player:getStorageValue(12452) == 1 then
		if msgcontains(msg, "bill") then
			if npcHandler.topic[cid] == 6 then
				npcHandler:say("A bill? Oh boy so you are delivering another bill to poor me?", cid)
				npcHandler.topic[cid] = 7
			end
		elseif msgcontains(msg, "yes") then
			if npcHandler.topic[cid] == 7 then
				npcHandler:say("Ok, ok, I'll take it. I guess I have no other choice anyways. And now leave me alone in my misery please.", cid)
				npcHandler.topic[cid] = 0
				player:setStorageValue(12452, 2)
			end
		elseif msgcontains(msg, "hat") then
			if (npcHandler.topic[cid] or 0) < 1 then
				npcHandler:say("Uh? What do you want?!", cid)
				npcHandler.topic[cid] = 2
			elseif npcHandler.topic[cid] == 2 then
				npcHandler:say("What? My hat?? Theres... nothing special about it!", cid)
				npcHandler.topic[cid] = 3
			elseif npcHandler.topic[cid] == 3 then
				npcHandler:say("Stop bugging me about that hat, do you listen?", cid)
				npcHandler.topic[cid] = 4
			elseif npcHandler.topic[cid] == 4 then
				npcHandler:say("Hey! Don't touch that hat! Leave it alone!!! Don't do this!!!!", cid)
				npcHandler.topic[cid] = 5
			elseif npcHandler.topic[cid] == 5 then
				for i = 1, 5 do
					Game.createMonster("Rabbit", Npc():getPosition())
				end
				npcHandler:say("Noooooo! Argh, ok, ok, I guess I can't deny it anymore, I am David Brassacres, the magnificent, so what do you want?", cid)
				npcHandler.topic[cid] = 6
			end
		end
	end
	return true
end
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)

