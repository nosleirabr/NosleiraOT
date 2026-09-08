local config = {
    storage = 12460, -- Postman Rank Storage
    ranks = {
        [30051] = 1, -- Assistant Postman
        [30052] = 2, -- Postman
        [30053] = 3, -- Grand Postman
        [30054] = 4, -- Grand Postman for Special Operations
        [30055] = 5  -- Arch Postman
    }
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local requiredRank = config.ranks[item.actionid]
    if not requiredRank then return false end

    if player:getStorageValue(config.storage) >= requiredRank then
        item:transform(item.itemid + 1)
        player:teleportTo(toPosition, true)
    else
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You don't have the required Postman rank to enter.")
    end
    
    return true
end
