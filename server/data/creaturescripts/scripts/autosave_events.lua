local autosaveEvents = CreatureEvent("autosave_events")

function autosaveEvents.onLogout(player)
    player:save()
    return true
end

function autosaveEvents.onGainExperience(player, source, exp, rawExp)
    if exp >= 10000 then
        player:save()
    end
    return exp
end

function autosaveEvents.onTradeComplete(player, target, item, targetItem)
    player:save()
    target:save()
    return true
end

function autosaveEvents.onShopBuy(player, item, count)
    player:save()
    return true
end

function autosaveEvents.onDepositMoney(player, amount)
    player:save()
    return true
end

function autosaveEvents.onWithdrawMoney(player, amount)
    player:save()
    return true
end

function autosaveEvents.onPlayerDeath(player, corpse, killer, mostDamage, unjustified, mostDamage_unjustified)
    player:save()
    return true
end

autosaveEvents:register()