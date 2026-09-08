-- Banshee Quest Seals
-- ActionIDs: 50001 (Hidden), 50002 (Sacrifice), 50003 (Demon), 50004 (Plague), 50005 (True Path), 50006 (Logic)

function onStepIn(creature, item, position, fromPosition)
    local player = creature:getPlayer()
    if not player then
        return true
    end

    local sealId = item.actionid - 50000
    if sealId < 1 or sealId > 6 then
        return true
    end

    local masterStorage = 50000
    local sealStorage = 50000 + sealId

    -- If player hasn't completed this specific seal yet
    if player:getStorageValue(sealStorage) < 1 then
        player:setStorageValue(sealStorage, 1)
        
        -- Increment the total number of seals absorbed
        local totalSeals = player:getStorageValue(masterStorage)
        if totalSeals < 0 then
            totalSeals = 0
        end
        
        player:setStorageValue(masterStorage, totalSeals + 1)
        
        player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You have absorbed the energy of a seal.")
        player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
    end

    return true
end