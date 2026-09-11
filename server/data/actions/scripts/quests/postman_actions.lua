function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    -- Mission 8: Waldo's dead body
    if item.uid == 3018 then
        if player:getStorageValue(12457) == 1 then
            player:setStorageValue(12457, 2)
            player:addItem(2332, 1) -- Waldo's posthorn
            player:sendTextMessage(MESSAGE_INFO_DESCR, "You have found Waldo's posthorn.")
        else
            player:sendTextMessage(MESSAGE_INFO_DESCR, "It is empty.")
        end
        return true
    end

    -- Mission 9: Stolen Mail Bag (Chest in Kevin's room)
    if item.uid == 3116 then
        if player:getStorageValue(12458) == 1 then
            player:setStorageValue(12458, 2)
            player:addItem(2330, 1) -- Stolen mail bag
            player:sendTextMessage(MESSAGE_INFO_DESCR, "You have found a bag with stolen mail.")
        else
            player:sendTextMessage(MESSAGE_INFO_DESCR, "It is empty.")
        end
        return true
    end

    -- Mission 5: Present for Dermot (Chest in Kevin's room)
    if item.uid == 3120 then
        if player:getStorageValue(12454) == 1 then
            player:setStorageValue(12454, 2)
            player:addItem(2331, 1) -- Present
            player:sendTextMessage(MESSAGE_INFO_DESCR, "You have found a present.")
        else
            player:sendTextMessage(MESSAGE_INFO_DESCR, "It is empty.")
        end
        return true
    end

    return false
end
