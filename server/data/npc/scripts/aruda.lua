local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end

local function steal(cid)
    local player = Player(cid)
    if player then
        if math.random(1, 4) == 1 then
            if player:removeMoney(5) then
                -- Silently remove 5 gold
            end
        end
    end
end

function onThink()
    for _, cid in pairs(npcHandler:getSpectators()) do
        if npcHandler:isFocused(cid) then
            steal(cid)
        end
    end
    npcHandler:onThink()
end

keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = "I am Aruda. Have we met before?"})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = "I am a poor woman, trying to survive in this city."})
keywordHandler:addKeyword({'thief'}, StdModule.say, {npcHandler = npcHandler, text = "I am not a thief! How dare you!"})
keywordHandler:addKeyword({'partos'}, StdModule.say, {npcHandler = npcHandler, text = "I don't know any Partos. Is he a friend of yours?"})
keywordHandler:addKeyword({'kiss'}, StdModule.say, {npcHandler = npcHandler, text = "Oh! You are so forward! But I like that."})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = "I don't like weapons. They are so dangerous."})

npcHandler:setMessage(MESSAGE_GREET, "Oh, hello |PLAYERNAME|! You look like a strong adventurer.")
npcHandler:setMessage(MESSAGE_FAREWELL, "Goodbye, it was a pleasure talking to you.")
npcHandler:setMessage(MESSAGE_WALKAWAY, "Oh, going so soon?")

npcHandler:addModule(FocusModule:new())
