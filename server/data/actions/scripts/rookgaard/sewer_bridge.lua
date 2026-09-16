function onUse(player, item, fromPosition, target, toPosition)
    local leverUpId = 1945
    local leverDownId = 1946
    local bridgeId = 1284

    local tiles = {
        {pos = {x = 32100, y = 32205, z = 8}, waterId = 508},
        {pos = {x = 32101, y = 32205, z = 8}, waterId = 509}
    }

    if item:getId() == leverUpId then
        item:transform(leverDownId, 1)
        item:decay()

        for _, t in ipairs(tiles) do
            local tile = Tile(t.pos)
            if tile then
                local ground = tile:getGround()
                if ground and ground:getId() ~= bridgeId then
                    ground:transform(bridgeId, 1)
                end
            end
        end
    elseif item:getId() == leverDownId then
        item:transform(leverUpId, 1)
        item:decay()

        for _, t in ipairs(tiles) do
            local tile = Tile(t.pos)
            if tile then
                local ground = tile:getGround()
                if ground and ground:getId() == bridgeId then
                    ground:transform(t.waterId, 1)
                end
            end
        end
    end

    return true
end