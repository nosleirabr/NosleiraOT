local config = {
    stairId = 414, -- Wooden stairs (up) - can be changed to 1386 if you want magical stairs
    timeToClose = 30 * 1000, -- 30 seconds open
}

-- Mapping Lever Z-coordinate to the position where the stair appears
local stairPositions = {
    [14] = Position(32476, 31904, 7), -- Hellgate lever (Z=14) spawns stair at base of tower (Z=7)
    [6]  = Position(32481, 31903, 6), -- Tower floor 1 lever spawns stair to go up to Z=5
    [5]  = Position(32479, 31904, 5), -- Tower floor 2 lever spawns stair to go up to Z=4
    [4]  = Position(32478, 31903, 4), -- Tower floor 3 lever spawns stair to go up to Z=3
    [3]  = Position(32476, 31899, 3)  -- Tower floor 4 lever spawns stair to go up to Z=2
}

local function removeStair(pos)
    local tile = Tile(pos)
    if tile then
        local stair = tile:getItemById(config.stairId)
        if stair then
            stair:remove()
            pos:sendMagicEffect(CONST_ME_POFF)
        end
    end
end

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    local leverZ = item:getPosition().z
    local stairPos = stairPositions[leverZ]
    
    if not stairPos then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "This lever seems to be broken.")
        return true
    end

    if item.itemid == 1945 then
        local tile = Tile(stairPos)
        if tile then
            local existing = tile:getItemById(config.stairId)
            if not existing then
                Game.createItem(config.stairId, 1, stairPos)
                stairPos:sendMagicEffect(CONST_ME_MAGIC_BLUE)
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a loud rumble far away.")
                
                -- Schedule removal
                addEvent(removeStair, config.timeToClose, stairPos)
            end
        end
        item:transform(1946)
    elseif item.itemid == 1946 then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "The mechanism is resetting.")
        item:transform(1945)
    end
    
    return true
end
