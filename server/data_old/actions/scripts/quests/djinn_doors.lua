local config = {
    [30061] = {storage = 51110, name = "Marid (Blue Djinn)"},
    [30062] = {storage = 51120, name = "Efreet (Green Djinn)"}
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local faction = config[item.actionid]
    if not faction then return false end

    if player:getStorageValue(faction.storage) > 0 then
        item:transform(item.itemid + 1)
        player:teleportTo(toPosition, true)
    else
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You are not pledged to the " .. faction.name .. " faction.")
    end
    
    return true
end
