local config = {
    barrelId = 2595, -- steel reinforced barrel
    stoneId = 1355,
    powerRingId = 2166,
    -- We use relative coordinates from the lever for maximum robustness
    -- Assuming Lever is at (0, 0)
    barrelRel = {x = 0, y = 1, z = 0},
    powerRingRel = {x = -1, y = 1, z = 0},
    stoneRel = {x = 2, y = 0, z = 0}
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    if item.itemid == 1945 then
        local leverPos = item:getPosition()
        
        local barrelPos = Position(leverPos.x + config.barrelRel.x, leverPos.y + config.barrelRel.y, leverPos.z)
        local ringPos = Position(leverPos.x + config.powerRingRel.x, leverPos.y + config.powerRingRel.y, leverPos.z)
        local stonePos = Position(leverPos.x + config.stoneRel.x, leverPos.y + config.stoneRel.y, leverPos.z)
        
        local barrelTile = Tile(barrelPos)
        local ringTile = Tile(ringPos)
        local stoneTile = Tile(stonePos)
        
        if not barrelTile or not ringTile or not stoneTile then
            player:sendCancelMessage("The layout of the room is invalid.")
            return true
        end
        
        local barrel = barrelTile:getItemById(config.barrelId)
        local ring = ringTile:getItemById(config.powerRingId)
        
        if barrel and ring then
            local stone = stoneTile:getItemById(config.stoneId)
            if stone then
                stone:remove()
                stonePos:sendMagicEffect(CONST_ME_POFF)
                item:transform(1946)
                
                -- Consume the power ring
                ring:remove(1)
            else
                player:sendCancelMessage("The stone is already removed.")
            end
        else
            player:sendCancelMessage("The sacrifices are not in the correct position.")
            return true
        end
    elseif item.itemid == 1946 then
        local leverPos = item:getPosition()
        local stonePos = Position(leverPos.x + config.stoneRel.x, leverPos.y + config.stoneRel.y, leverPos.z)
        
        Game.createItem(config.stoneId, 1, stonePos)
        stonePos:sendMagicEffect(CONST_ME_TELEPORT)
        item:transform(1945)
    end
    
    return true
end
