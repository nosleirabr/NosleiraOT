local config = {
    -- Slime lever configuration for Mintwallin/Mad Mage access
    wallIds = {1026, 1498, 1304, 387, 1025},
    wallRel = {x = 1, y = 0, z = 0}
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    local leverPos = item:getPosition()
    local wallPos = Position(leverPos.x + config.wallRel.x, leverPos.y + config.wallRel.y, leverPos.z)
    local wallTile = Tile(wallPos)

    if item.itemid == 1945 then
        if wallTile then
            for _, wId in ipairs(config.wallIds) do
                local wall = wallTile:getItemById(wId)
                if wall then
                    wall:remove()
                end
            end
        end
        wallPos:sendMagicEffect(CONST_ME_POFF)
        item:transform(1946)
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a grinding noise as a passage opens.")
    elseif item.itemid == 1946 then
        if wallTile and wallTile:getItemCountById(1026) == 0 then
            Game.createItem(1026, 1, wallPos)
        end
        wallPos:sendMagicEffect(CONST_ME_TELEPORT)
        item:transform(1945)
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a grinding noise as the passage closes.")
    end
    
    return true
end
