function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    -- Mission 2: Folda Mailbox (Use Crowbar on Mailbox)
    if (item.itemid == 2416 or item.itemid == 10515) then -- Crowbar
        if target and target.itemid == 2593 and target.actionid == 100 then
            if player:getStorageValue(12451) == 1 then
                player:setStorageValue(12451, 2)
                toPosition:sendMagicEffect(CONST_ME_MAGIC_BLUE)
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You have fixed the mailbox.")
                return true
            end
        end
        return false -- let standard crowbar logic run if not this
    end

    -- Mission 9: Deliver Bag of Letters to Santa's Mailbox
    if item.itemid == 2330 then -- Bag with stolen mail
        if target and target.itemid == 2334 and target.actionid == 101 then -- Santa's Mailbox
            if player:getStorageValue(12458) == 2 then
                player:setStorageValue(12458, 3)
                toPosition:sendMagicEffect(CONST_ME_MAGIC_GREEN)
                item:transform(1993) -- Empty paper/bag
                player:sendTextMessage(MESSAGE_INFO_DESCR, "You delivered the letters.")
                return true
            end
        end
        return false
    end

    -- Mission 5: Use Present
    if item.itemid == 2331 then -- Present
        item:remove(1)
        player:getPosition():sendMagicEffect(CONST_ME_POFF)
        player:say("You open the present.", TALKTYPE_MONSTER_SAY)
        return true
    end

    return false
end
