function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    -- Target is the Uncharged Helmet of the Ancients (2342)
    if target and target.itemid == 2342 then
        -- Transform into Enchanted Helmet of the Ancients (2343)
        target:transform(2343)
        -- Decay is handled natively in items.xml (decays to 2342 after 30 mins)
        target:decay()
        
        toPosition:sendMagicEffect(CONST_ME_MAGIC_GREEN)
        player:sendTextMessage(MESSAGE_INFO_DESCR, "You have enchanted the Helmet of the Ancients.")
        
        -- Remove the small ruby
        item:remove(1)
        return true
    end
    
    return false
end
