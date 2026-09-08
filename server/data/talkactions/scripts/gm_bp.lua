function onSay(player, words, param)
	if player:getGroup():getId() < 3 then
		return true
	end

	local bp = player:addItem(2004, 1)
	if bp then
		bp:addItem(2160, 100) -- Crystal Coins
		
		local sd = bp:addItem(2268, 1) -- SD
		if sd then sd:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end
		
		local uh = bp:addItem(2273, 1) -- UH
		if uh then uh:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end
		
		local mw = bp:addItem(2293, 1) -- MW
		if mw then mw:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end

		local hmm = bp:addItem(2311, 1) -- HMM
		if hmm then hmm:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end

		local explo = bp:addItem(2313, 1) -- Explo
		if explo then explo:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end

		bp:addItem(2390, 1) -- Magic Longsword
		bp:addItem(2520, 1) -- Demon Shield
		bp:addItem(2493, 1) -- Demon Helmet
		bp:addItem(2494, 1) -- Demon Armor
		bp:addItem(2495, 1) -- Demon Legs
		bp:addItem(2195, 1) -- Boots of haste
		bp:addItem(2173, 1) -- Amulet of loss

		player:sendTextMessage(MESSAGE_INFO_DESCR, "GM Backpack recebida com sucesso!")
		player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
	else
		player:sendCancelMessage("Voce nao tem espaco para receber a BP.")
	end

	return false
end

