function onSay(player, words, param)
    for x = 33314, 33316 do
        for y = 31591, 31593 do
            local t = Tile(Position(x,y,15))
            if t then
                for i = 1, t:getThingCount() do
                    local item = t:getThing(i)
                    if item and item:isItem() and not item:isCreature() then
                        local id = item:getId()
                        if id ~= 1945 and id ~= 1946 and id < 1740 or id > 1750 then
                            player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, 'X:'..x..' Y:'..y..' ID:'..id..' Name:'..item:getName())
                        end
                    end
                end
            end
        end
    end
    return false
end
