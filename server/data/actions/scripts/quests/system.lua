local specialQuests = {
--	[2215] = Storage.AnnihilatorDone,
--	[2016] = Storage.DreamersChallenge.Reward,
--	[10544] = Storage.PitsOfInferno.WeaponReward
}

local questRewards = {
    -- === ROOKGAARD ===
    [52169] = { {itemId = 2651, count = 1} }, -- Coat
    [52170] = { {itemId = 2382, count = 1} }, -- Club
    [52171] = { {itemId = 2120, count = 1} }, -- Rope
    -- [52148] Removed - Bear Room Key moved to 20003
    [52149] = { {itemId = 2149, count = 1} }, -- Small Emerald
    [52159] = { {itemId = 2159, count = 1} }, -- Scarab Coin
    [2050] = { {itemId = 2050, count = 1} }, -- Sewer Torch Quest
    [2103] = { {itemId = 2103, count = 1} }, -- Tome / Book
    [2384] = { {itemId = 2384, count = 1} }, -- Rapier Quest
    [2395] = { {itemId = 2395, count = 1} }, -- Carlin Sword Quest
    [2404] = { {itemId = 2404, count = 1} }, -- Combat Knife
    [2412] = { {itemId = 2412, count = 1} }, -- Katana Quest
    [2460] = { {itemId = 2460, count = 1} }, -- Brass Helmet
    [2464] = { {itemId = 2464, count = 1} }, -- Chain Armor
    [2473] = { {itemId = 2473, count = 1} }, -- Viking Helmet Quest
    [2580] = { {itemId = 2580, count = 1} }, -- Fishing Rod
    [2676] = { {itemId = 2676, count = 1} }, -- Banana
    [20001] = { {itemId = 2467, count = 1} }, -- Leather Armor Quest / Doublet Room
    [20002] = { {itemId = 2088, count = 1, actionId = 4603} }, -- Key 4603
    [20003] = { {itemId = 2089, count = 1, actionId = 4601} }, -- Bear Room: Copper Key 4601 only
    [54322] = { {itemId = 1987, count = 1} }, -- Present Box (Rookgaard)

    -- === BEHEMOTH QUEST ===
    [10001] = { {itemId = 2520, count = 1} }, -- Demon Shield
    [10002] = { {itemId = 2466, count = 1} }, -- Golden Armor
    [10003] = { {itemId = 2427, count = 1} }, -- Guardian Halberd
    [10004] = { {itemId = 2171, count = 1} }, -- Platinum Amulet
    [2427] = { {itemId = 2427, count = 1} },  -- Fallback Guardian Halberd
    [2171] = { {itemId = 2171, count = 1} },  -- Fallback Platinum Amulet

    -- === DEMON HELMET QUEST ===
    [10005] = { {itemId = 2493, count = 1} }, -- Demon Helmet
    [10006] = { {itemId = 2520, count = 1} }, -- Demon Shield
    [10007] = { {itemId = 2645, count = 1} }, -- Steel Boots
    [2493] = { {itemId = 2493, count = 1} },  -- Fallback Demon Helmet
    [2645] = { {itemId = 2645, count = 1} },  -- Fallback Steel Boots

    -- === MAIN LAND: THAIS & KAZORDOON ===
    [10010] = { {itemId = 2497, count = 1} }, -- Crusader Helmet Quest
    
    -- === DESERT QUEST (10K) ===
    [10101] = { containerId = 1991, items = { {itemId = 2193, count = 1}, {itemId = 2214, count = 1}, {itemId = 2162, count = 1}, {itemId = 2200, count = 1} } }, -- Esquerda: Green Bag com Ankh, Ring of Healing, Magic Light Wand, Protection Amulet
    [10102] = { {itemId = 2152, count = 100} }, -- Direita: 100 Platinum Coins (10k gold)
    
    -- === ORC FORTRESS ===
    [10011] = { {itemId = 2392, count = 1} }, -- Fire Sword
    [10012] = { {itemId = 2476, count = 1} }, -- Knight Armor
    [10013] = { {itemId = 2430, count = 1} }, -- Knight Axe

    -- === ELVENBANE ===
    [10014] = { {itemId = 2394, count = 1} }, -- Morning Star (Elvenbane)

    -- === VAMPIRE SHIELD & DRAGON LANCE ===
    [10015] = { {itemId = 2534, count = 1} }, -- Vampire Shield
    [10026] = { {itemId = 2414, count = 1} }, -- Dragon Lance

    -- === BLACK KNIGHT TREE & REWARDS ===
    [10016] = { {itemId = 2088, count = 1, actionId = 5010} }, -- Key 5010 (original tree)
    [10065] = { {itemId = 2088, count = 1, actionId = 5010} }, -- Key 5010 (Black Knight quest tree) (Árvore)
    [10017] = { {itemId = 2519, count = 1} }, -- Crown Shield (Esquerda)
    [10019] = { {itemId = 2487, count = 1} }, -- Crown Armor (Direita)

    -- === FIRE AXE QUEST ===
    [10018] = { {itemId = 2432, count = 1} }, -- Fire Axe Quest Chest

    -- === GOLDEN ARMOR (WARLOCK) ===
    [2466] = { {itemId = 2466, count = 1} }, -- Fallback Golden Armor
    [2520] = { {itemId = 2520, count = 1} }, -- Fallback Demon Shield
    [10020] = { {itemId = 2466, count = 1} }, -- Golden Armor (Warlock)

    -- === BLOOD HERB ===
    [10021] = { {itemId = 2798, count = 1} }, -- Blood Herb

    -- === NOBLE ARMOR / CROWN HELMET (split chests; was combined on 10022) ===
    [10022] = { {itemId = 2486, count = 1} }, -- Noble Armor
    [10059] = { {itemId = 2491, count = 1} }, -- Crown Helmet

    -- === GRIFFIN SHIELD / OBSIDIAN LANCE (split; PR #122 wrongly reused 10030) ===
    [10023] = { {itemId = 2533, count = 1} }, -- Griffin Shield
    [10060] = { {itemId = 2425, count = 1} }, -- Obsidian Lance

    -- === MINTWALLIN CYCLOPS (from PR #122) ===
    [10029] = { {itemId = 2464, count = 1}, {itemId = 2458, count = 1}, {itemId = 2388, count = 1}, {itemId = 2145, count = 1} },

    -- === SMALL RUBY (PR used 10030 — reserved for post horn; use 10058) ===
    [10058] = { {itemId = 2147, count = 1} },

    -- === IRON HAMMER ===
    [10024] = { {itemId = 2393, count = 1} }, -- Iron Hammer

    -- === FAMILY BROOCH ===
    [10025] = { {itemId = 2318, count = 1} }, -- Family Brooch

    -- === MEDUSA SHIELD QUEST (DREFIA) ===
    [10026] = { {itemId = 2536, count = 1} }, -- Medusa Shield
    [10027] = { {itemId = 2436, count = 1} }, -- Skull Staff
    [10028] = { {itemId = 2520, count = 1} }, -- Demon Shield

    -- === BRIGHT SWORD ===
    [10047] = { {itemId = 2407, count = 1} }, -- Bright Sword
    [10048] = { {itemId = 2156, count = 1} }, -- Red Gem

    -- === HELMET OF THE ANCIENTS (HOTA; also baked via hota.yaml contents) ===
    [10040] = { {itemId = 2335, count = 1} }, -- Ashmunrah: Left Horn
    [10041] = { {itemId = 2336, count = 1} }, -- Dipthrah: Right Horn
    [10042] = { {itemId = 2337, count = 1} }, -- Mahrdis: Left Piece
    [10043] = { {itemId = 2338, count = 1} }, -- Morguthis: Right Piece
    [10044] = { {itemId = 2339, count = 1} }, -- Omruc: Left Eye
    [10045] = { {itemId = 2340, count = 1} }, -- Rahemos: Right Eye
    [10046] = { {itemId = 2341, count = 1} }, -- Thalas: Helmet Ornament

    -- === DEEPER FIBULA (baked in deeper_fibula.yaml) ===
    [10050] = { {itemId = 2528, count = 1} }, -- Tower Shield
    [10051] = { {itemId = 2430, count = 1} }, -- Knight Axe
    [10052] = { {itemId = 2475, count = 1} }, -- Warrior Helmet
    [10053] = { {itemId = 2213, count = 1} }, -- Dwarven Ring
    [10054] = { {itemId = 2197, count = 1} }, -- Elven Amulet / Stone Skin Amulet

    -- === MAD MAGE ===
    [10055] = { {itemId = 2323, count = 1} }, -- Hat of the Mad
    [10056] = { {itemId = 2197, count = 1} }, -- Stone Skin Amulet (7.4; não 3081)
    [10057] = { {itemId = 2131, count = 1} }, -- Star Amulet (7.4; não 3082)

    -- === BANSHEE QUEEN rewards (remapped off mainland 10020-10023) ===
    [10061] = { {itemId = 2195, count = 1} }, -- Boots of Haste
    [10062] = { {itemId = 2393, count = 1} }, -- Giant Sword
    [10063] = { {itemId = 2528, count = 1} }, -- Tower Shield
    [10064] = { {itemId = 2165, count = 1} }, -- Stealth Ring

    -- === POSTMAN / DJINN WAR ===
    [10030] = { {itemId = 2332, count = 1} }, -- Post Horn
    [10031] = { {itemId = 2344, count = 1}, {itemId = 2152, count = 6} }, -- Marid gemmed lamp + platinum
    [10032] = { {itemId = 2344, count = 1}, {itemId = 2152, count = 6} }, -- Efreet gemmed lamp + platinum

    -- === MISSING CHESTS DISCOVERED FROM AUDIT (Issue #82) ===
    [2103] = { {itemId = 2103, count = 1} }, -- Honey Flower
    [2395] = { {itemId = 2395, count = 1} }, -- Mace
    [2404] = { {itemId = 2404, count = 1} }, -- Combat Knife
    [2417] = { {itemId = 2417, count = 1} }, -- Battle Shield
    [2460] = { {itemId = 2460, count = 1} }, -- Brass Helmet
    [2464] = { {itemId = 2464, count = 1} }, -- Chain Armor
    [2521] = { {itemId = 2521, count = 1} }, -- Dark Shield
    [2580] = { {itemId = 2580, count = 1} }, -- Poison Arrows
    [2676] = { {itemId = 2676, count = 1} }, -- Banana
    -- [52148] Removed duplicate
    [52149] = { {itemId = 2149, count = 1} }, -- Small Emerald
    [52159] = { {itemId = 2159, count = 1} }, -- Scarab Coin
    [54322] = {} -- White Raven / Misc (Empty chest)
}


local questsExperience = {
--	[2217] = 1 -- dummy values
}

local questLog = {
--	[9130] = Storage.hiddenCityOfBeregar.DefaultStart
}

local tutorialIds = {
--	[50080] = 5,
--	[50082] = 6,
--	[50084] = 10,
--	[50086] = 11
}

local hotaQuest = {
--	12102, 12103, 12104, 12105, 12106, 12107
}

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
	local storage = specialQuests[item.actionid]
	if not storage then
		local uid = item:getAttribute(ITEM_ATTRIBUTE_UNIQUEID)
		if uid and uid > 0 then
			storage = uid
		elseif item.uid and item.uid > 0 and item.uid <= 65535 then
			storage = item.uid
		elseif item.actionid and item.actionid > 2000 and item.actionid <= 65535 then
			storage = item.actionid
		end
		if not storage or storage <= 0 then
			return false
		end
	end

	if player:getStorageValue(storage) > 0 or storage == 52148 then
		player:sendTextMessage(MESSAGE_INFO_DESCR, 'The ' .. ItemType(item.itemid):getName() .. ' is empty.')
		return true
	end

	local items, reward = {}
	local size = item:isContainer() and item:getSize() or 0
	
	local staticRewards = questRewards[storage]
	local containerId = (staticRewards and staticRewards.containerId) or nil
	if staticRewards then
		local rewardList = staticRewards.items or staticRewards
		for _, r in ipairs(rewardList) do
			local rewardItem = Game.createItem(r.itemId, r.count or 1)
			if rewardItem then
				if r.actionId then rewardItem:setAttribute(ITEM_ATTRIBUTE_ACTIONID, r.actionId) end
				items[#items + 1] = rewardItem
			end
		end
	elseif size == 0 then
		-- Fallback: If questRewards doesn't have it, but the storage ID matches a valid Item ID, give that item.
		if storage > 1000 and storage < 20000 and ItemType(storage):getId() ~= 0 then
			reward = Game.createItem(storage, 1)
		else
			-- Last resort: clone the chest itself (usually means questRewards is missing an entry for a special storage UID)
			reward = item:clone()
		end
	else
		local container = Container(item.uid)
		for i = 0, container:getSize() - 1 do
			items[#items + 1] = container:getItem(i):clone()
		end
	end

	size = #items
	if size == 1 then
		reward = items[1]
	end

	local result = ''
	if reward then
		local ret = ItemType(reward.itemid)
		if ret:isRune() then
			result = ret:getArticle() .. ' ' ..  ret:getName() .. ' (' .. reward.type .. ' charges)'
		elseif ret:isStackable() and reward:getCount() > 1 then
			result = reward:getCount() .. ' ' .. ret:getPluralName()
		elseif ret:getArticle() ~= '' then
			result = ret:getArticle() .. ' ' .. ret:getName()
		else
			result = ret:getName()
		end
	else
		if containerId then
			reward = Game.createItem(containerId, 1)
		elseif size > 20 then
			reward = Game.createItem(item.itemid, 1)
		elseif size > 8 then
			reward = Game.createItem(1988, 1)
		else
			reward = Game.createItem(1987, 1)
		end

		for i = 1, size do
			local tmp = items[i]
			if reward:addItemEx(tmp) ~= RETURNVALUE_NOERROR then
				print('[Warning] QuestSystem:', 'Could not add quest reward to container')
			end
		end
		local ret = ItemType(reward.itemid)
		result = ret:getArticle() .. ' ' .. ret:getName()
	end

	if player:addItemEx(reward) ~= RETURNVALUE_NOERROR then
		local weight = reward:getWeight()
		if player:getFreeCapacity() < weight then
			player:sendCancelMessage(string.format('You have found %s weighing %.2f oz. You have no capacity.', result, (weight / 100)))
		else
			player:sendCancelMessage('You have found ' .. result .. ', but you have no room to take it.')
		end
		return true
	end

	if questsExperience[storage] then
		player:addExperience(questsExperience[storage], true)
	end

	if questLog[storage] then
		player:setStorageValue(questLog[storage], 1)
	end

	if tutorialIds[storage] then
		player:sendTutorial(tutorialIds[storage])
		if item.uid == 50080 then
			player:setStorageValue(Storage.RookgaardTutorialIsland.SantiagoNpcGreetStorage, 3)
		end
	end

	if isInArray(hotaQuest, item.uid) then
		if player:getStorageValue(Storage.TheAncientTombs.DefaultStart) ~= 1 then
			player:setStorageValue(Storage.TheAncientTombs.DefaultStart, 1)
		end
	end

	player:sendTextMessage(MESSAGE_INFO_DESCR, 'You have found ' .. result .. '.')
	player:setStorageValue(storage, 1)
	return true
end


