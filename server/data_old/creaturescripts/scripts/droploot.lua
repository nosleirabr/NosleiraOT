function onDeath(player, corpse, killer, mostDamage, unjustified, mostDamage_unjustified)
	if getPlayerFlagValue(player, PlayerFlag_NotGenerateLoot) then
		return true
	end

	local amulet = player:getSlotItem(CONST_SLOT_NECKLACE)
	local hasSkull = isInArray({SKULL_RED, SKULL_BLACK}, player:getSkull())
	
	-- 7.4 Authentic AOL Mechanic: Protects everything, breaks on death, doesn't work if Red Skull
	if amulet and amulet.itemid == ITEM_AMULETOFLOSS and not hasSkull then
		player:removeItem(ITEM_AMULETOFLOSS, 1, -1, false)
	else
		-- No AOL or Red Skull:
		for i = CONST_SLOT_HEAD, CONST_SLOT_AMMO do
			local item = player:getSlotItem(i)
			if item then
				-- In 7.4, Backpack always drops 100%. Equipment has 10% chance to drop.
				-- Red skull always drops 100% of everything.
				local dropChance = 10 -- 10% chance for equips
				if item:isContainer() then
					dropChance = 100 -- Backpack is always 100%
				end
				
				if hasSkull or math.random(1, 100) <= dropChance then
					if not item:moveTo(corpse) then
						item:remove()
					end
				end
			end
		end
	end

	-- Give a new bag if they dropped their backpack
	if not player:getSlotItem(CONST_SLOT_BACKPACK) then
		player:addItem(ITEM_BAG, 1, false, CONST_SLOT_BACKPACK)
	end

	return true
end
