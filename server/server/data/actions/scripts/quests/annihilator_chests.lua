function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    if player:getStorageValue(30015) > 0 then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "It is empty.")
        return true
    end

    local rewardItem = 0
    local container = Container(item.uid)
    if container then
        local insideItem = container:getItem(0)
        if insideItem then
            rewardItem = insideItem:getId()
            -- Tratar o present box (Pode ter o Bear dentro)
            if rewardItem == 2326 then
                local subcontainer = Container(insideItem.uid)
                if subcontainer and subcontainer:getItem(0) then
                    rewardItem = subcontainer:getItem(0):getId()
                end
            end
        end
    end

    if rewardItem > 0 then
        player:addItem(rewardItem, 1)
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You have found a " .. ItemType(rewardItem):getName() .. ".")
        player:setStorageValue(30015, 1)
    else
        player:sendTextMessage(MESSAGE_INFO_DESCR, "It is empty.")
    end
    return true
end
