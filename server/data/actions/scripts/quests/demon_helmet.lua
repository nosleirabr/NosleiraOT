local config = {
    leverId = 1945,
    blockIds = {1497, 1498, 1499, 1353, 1354, 1355, 1304, 1285, 1356}, -- Magic wall or stones or crystals
    timeToClose = 3 * 60 * 1000 -- 3 minutes
}

local function resetWall(pos)
    local tile = Tile(pos)
    if tile and not tile:getItemById(1355) then
        Game.createItem(1355, 1, pos)
    end
    -- Reset lever (Scan area)
    for x = 33325, 33335 do
        for y = 31585, 31595 do
            local leverTile = Tile(Position(x, y, 15))
            if leverTile then
                local lever = leverTile:getItemById(1946)
                if lever then
                    lever:transform(1945)
                end
            end
        end
    end
end

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    if item.itemid == 1945 then
        local foundWall = false
        for x = 33314, 33316 do
            for y = 31591, 31593 do
                local pos = Position(x, y, 15)
                local tile = Tile(pos)
                if tile then
                    for _, blockId in ipairs(config.blockIds) do
                        local wall = tile:getItemById(blockId)
                        if wall then
                            wall:remove()
                            foundWall = true
                            addEvent(resetWall, config.timeToClose, pos)
                            break
                        end
                    end
                end
                if foundWall then break end
            end
            if foundWall then break end
        end
        
        item:transform(1946)
        if foundWall then
            player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You hear a loud grinding noise coming from the chest room.")
        end
    elseif item.itemid == 1946 then
        -- Close the wall manually
        local pos = Position(33314, 31592, 15)
        local tile = Tile(pos)
        if tile and not tile:getItemById(1355) then
            Game.createItem(1355, 1, pos)
        end
        item:transform(1945)
        player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "The mechanism resets and the passage closes.")
    end
    return true
end
