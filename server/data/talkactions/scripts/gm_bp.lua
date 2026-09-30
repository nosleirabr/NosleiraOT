-- IDs das mochilas e itens de teste
local ITEM_GAMEMASTER_BACKPACK = 2004 -- gamemaster backpack
local ITEM_PURPLE_BACKPACK = 2001 -- purple backpack
local ITEM_BLUE_BACKPACK = 2002 -- blue backpack
local ITEM_GREEN_BACKPACK = 1998 -- green backpack
local ITEM_GREY_BACKPACK = 2003 -- grey backpack
local ITEM_RED_BACKPACK = 2000 -- red backpack
local ITEM_YELLOW_BACKPACK = 1999 -- yellow backpack
local ITEM_BACKPACK = 1988 -- backpack

local ITEM_SD = 2268 -- sudden death rune
local ITEM_UH = 2273 -- ultimate healing rune
local ITEM_MW = 2293 -- magic wall rune
local ITEM_DISINTEGRATE = 2310 -- disintegrate rune
local ITEM_GFB = 2304 -- great fireball rune
local ITEM_EXPLOSION = 2313 -- explosion rune

local ITEM_VIAL = 2006 -- frasco (vial)
local FLUID_MANA = 7 -- mana fluid (subtipo 7)
local FLUID_LIFE = 10 -- life fluid (subtipo 10)

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

	for _ = 1, amount do
		container:addItem(ITEM_VIAL, fluidType)
	end
	return container
end

function onSay(player, words, param)
	-- Intenção: apenas Administrador (group_id 6) pode usar /gmbp — GM e CM são bloqueados
	if player:getGroup():getId() < 6 then
		player:sendCancelMessage("Apenas Administradores podem usar este comando.")
		return false
	end

	-- Tenta colocar no inventario do jogador; se estiver cheio, cria direto no chao aos pes
	local mainBp = player:addItem(ITEM_GAMEMASTER_BACKPACK, 1)
	local isFloor = false
	if not mainBp then
		mainBp = Game.createItem(ITEM_GAMEMASTER_BACKPACK, 1, player:getPosition())
		isFloor = true
	end

	if not mainBp then
		player:sendCancelMessage("Erro ao criar a Gamemaster Backpack.")
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
	addRuneBackpack(mainBp, ITEM_PURPLE_BACKPACK, ITEM_SD, 100, 20)

	-- Mochila de UH (20x Ultimate Healing com 100 cargas cada)
	addRuneBackpack(mainBp, ITEM_BLUE_BACKPACK, ITEM_UH, 100, 20)

	-- Mochila de MW (20x Magic Wall com 100 cargas cada)
	addRuneBackpack(mainBp, ITEM_GREEN_BACKPACK, ITEM_MW, 100, 20)

	-- Mochila de Disintegrate (20x Disintegrate com 100 cargas cada)
	addRuneBackpack(mainBp, ITEM_GREY_BACKPACK, ITEM_DISINTEGRATE, 100, 20)

	-- Mochila de GFB (20x Great Fireball com 100 cargas cada)
	addRuneBackpack(mainBp, ITEM_RED_BACKPACK, ITEM_GFB, 100, 20)

	-- Mochila de Explosion (20x Explosion com 100 cargas cada)
	addRuneBackpack(mainBp, ITEM_YELLOW_BACKPACK, ITEM_EXPLOSION, 100, 20)

	-- Mochila de Mana Potion / Mana Fluid (20x Mana Fluids)
	addFluidBackpack(mainBp, ITEM_PURPLE_BACKPACK, FLUID_MANA, 20)

	-- Mochila de HP / Life Fluid (20x Life Fluids)
	addFluidBackpack(mainBp, ITEM_BACKPACK, FLUID_LIFE, 20)

	if isFloor then
		player:sendTextMessage(MESSAGE_INFO_DESCR, "Kit GM criado no chao aos seus pes (inventario cheio)!")
	else
		player:sendTextMessage(MESSAGE_INFO_DESCR, "Kit completo de GM recebido no inventario com sucesso!")
	end

	player:getPosition():sendMagicEffect(CONST_ME_MAGIC_RED)
	return false
end
