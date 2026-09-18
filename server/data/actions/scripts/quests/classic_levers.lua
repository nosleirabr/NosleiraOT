local levers = {
    -- Annihilator Lever
    [30016] = {
        name = "Annihilator",
        level = 100,
        exactPlayers = 4, -- Requer exatamente 4 players
        players = {
            {relPos = {x = -4, y = 0, z = 0}, newPos = Position(33219, 31659, 13)}, -- Player 1
            {relPos = {x = -3, y = 0, z = 0}, newPos = Position(33220, 31659, 13)}, -- Player 2
            {relPos = {x = -2, y = 0, z = 0}, newPos = Position(33221, 31659, 13)}, -- Player 3
            {relPos = {x = -1, y = 0, z = 0}, newPos = Position(33222, 31659, 13)}  -- Player 4
        },
        onExecute = function(player, leverPos)
            local roomCenter = Position(33221, 31659, 13)
            local spectators = Game.getSpectators(roomCenter, false, true, 5, 5, 5, 5)
            if #spectators > 0 then
                player:sendCancelMessage("There is a team already inside the quest room.")
                return false
            end
            
            -- Remove os monstros existentes
            local monsters = Game.getSpectators(roomCenter, false, false, 5, 5, 5, 5)
            for _, monster in ipairs(monsters) do
                if monster:isMonster() then
                    monster:remove()
                end
            end
            
            -- Spawna novos Demons
            local demonPositions = {
                Position(33219, 31657, 13), Position(33221, 31657, 13),
                Position(33223, 31659, 13), Position(33224, 31659, 13),
                Position(33220, 31661, 13), Position(33222, 31661, 13)
            }
            for _, pos in ipairs(demonPositions) do
                Game.createMonster("Demon", pos)
            end
            
            return true
        end
    },
    
    -- Demon Helmet Quest Lever
    [30018] = {
        name = "Demon Helmet Quest",
        toggle = true,
        onExecute = function(player, leverPos)
            -- Position of the blocking rock (typical 7.4 realmap pos: 33314, 31592, 15)
            local rockPos = Position(33314, 31592, 15)
            local rockTile = Tile(rockPos)
            local rockId = 1354 -- Large stone ID

            if rockTile then
                local rockItem = rockTile:getItemById(rockId)
                if rockItem then
                    rockItem:remove()
                    player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You hear a rock moving somewhere.")
                else
                    Game.createItem(rockId, 1, rockPos)
                    player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You hear a rock moving somewhere.")
                end
            end
            return true
        end
    },
    
    -- Banshee Quest Warlock Lever (Isle of Kings Warlock Room)
    [30019] = {
        name = "Banshee Quest Warlock Lever",
        toggle = true,
        onExecute = function(player, leverPos)
            -- Position of the magic wall or stone blocking the warlock room
            local wallPos = Position(32204, 31853, 15)
            local wallId = 1354
            
            local wallTile = Tile(wallPos)
            if wallTile then
                local wallItem = wallTile:getItemById(wallId)
                if wallItem then
                    wallItem:remove()
                else
                    Game.createItem(wallId, 1, wallPos)
                end
            end
            return true
        end
    },
    -- Desert Quest Lever
    [30017] = {
        name = "Desert Quest",
        level = 20,
        exactPlayers = 4,
        players = {
            -- Druid (North)
            {relPos = {x = 0, y = -1, z = 0}, newPos = Position(32672, 32070, 8), vocations = {2, 6}, sacrifice = {relPos = {x = 0, y = -3, z = 0}, itemid = 2175}},
            -- Paladin (East)
            {relPos = {x = 6, y = 3, z = 0}, newPos = Position(32672, 32069, 8), vocations = {3, 7}, sacrifice = {relPos = {x = 8, y = 3, z = 0}, itemid = 2455}},
            -- Sorcerer (South)
            {relPos = {x = 0, y = 7, z = 0}, newPos = Position(32671, 32070, 8), vocations = {1, 5}, sacrifice = {relPos = {x = 0, y = 9, z = 0}, itemid = 2674}},
            -- Knight (West)
            {relPos = {x = -6, y = 3, z = 0}, newPos = Position(32671, 32069, 8), vocations = {4, 8}, sacrifice = {relPos = {x = -8, y = 3, z = 0}, itemid = 2376}}
        }
    },

    -- Black Knight Slime Room
    [30046] = {
        name = "Black Knight Slime Room",
        toggle = false,
        onExecute = function(player, leverPos)
            local wallIds = {1026, 1498, 1304, 387, 1025}
            local wallPos = Position(leverPos.x + 1, leverPos.y, leverPos.z)
            local wallTile = Tile(wallPos)

            if wallTile then
                for _, wId in ipairs(wallIds) do
                    local wall = wallTile:getItemById(wId)
                    if wall then
                        wall:remove()
                    end
                end
            end
            wallPos:sendMagicEffect(CONST_ME_POFF)
            player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a grinding noise as a passage opens.")
            return true
        end,
        onExecuteToggleBack = function(player, leverPos)
            local wallPos = Position(leverPos.x + 1, leverPos.y, leverPos.z)
            local wallTile = Tile(wallPos)
            if wallTile and wallTile:getItemCountById(1026) == 0 then
                Game.createItem(1026, 1, wallPos)
            end
            wallPos:sendMagicEffect(CONST_ME_TELEPORT)
            player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a grinding noise as the passage closes.")
        end
    },
    [30024] = {
        name = "Black Knight Slime Room (Alias)",
        toggle = false,
        onExecute = function(player, leverPos) return levers[30046].onExecute(player, leverPos) end,
        onExecuteToggleBack = function(player, leverPos) return levers[30046].onExecuteToggleBack(player, leverPos) end
    },

    -- Bright Sword Quest
    [30047] = {
        name = "Bright Sword Quest",
        toggle = false,
        onExecute = function(player, leverPos)
            local barrelPos = Position(leverPos.x, leverPos.y + 1, leverPos.z)
            local ringPos = Position(leverPos.x - 1, leverPos.y + 1, leverPos.z)
            local stonePos = Position(leverPos.x + 2, leverPos.y, leverPos.z)
            
            local barrelTile = Tile(barrelPos)
            local ringTile = Tile(ringPos)
            local stoneTile = Tile(stonePos)
            
            if not barrelTile or not ringTile or not stoneTile then
                player:sendCancelMessage("The layout of the room is invalid.")
                return false
            end
            
            local barrel = barrelTile:getItemById(2595)
            local ring = ringTile:getItemById(2166)
            
            if barrel and ring then
                local stone = stoneTile:getItemById(1355)
                if stone then
                    stone:remove()
                    stonePos:sendMagicEffect(CONST_ME_POFF)
                    ring:remove(1)
                    return true
                else
                    player:sendCancelMessage("The stone is already removed.")
                    return false
                end
            else
                player:sendCancelMessage("The sacrifices are not in the correct position.")
                return false
            end
        end,
        onExecuteToggleBack = function(player, leverPos)
            local stonePos = Position(leverPos.x + 2, leverPos.y, leverPos.z)
            Game.createItem(1355, 1, stonePos)
            stonePos:sendMagicEffect(CONST_ME_TELEPORT)
        end
    },

    -- Paradox Tower Magic Walls
    [30033] = {
        name = "Paradox Tower Magic Walls",
        toggle = false,
        onExecute = function(player, leverPos)
            local wallPos1 = Position(32478, 31907, 7)
            local wallPos2 = Position(32479, 31907, 7)
            local tile1 = Tile(wallPos1)
            local tile2 = Tile(wallPos2)
            local wall1 = tile1 and tile1:getItemById(1498)
            local wall2 = tile2 and tile2:getItemById(1498)
            
            if wall1 or wall2 then
                if wall1 then wall1:remove() end
                if wall2 then wall2:remove() end
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a mechanism clicking and the magic walls disappear.")
            else
                Game.createItem(1498, 1, wallPos1)
                Game.createItem(1498, 1, wallPos2)
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a mechanism clicking and the magic walls reappear.")
            end
            return true
        end,
        onExecuteToggleBack = function(player, leverPos)
            local wallPos1 = Position(32478, 31907, 7)
            local wallPos2 = Position(32479, 31907, 7)
            local tile1 = Tile(wallPos1)
            local tile2 = Tile(wallPos2)
            local wall1 = tile1 and tile1:getItemById(1498)
            local wall2 = tile2 and tile2:getItemById(1498)
            
            if wall1 or wall2 then
                if wall1 then wall1:remove() end
                if wall2 then wall2:remove() end
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a mechanism clicking and the magic walls disappear.")
            else
                Game.createItem(1498, 1, wallPos1)
                Game.createItem(1498, 1, wallPos2)
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a mechanism clicking and the magic walls reappear.")
            end
        end
    },

    -- Paradox Tower Stairs
    [30030] = {
        name = "Paradox Tower Stairs",
        toggle = false,
        onExecute = function(player, leverPos)
            local stairPositions = {
                [14] = Position(32476, 31904, 7),
                [7]  = Position(32476, 31904, 7),
                [6]  = Position(32481, 31903, 6),
                [5]  = Position(32479, 31904, 5),
                [4]  = Position(32478, 31903, 4),
                [3]  = Position(32476, 31899, 3)
            }
            local leverZ = leverPos.z
            local stairPos = stairPositions[leverZ]
            
            if not stairPos then
                player:sendTextMessage(MESSAGE_INFO_DESCR, "This lever seems to be broken.")
                return false
            end
            
            local tile = Tile(stairPos)
            if tile then
                local existing = tile:getItemById(414)
                if not existing then
                    Game.createItem(414, 1, stairPos)
                    stairPos:sendMagicEffect(CONST_ME_MAGIC_BLUE)
                    player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a loud rumble far away.")
                    
                    local function removeStair(pos)
                        local t = Tile(pos)
                        if t then
                            local stair = t:getItemById(414)
                            if stair then
                                stair:remove()
                                pos:sendMagicEffect(CONST_ME_POFF)
                            end
                        end
                        local leverTile = Tile(leverPos)
                        if leverTile then
                            local lever = leverTile:getItemById(1946)
                            if lever then
                                lever:transform(1945)
                            end
                        end
                    end
                    addEvent(removeStair, 30 * 1000, stairPos)
                end
            end
            return true
        end,
        onExecuteToggleBack = function(player, leverPos)
            player:sendTextMessage(MESSAGE_INFO_DESCR, "The mechanism is resetting.")
        end
    }
}


    for i = 1, 5 do
        levers[30040 + i] = {
            name = "Banshee Logic Seal " .. i,
            toggle = false,
            onExecute = function(player, leverPos)
                if player:getStorageValue(50006) >= 1 then
                    player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You have already absorbed the energy of this seal.")
                    return true
                end

                local storage = 30040
                local warlockPos = {Position(32220, 31847, 15), Position(32221, 31847, 15)}
                local leverIndex = i
                local currentState = player:getStorageValue(storage)
                if currentState == -1 then currentState = 0 end
                
                if currentState == (leverIndex - 1) then
                    player:setStorageValue(storage, leverIndex)
                    player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
                    
                    if leverIndex == 5 then
                        player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You hear a mechanism clicking. You have absorbed the energy of the Logic Seal!")
                        player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
                        if player:getStorageValue(50006) < 1 then
                            player:setStorageValue(50006, 1)
                            local totalSeals = player:getStorageValue(50000)
                            if totalSeals < 0 then totalSeals = 0 end
                            player:setStorageValue(50000, totalSeals + 1)
                        end
                    end
                    return true
                else
                    player:setStorageValue(storage, 0)
                    for _, pos in ipairs(warlockPos) do
                        Game.createMonster("Warlock", pos)
                    end
                    player:getPosition():sendMagicEffect(CONST_ME_POISONAREA)
                    return true
                end
            end,
            onExecuteToggleBack = function(player, leverPos)
                local storage = 30040
                local leverIndex = i
                local currentState = player:getStorageValue(storage)
                if currentState == leverIndex then
                    player:setStorageValue(storage, leverIndex - 1)
                end
            end
        }
    end


