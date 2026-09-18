-- Helper em portugues para adicionar mochila preenchida com runas
local function addRuneBackpack(mainBp, bpId, runeId, chargesCount, amount)
	local container = mainBp:addItem(bpId, 1)
	if not container then
		return nil
	end

	for _ = 1, amount do
		local rune = container:addItem(runeId, 1)
		if rune then
			rune:setAttribute(ITEM_ATTRIBUTE_CHARGES, chargesCount)
		end
	end
	return container
end

-- Helper em portugues para adicionar mochila preenchida com frascos de fluido (mana ou vida)
local function addFluidBackpack(mainBp, bpId, fluidType, amount)
	local container = mainBp:addItem(bpId, 1)
	if not container then
		return nil
	end

	local vialId = ItemIds.CONTAINERS.VIAL -- 2006 (frasco de fluido)
	for _ = 1, amount do
		container:addItem(vialId, fluidType)
	end
	return container
end

function onSay(player, words, param)
	if not player:getGroup():getAccess() then
		return true
	end

	-- Mochila Principal do Game Master (ID 2004 - Gamemaster Backpack)
	local mainBp = player:addItem(ItemIds.CONTAINERS.GAMEMASTER_BACKPACK, 1)
	if not mainBp then
		player:sendCancelMessage("Voce nao tem espaco para receber o kit GM.")
		return false
	end

	-- Equipamentos e Acessorios de teste
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
	mainBp:addItem(2120, 1) -- Rope (corda)
	mainBp:addItem(2554, 1) -- Shovel (pa)
	mainBp:addItem(2553, 1) -- Pick (picareta)
	mainBp:addItem(2420, 1) -- Machete (facao)

	-- Dinheiro (100 Crystal Coins = 1kk)
	mainBp:addItem(2160, 100)

	-- Mochila de SD (20x Sudden Death com 100 cargas cada)
	addRuneBackpack(mainBp, ItemIds.CONTAINERS.PURPLE_BACKPACK, ItemIds.RUNES.SUDDEN_DEATH, 100, 20)

	-- Mochila de UH (20x Ultimate Healing com 100 cargas cada)
	addRuneBackpack(mainBp, ItemIds.CONTAINERS.BLUE_BACKPACK, ItemIds.RUNES.ULTIMATE_HEALING, 100, 20)

	-- Mochila de MW (20x Magic Wall com 100 cargas cada)
	addRuneBackpack(mainBp, ItemIds.CONTAINERS.GREEN_BACKPACK, ItemIds.RUNES.MAGIC_WALL, 100, 20)

	-- Mochila de Disintegrate (20x Disintegrate com 100 cargas cada)
	addRuneBackpack(mainBp, ItemIds.CONTAINERS.GREY_BACKPACK, ItemIds.RUNES.DISINTEGRATE, 100, 20)

	-- Mochila de GFB (20x Great Fireball com 100 cargas cada)
	addRuneBackpack(mainBp, ItemIds.CONTAINERS.RED_BACKPACK, ItemIds.RUNES.GREAT_FIREBALL, 100, 20)

	-- Mochila de Explosion (20x Explosion com 100 cargas cada)
	addRuneBackpack(mainBp, ItemIds.CONTAINERS.YELLOW_BACKPACK, ItemIds.RUNES.EXPLOSION, 100, 20)

	-- Mochila de Mana Potion / Mana Fluid (20x Mana Fluids)
	addFluidBackpack(mainBp, ItemIds.CONTAINERS.PURPLE_BACKPACK, ItemIds.FLUIDS.MANA, 20)

	-- Mochila de HP / Life Fluid (20x Life Fluids)
	addFluidBackpack(mainBp, ItemIds.CONTAINERS.BACKPACK, ItemIds.FLUIDS.LIFE, 20)

	player:sendTextMessage(MESSAGE_INFO_DESCR, "Kit completo de GM recebido com sucesso!")
	player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
	return false
end
