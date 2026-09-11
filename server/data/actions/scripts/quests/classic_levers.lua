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
    }
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end


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





