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

npcHandler:addModule(FocusModule:new())
