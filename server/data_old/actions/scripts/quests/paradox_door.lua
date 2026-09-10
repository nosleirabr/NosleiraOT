local function hasKey3822(player)
    local function searchContainer(container)
        for i = 0, container:getSize() - 1 do
            local item = container:getItem(i)
            if item then
                if item:getId() >= 2086 and item:getId() <= 2092 and item:getActionId() == 3822 then
                    return true
                elseif item:isContainer() then
                    if searchContainer(Container(item.uid)) then
                        return true
                    end
                end
            end
        end
        return false
    end

    for slot = CONST_SLOT_FIRST, CONST_SLOT_LAST do
        local item = player:getSlotItem(slot)
        if item then
            if item:getId() >= 2086 and item:getId() <= 2092 and item:getActionId() == 3822 then
                return true
            elseif item:isContainer() then
                if searchContainer(Container(item.uid)) then
                    return true
                end
            end
        end
    end
    return false
end

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    -- GM bypass
    if player:getGroup():getAccess() > 0 then
        item:transform(item.itemid == 1213 and 1214 or 1213)
        return true
    end

    if player:getLevel() < 30 then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "Only players of level 30 or higher may pass.")
        return true
    end

    if not hasKey3822(player) then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "It is locked.")
        return true
    end
    
    -- Se tiver o level e a chave, abre ou fecha a porta (ID 1213 <-> 1214)
    item:transform(item.itemid == 1213 and 1214 or 1213)
    return true
end
