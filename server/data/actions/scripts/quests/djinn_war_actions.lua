function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    -- Efreet Faction Mission 3: Exchanging the Lamp
    if item.uid == 2285 then
        if player:getStorageValue(51123) == 1 then
            if player:removeItem(2344, 1) then
                player:setStorageValue(51123, 2)
                player:addItem(2356, 1)
                toPosition:sendMagicEffect(CONST_ME_MAGIC_BLUE)
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You have exchanged the lamp.")
            else
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You do not have the required lamp to exchange.")
            end
        else
            player:sendTextMessage(MESSAGE_INFO_DESCR, "You have already exchanged the lamp or do not need to do this.")
        end
        return true
    end

    -- Marid Faction Mission 3: Exchanging the Lamp
    if item.uid == 3024 then
        if player:getStorageValue(51114) == 1 then
            if player:removeItem(2344, 1) then
                player:setStorageValue(51114, 2)
                player:addItem(2356, 1)
                toPosition:sendMagicEffect(CONST_ME_MAGIC_RED)
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You have exchanged the lamp.")
            else
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You do not have the required lamp to exchange.")
            end
        else
            player:sendTextMessage(MESSAGE_INFO_DESCR, "You have already exchanged the lamp or do not need to do this.")
        end
        return true
    end

    return false
end

