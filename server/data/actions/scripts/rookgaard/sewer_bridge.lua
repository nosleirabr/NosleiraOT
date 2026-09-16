function onUse(player, item, fromPosition, target, toPosition)
    local leverPos = item:getPosition()
    local bridgePos1 = {x = 32100, y = 32205, z = 8}
    local bridgePos2 = {x = 32101, y = 32205, z = 8}
    local waterId1 = 508
    local waterId2 = 509
    local bridgeId = 1284
    local leverUpId = 1945
    local leverDownId = 1946

    if item:getId() == leverUpId then
        item:transform(leverDownId, 1)
        item:decay()

        local tile1 = Tile(bridgePos1)
        if tile1 then
            local ground1 = tile1:getGround()
            if ground1 and ground1:getId() == waterId1 then
                ground1:transform(bridgeId, 1)
            end
        end

        local tile2 = Tile(bridgePos2)
        if tile2 then
            local ground2 = tile2:getGround()
            if ground2 and ground2:getId() == waterId2 then
                ground2:transform(bridgeId, 1)
            end
        end

        elseif item:getId() == leverDownId then
        item:transform(leverUpId, 1)
        item:decay()

        local tile1 = Tile(bridgePos1)
        if tile1 then
            local ground1 = tile1:getGround()
            if ground1 and ground1:getId() == bridgeId then
                ground1:transform(waterId1, 1)
            end
        end

        local tile2 = Tile(bridgePos2)
        if tile2 then
            local ground2 = tile2:getGround()
            if ground2 and ground2:getId() == bridgeId then
                ground2:transform(waterId2, 1)
            end
        end
    end

    return true
end