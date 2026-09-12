function onSay(player, words, param)
	if not player:getGroup():getAccess() then
		return true
	end

	-- Mochila Principal (Golden Backpack)
	local mainBp = player:addItem(2004, 1)
	if not mainBp then
		player:sendCancelMessage("Voce nao tem espaco para receber o kit GM.")
		return false
	end

	-- Equipamentos e Acessorios
	mainBp:addItem(2390, 1) -- Magic Longsword (Atk: 80, Def: 60)
	mainBp:addItem(2523, 1) -- Blessed Shield (Def: 40)
	mainBp:addItem(2493, 1) -- Demon Helmet (Arm: 10)
	mainBp:addItem(2472, 1) -- Magic Plate Armor (Arm: 17)
	mainBp:addItem(2495, 1) -- Demon Legs (Arm: 9)
	mainBp:addItem(2195, 1) -- Boots of Haste (Speed +20)
	mainBp:addItem(2173, 1) -- Amulet of Loss
	mainBp:addItem(2165, 1) -- Stealth Ring
	mainBp:addItem(2164, 1) -- Might Ring

	-- Ferramentas essenciais
	mainBp:addItem(2120, 1) -- Rope
	mainBp:addItem(2554, 1) -- Shovel
	mainBp:addItem(2553, 1) -- Pick
	mainBp:addItem(2420, 1) -- Machete

	-- Dinheiro (100 Crystal Coins = 1kk)
	mainBp:addItem(2160, 100)

	-- Sub-backpack 1: Mochila de SD (20x SDs com 100 cargas cada)
	local sdContainer = mainBp:addItem(2000, 1) -- Purple BP
	if sdContainer then
		for i = 1, 19 do
			local r = sdContainer:addItem(2268, 1)
			if r then r:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end
		end
	end

	-- Sub-backpack 2: Mochila de UH (20x UHs com 100 cargas cada)
	local uhContainer = mainBp:addItem(2002, 1) -- Grey BP
	if uhContainer then
		for i = 1, 19 do
			local r = uhContainer:addItem(2273, 1)
			if r then r:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end
		end
	end

	-- Sub-backpack 3: Mochila de Magic Wall & Desintegrate
	local mwContainer = mainBp:addItem(2001, 1) -- Green BP
	if mwContainer then
		for i = 1, 10 do
			local r = mwContainer:addItem(2293, 1) -- MW
			if r then r:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end
		end
		for i = 1, 9 do
			local r = mwContainer:addItem(2310, 1) -- Desintegrate
			if r then r:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end
		end
	end

	-- Sub-backpack 4: Mochila de Area (GFB & Explosion)
	local aoeContainer = mainBp:addItem(2003, 1) -- Red BP
	if aoeContainer then
		for i = 1, 10 do
			local r = aoeContainer:addItem(2304, 1) -- GFB
			if r then r:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end
		end
		for i = 1, 9 do
			local r = aoeContainer:addItem(2313, 1) -- Explosion
			if r then r:setAttribute(ITEM_ATTRIBUTE_CHARGES, 100) end
		end
	end

	player:sendTextMessage(MESSAGE_INFO_DESCR, "Kit completo de GM recebido com sucesso!")
	player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
	return false
end

