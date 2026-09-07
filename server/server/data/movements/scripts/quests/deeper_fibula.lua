local destPos = Position(32832, 32274, 9) -- Approximate Deeper Fibula start position

function onStepIn(creature, item, position, fromPosition)
    if not creature:isPlayer() then
        return true
    end

    creature:teleportTo(destPos)
    creature:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
    creature:sendTextMessage(MESSAGE_INFO_DESCR, "You have entered the depths of Fibula. There is no turning back.")
    return true
end
