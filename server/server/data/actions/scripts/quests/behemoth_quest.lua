-- Modulo: Behemoth Quest (Edron Cyclopolis)
local config = {
    leverId = 1945,
    leverPos = Position(33290, 31715, 12),
    timeToClose = 3 * 60 * 1000, -- 3 minutos
    stones = {
        {pos = Position(33295, 31677, 15), id = 1304},
        {pos = Position(33296, 31677, 15), id = 1304},
        {pos = Position(33297, 31677, 15), id = 1304},
        {pos = Position(33298, 31677, 15), id = 1304},
        {pos = Position(33299, 31677, 15), id = 1304}
    }
}

local function resetWall()
    for _, stone in ipairs(config.stones) do
        local tile = Tile(stone.pos)
        if tile and not tile:getItemById(stone.id) then
            Game.createItem(stone.id, 1, stone.pos)
        end
    end
    -- Reset lever
    local leverTile = Tile(config.leverPos)
    if leverTile then
        local lever = leverTile:getItemById(1946)
        if lever then
            lever:transform(config.leverId)
        end
    end
end

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    if item.itemid == config.leverId then
        local foundBarrier = false
        
        for _, stone in ipairs(config.stones) do
            local tile = Tile(stone.pos)
            if tile then
                local barrier = tile:getItemById(stone.id)
                if barrier then
                    barrier:remove()
                    foundBarrier = true
                end
            end
        end
        
        if foundBarrier then
            addEvent(resetWall, config.timeToClose)
            item:transform(1946)
            player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "The barrier blocking the Behemoth room has been removed for 3 minutes.")
        else
            player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "The barrier is already open.")
        end
    elseif item.itemid == 1946 then
        player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "The mechanism is already active.")
    end
    return true
end
