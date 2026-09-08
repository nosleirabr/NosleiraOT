local config = {
    -- Lever ActionIDs: 30041, 30042, 30043, 30044, 30045 (left to right)
    -- Or we can manage state using a single storage and just check positions.
    storage = 30040, 
    -- The positions of the levers are hardcoded in the map:
    -- 32220, 31842, 15
    -- 32220, 31843, 15
    -- 32220, 31844, 15
    -- 32220, 31845, 15
    -- 32220, 31846, 15
    warlockPos = {
        Position(32220, 31847, 15),
        Position(32221, 31847, 15)
    }
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
    if doorRet ~= nil then return doorRet end

    -- We can identify which lever by its actionid (30041 to 30045)
    local leverIndex = item.actionid - 30040
    
    if leverIndex < 1 or leverIndex > 5 then
        return false
    end

    local currentState = player:getStorageValue(config.storage)
    if currentState == -1 then currentState = 0 end

    if item.itemid == 1945 then
        -- Correct order: 1, 2, 3, 4, 5
        if currentState == (leverIndex - 1) then
            player:setStorageValue(config.storage, leverIndex)
            item:transform(1946)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
            
            if leverIndex == 5 then
                player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You hear a mechanism clicking. You have absorbed the energy of the Logic Seal!")
                player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
                if player:getStorageValue(50006) < 1 then
                    player:setStorageValue(50006, 1)
                    local totalSeals = player:getStorageValue(50000)
                    if totalSeals < 0 then totalSeals = 0 end
                    player:setStorageValue(50000, totalSeals + 1)
                end
            end
        else
            -- Wrong order, reset and spawn warlock
            player:setStorageValue(config.storage, 0)
            item:transform(1946)
            
            for _, pos in ipairs(config.warlockPos) do
                Game.createMonster("Warlock", pos)
            end
            player:getPosition():sendMagicEffect(CONST_ME_POISONAREA)
        end
    elseif item.itemid == 1946 then
        item:transform(1945)
        if currentState == leverIndex then
            player:setStorageValue(config.storage, leverIndex - 1)
        end
    end

    return true
end
