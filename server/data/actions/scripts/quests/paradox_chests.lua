local rewards = {
    [32477] = {itemid = 2160, count = 1, desc = "10000 gold coins"},
    [32478] = {itemid = 2150, count = 32, desc = "32 talismans"},
    [32479] = {itemid = 2181, count = 1, desc = "a wand"},
    [32480] = {itemid = 2328, count = 1, desc = "a phoenix egg"}
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    -- In Paradox, you can choose TWO rewards. 
    -- The storage 30026 tracks how many you took.
    local takenCount = player:getStorageValue(30026)
    if takenCount < 0 then takenCount = 0 end

    -- Check if this specific chest is already taken
    -- We can use item.actionid - 30020 as an offset, or just position.
    local chestX = toPosition.x
    local chestStorage = 30027 + (chestX - 32477)
    
    if player:getStorageValue(chestStorage) == 1 then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "It is empty.")
        return true
    end

    if takenCount >= 2 and not player:getGroup():getAccess() then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You have already taken your two rewards.")
        return true
    end

    local reward = rewards[chestX]
    if not reward then return true end

    player:addItem(reward.itemid, reward.count)
    player:setStorageValue(chestStorage, 1)
    player:setStorageValue(30026, takenCount + 1)
    
    player:sendTextMessage(MESSAGE_INFO_DESCR, "You have found " .. reward.desc .. ".")
    return true
end
