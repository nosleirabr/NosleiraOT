function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    local wallPos1 = Position(32478, 31907, 7)
    local wallPos2 = Position(32479, 31907, 7)
    
    local tile1 = Tile(wallPos1)
    local tile2 = Tile(wallPos2)
    
    local wall1 = tile1 and tile1:getItemById(1498)
    local wall2 = tile2 and tile2:getItemById(1498)
    
    if wall1 or wall2 then
        -- Se a parede existe, remove ela
        if wall1 then wall1:remove() end
        if wall2 then wall2:remove() end
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a mechanism clicking and the magic walls disappear.")
    else
        -- Se nao existe, cria de volta
        Game.createItem(1498, 1, wallPos1)
        Game.createItem(1498, 1, wallPos2)
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You hear a mechanism clicking and the magic walls reappear.")
    end
    
    item:transform(item.itemid == 1945 and 1946 or 1945)
    return true
end
