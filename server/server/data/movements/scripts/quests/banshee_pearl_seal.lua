local config = {
    blackPearlBasin = Position(32269, 31860, 11), -- Example coordinates
    whitePearlBasin = Position(32269, 31862, 11),
    blackPearlId = 2144,
    whitePearlId = 2143,
    teleportTo = Position(32271, 31861, 11)
}

function onStepIn(creature, item, position, fromPosition)
    if not creature:isPlayer() then
        return true
    end

    local blackBasinTile = Tile(config.blackPearlBasin)
    local whiteBasinTile = Tile(config.whitePearlBasin)

    if not blackBasinTile or not whiteBasinTile then
        creature:teleportTo(fromPosition, true)
        return true
    end

    local blackPearl = blackBasinTile:getItemById(config.blackPearlId)
    local whitePearl = whiteBasinTile:getItemById(config.whitePearlId)

    if blackPearl and whitePearl then
        creature:getPosition():sendMagicEffect(CONST_ME_POFF)
        creature:teleportTo(config.teleportTo)
        creature:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
        
        blackPearl:remove(1)
        whitePearl:remove(1)
    else
        creature:sendTextMessage(MESSAGE_INFO_DESCR, "You need to place a black and a white pearl on the basins.")
        creature:teleportTo(fromPosition, true)
    end
    
    return true
end