function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end


    local quest = levers[item.actionid]
    if not quest then return false end

    if item.itemid ~= 1945 then
        if item.itemid == 1946 then
            item:transform(1945)
            if quest.onExecuteToggleBack then
                quest.onExecuteToggleBack(player, item:getPosition())
            elseif quest.toggle then
                quest.onExecute(player, item:getPosition())
            end
        end
        return true
    end


    local leverPos = item:getPosition()
    local validPlayers = {}
    
    -- 1. Validação de Jogadores e Sacrifícios
    for i, pConfig in ipairs(quest.players or {}) do
        local playerPos = Position(leverPos.x + pConfig.relPos.x, leverPos.y + pConfig.relPos.y, leverPos.z)
        local tile = Tile(playerPos)
        
        if not tile then
            player:sendCancelMessage("The layout of the room is invalid.")
            return true
        end
        
        local creature = tile:getTopCreature()
        if not creature or not creature:isPlayer() then
            player:sendCancelMessage("You need " .. quest.exactPlayers .. " players to start this quest.")
            return true
        end
        
        if creature:getLevel() < quest.level and creature:getGroup():getAccess() == 0 then
            player:sendCancelMessage(creature:getName() .. " is not level " .. quest.level .. " or higher.")
            return true
        end
        
        if pConfig.vocations and not isInArray(pConfig.vocations, creature:getVocation():getId()) then
            player:sendCancelMessage(creature:getName() .. " does not have the correct vocation.")
            return true
        end
        
        -- Validação de Sacrifício
        if pConfig.sacrifice then
            local altarPos = Position(leverPos.x + pConfig.sacrifice.relPos.x, leverPos.y + pConfig.sacrifice.relPos.y, leverPos.z)
            local altarTile = Tile(altarPos)
            if not altarTile or altarTile:getItemCountById(pConfig.sacrifice.itemid) == 0 then
                player:sendCancelMessage("The sacrifices are not correctly placed.")
                return true
            end
        end
        
        table.insert(validPlayers, {creature = creature, config = pConfig})
    end
    
    -- 2. Hook de execução específica (Ex: checar time dentro da sala, sumonar bichos)
    if quest.onExecute then
        if not quest.onExecute(player, leverPos) then
            return true
        end
    end
    
    -- 3. Consumir Sacrifícios e Teleportar
    for _, pData in ipairs(validPlayers) do
        local creature = pData.creature
        local pConfig = pData.config
        
        -- Consumir sacrifício se existir
        if pConfig.sacrifice then
            local altarPos = Position(leverPos.x + pConfig.sacrifice.relPos.x, leverPos.y + pConfig.sacrifice.relPos.y, leverPos.z)
            local altarTile = Tile(altarPos)
            local sacrificeItem = altarTile:getItemById(pConfig.sacrifice.itemid)
            if sacrificeItem then
                sacrificeItem:remove(1)
            end
        end
        
        -- Teleport
        creature:getPosition():sendMagicEffect(CONST_ME_POFF)
        creature:teleportTo(pConfig.newPos)
        creature:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
    end
    
    item:transform(1946)
    return true
end






