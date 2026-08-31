function onStepIn(creature, item, position, fromPosition)
    if not creature:isPlayer() then return true end
    
    -- Teleporta o jogador de volta para a base da torre (térreo, fora das portas de entrada)
    creature:teleportTo(Position(32479, 31908, 7))
    creature:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
    return true
end
