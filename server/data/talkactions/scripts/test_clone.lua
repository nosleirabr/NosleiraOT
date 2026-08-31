function onSay(player, words, param)
    local item = Game.createItem(2536, 1)
    if not item then player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, 'failed createItem') return false end
    local cloned = item:clone()
    if not cloned then player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, 'failed clone') return false end
    player:addItemEx(cloned)
    player:sendTextMessage(MESSAGE_STATUS_CONSOLE_BLUE, 'Success')
    return false
end
