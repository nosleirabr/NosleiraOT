function onSay(player, words, param)
    local results = 0
    for z = 15, 15 do
        for x = 32200, 32300 do
            for y = 31800, 31900 do
                local tile = Tile(Position(x, y, z))
                if tile then
                    local item = tile:getItemById(1945) or tile:getItemById(1946)
                    if item then
                        player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "Lever found at: " .. x .. ", " .. y .. ", " .. z)
                        results = results + 1
                    end
                end
            end
        end
    end
    player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "Found " .. results .. " levers.")
    return false
end
