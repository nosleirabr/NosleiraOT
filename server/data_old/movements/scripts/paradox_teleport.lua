function onStepIn(creature, item, position, fromPosition)
    if not creature:isPlayer() then return true end
    
    if creature:getStorageValue(30025) == 1 or creature:getGroup():getAccess() then
        creature:teleportTo(Position(32478, 31904, 1))
        creature:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
    else
        creature:teleportTo(Position(32479, 31908, 7)) -- kicked down to entrance
        creature:getPosition():sendMagicEffect(CONST_ME_POFF)
        creature:sendTextMessage(MESSAGE_INFO_DESCR, "You must answer the Riddler's questions first.")
    end
    return true
end
