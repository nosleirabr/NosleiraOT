local config = {
    parts = {2335, 2336, 2337, 2338, 2339, 2340, 2341},
    altarRel = {x = 1, y = 0, z = 0}, -- Relative to the lever
    resultItem = 2342, -- Uncharged Helmet of the Ancients
    effect = CONST_ME_MAGIC_RED
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    if item.itemid == 1945 then
        local leverPos = item:getPosition()
        local altarPos = Position(leverPos.x + config.altarRel.x, leverPos.y + config.altarRel.y, leverPos.z)
        
        local altarTile = Tile(altarPos)
        
        -- Check if parts are on the altar
        local foundPartsOnAltar = {}
        if altarTile then
            for _, partId in ipairs(config.parts) do
                local p = altarTile:getItemById(partId)
                if p then
                    table.insert(foundPartsOnAltar, p)
                end
            end
        end

        if #foundPartsOnAltar == 7 then
            for _, p in ipairs(foundPartsOnAltar) do
                p:remove(1)
            end
            Game.createItem(config.resultItem, 1, altarPos)
            altarPos:sendMagicEffect(config.effect)
            item:transform(1946)
            player:sendTextMessage(MESSAGE_INFO_DESCR, "The magical forge has assembled the ancient pieces into a Helmet of the Ancients!")
            return true
        end

        -- Check if player has all 7 parts in inventory
        local hasAllInInventory = true
        for _, partId in ipairs(config.parts) do
            if player:getItemCount(partId) < 1 then
                hasAllInInventory = false
                break
            end
        end

        if hasAllInInventory then
            for _, partId in ipairs(config.parts) do
                player:removeItem(partId, 1)
            end
            local created = Game.createItem(config.resultItem, 1, altarPos)
            if not created then
                player:addItem(config.resultItem, 1)
            end
            altarPos:sendMagicEffect(config.effect)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
            item:transform(1946)
            player:sendTextMessage(MESSAGE_INFO_DESCR, "The magical forge has assembled your ancient pieces into a Helmet of the Ancients!")
            return true
        end

        player:sendCancelMessage("You need all 7 helmet ornaments to use the ancient forge.")
    elseif item.itemid == 1946 then
        item:transform(1945)
    end
    
    return true
end
