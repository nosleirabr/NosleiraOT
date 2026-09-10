local config = {
    level = 100,
    -- Position of players relative to the lever (Player 1 is left-most, Player 4 is right-most)
    playerRelPositions = {
        {x = -4, y = 0, z = 0}, -- Player 1
        {x = -3, y = 0, z = 0}, -- Player 2
        {x = -2, y = 0, z = 0}, -- Player 3
        {x = -1, y = 0, z = 0}  -- Player 4
    },
    newPositions = {
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
    }
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    if item.itemid == 1945 then
        local leverPos = item:getPosition()
        local players = {}
        
        for i, rel in ipairs(config.playerRelPositions) do
            local pos = Position(leverPos.x + rel.x, leverPos.y + rel.y, leverPos.z)
            local tile = Tile(pos)
            if tile then
                local creature = tile:getTopCreature()
                if creature and creature:isPlayer() then
                    if creature:getLevel() < config.level and creature:getGroup():getAccess() == 0 then
                        player:sendCancelMessage(creature:getName() .. " is not level " .. config.level .. " or higher.")
                        return true
                    end
                    table.insert(players, {creature = creature, index = i})
                end
            end
        end

        if #players < 4 then
            player:sendCancelMessage("You need 4 players to start this quest.")
            return true
        end

        -- Check if room is empty (only checks players)
        local roomCenter = Position(33221, 31659, 13)
        local spectators = Game.getSpectators(roomCenter, false, true, 5, 5, 5, 5)
        if #spectators > 0 then
            player:sendCancelMessage("There is a team already inside the quest room.")
            return true
        end

        -- Remove existing demons
        local monsters = Game.getSpectators(roomCenter, false, false, 5, 5, 5, 5)
        for _, monster in ipairs(monsters) do
            if monster:isMonster() then
                monster:remove()
            end
        end

        -- Spawn new demons precisely where they belong
        for _, pos in ipairs(config.demonPositions) do
            Game.createMonster("Demon", pos)
        end

        -- Teleport players
        for _, pData in ipairs(players) do
            pData.creature:getPosition():sendMagicEffect(CONST_ME_POFF)
            pData.creature:teleportTo(config.newPositions[pData.index])
            pData.creature:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
        end
        item:transform(1946)
    elseif item.itemid == 1946 then
        item:transform(1945)
    end
    return true
end
