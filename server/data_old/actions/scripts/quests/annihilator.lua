local config = {
    -- UID of the lever (change to match map if needed, typically 2214 or 5000)
    leverId = 1945,
    
    levelRequired = 100,
    
    playerPositions = {
        Position(33222, 31671, 13), -- Player 1 (front)
        Position(33223, 31671, 13), -- Player 2
        Position(33224, 31671, 13), -- Player 3
        Position(33225, 31671, 13)  -- Player 4 (lever)
    },
    
    targetPositions = {
        Position(33219, 31659, 13),
        Position(33220, 31659, 13),
        Position(33221, 31659, 13),
        Position(33222, 31659, 13)
    },
    
    demonPositions = {
        Position(33219, 31657, 13),
        Position(33221, 31657, 13),
        Position(33223, 31659, 13),
        Position(33224, 31659, 13),
        Position(33220, 31661, 13),
        Position(33222, 31661, 13)
    },
    
    roomArea = {
        from = Position(33217, 31655, 13),
        to = Position(33226, 31663, 13)
    }
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    if item.itemid == 1945 then
        local players = {}
        -- Check if all 4 players are present and meet the level requirement
        for _, pos in ipairs(config.playerPositions) do
            local tile = Tile(pos)
            if not tile then return false end
            
            local creature = tile:getTopCreature()
            if not creature or not creature:isPlayer() then
                player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You need 4 players to attempt the Annihilator.")
                return true
            end
            
            if creature:getLevel() < config.levelRequired then
                player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "All players must be level " .. config.levelRequired .. " or higher.")
                return true
            end
            
            table.insert(players, creature)
        end
        
        -- Check if the room is empty (no players)
        for x = config.roomArea.from.x, config.roomArea.to.x do
            for y = config.roomArea.from.y, config.roomArea.to.y do
                local tile = Tile(Position(x, y, config.roomArea.from.z))
                if tile then
                    local creature = tile:getTopCreature()
                    if creature and creature:isPlayer() then
                        player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "Someone is already in the quest room.")
                        return true
                    end
                end
            end
        end
        
        -- Clean up existing demons in the room
        for x = config.roomArea.from.x, config.roomArea.to.x do
            for y = config.roomArea.from.y, config.roomArea.to.y do
                local tile = Tile(Position(x, y, config.roomArea.from.z))
                if tile then
                    local creature = tile:getTopCreature()
                    if creature and creature:isMonster() and creature:getName():lower() == "demon" then
                        creature:remove()
                    end
                end
            end
        end
        
        -- Spawn new demons
        for _, pos in ipairs(config.demonPositions) do
            Game.createMonster("Demon", pos)
        end
        
        -- Teleport players
        for i, p in ipairs(players) do
            p:getPosition():sendMagicEffect(CONST_ME_POFF)
            p:teleportTo(config.targetPositions[i])
            config.targetPositions[i]:sendMagicEffect(CONST_ME_ENERGYAREA)
        end
        
        item:transform(1946)
        
    elseif item.itemid == 1946 then
        player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "The mechanism is locked.")
    end
    
    return true
end
