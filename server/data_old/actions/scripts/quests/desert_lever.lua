local config = {
    level = 20,
    -- Sacrifices and vocations relative to the lever (32673, 32086, 8)
    roles = {
        { -- Druid (North)
            vocations = {2, 6},
            playerRel = {x = 0, y = -1, z = 0}, -- 32673, 32085, 8
            altarRel = {x = 0, y = -3, z = 0},  -- 32673, 32083, 8
            item = 2175, -- Spellbook
            newPos = Position(32672, 32070, 8)
        },
        { -- Paladin (East)
            vocations = {3, 7},
            playerRel = {x = 6, y = 3, z = 0},  -- 32679, 32089, 8
            altarRel = {x = 8, y = 3, z = 0},   -- 32681, 32089, 8
            item = 2455, -- Crossbow
            newPos = Position(32672, 32069, 8)
        },
        { -- Sorcerer (South)
            vocations = {1, 5},
            playerRel = {x = 0, y = 7, z = 0},  -- 32673, 32093, 8
            altarRel = {x = 0, y = 9, z = 0},   -- 32673, 32095, 8
            item = 2674, -- Apple
            newPos = Position(32671, 32070, 8)
        },
        { -- Knight (West)
            vocations = {4, 8},
            playerRel = {x = -6, y = 3, z = 0}, -- 32667, 32089, 8
            altarRel = {x = -8, y = 3, z = 0},  -- 32665, 32089, 8
            item = 2376, -- Sword
            newPos = Position(32671, 32069, 8)
        }
    }
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    if item.itemid == 1945 then
        local leverPos = item:getPosition()
        local players = {}
        
        -- Validate all 4 players and their altars
        for i, role in ipairs(config.roles) do
            local playerPos = Position(leverPos.x + role.playerRel.x, leverPos.y + role.playerRel.y, leverPos.z)
            local altarPos = Position(leverPos.x + role.altarRel.x, leverPos.y + role.altarRel.y, leverPos.z)
            
            local tile = Tile(playerPos)
            if not tile then
                player:sendCancelMessage("The layout of the room is invalid.")
                return true
            end
            
            local creature = tile:getTopCreature()
            if not creature or not creature:isPlayer() then
                player:sendCancelMessage("You need 4 players to start this quest.")
                return true
            end
            
            if creature:getLevel() < config.level and creature:getGroup():getAccess() == 0 then
                player:sendCancelMessage(creature:getName() .. " is not level " .. config.level .. " or higher.")
                return true
            end
            
            if not isInArray(role.vocations, creature:getVocation():getId()) then
                player:sendCancelMessage(creature:getName() .. " does not have the correct vocation.")
                return true
            end
            
            local altarTile = Tile(altarPos)
            if not altarTile or altarTile:getItemCountById(role.item) == 0 then
                player:sendCancelMessage("The sacrifices are not correctly placed.")
                return true
            end
            
            table.insert(players, {creature = creature, role = role, altarPos = altarPos})
        end

        -- Teleport players and remove sacrifices
        for _, pData in ipairs(players) do
            pData.creature:getPosition():sendMagicEffect(CONST_ME_POFF)
            pData.creature:teleportTo(pData.role.newPos)
            pData.creature:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
            
            local altarTile = Tile(pData.altarPos)
            local sacrifice = altarTile:getItemById(pData.role.item)
            if sacrifice then
                sacrifice:remove(1)
            end
        end
        
        item:transform(1946)
    elseif item.itemid == 1946 then
        item:transform(1945)
    end
    return true
end
