function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local storage = 30017 -- Desert Quest Storage (separate from STORAGEVALUE_PROMOTION)
    if player:getStorageValue(storage) > 0 then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "It is empty.")
        return true
    end

    local bag = Game.createItem(1987, 1) -- Bag
    if bag then
        bag:addItem(2160, 1) -- 10k (1 Crystal Coin)
        bag:addItem(2193, 1) -- Ankh
        bag:addItem(2169, 1) -- Ring of Healing
        bag:addItem(2162, 1) -- Magic Light Wand
        bag:addItem(2200, 1) -- Protection Amulet
        bag:addItem(2652, 1) -- Green Tunic
    end

    if player:addItemEx(bag) ~= RETURNVALUE_NOERROR then
        local weight = bag:getWeight()
        if player:getFreeCapacity() < weight then
            player:sendCancelMessage(string.format('You have found a bag weighing %.2f oz. You have no capacity.', (weight / 100)))
        else
            player:sendCancelMessage('You have found a bag, but you have no room to take it.')
        end
        return true
    end

    player:setStorageValue(storage, 1)
    player:sendTextMessage(MESSAGE_INFO_DESCR, "You have found a bag.")
    return true
end
