-- Rookgaard Levers: Bear Room, Katana Quest, and decorative levers (from PR #121).
local config = {
	[50001] = { -- Bear Room Lever
		leverPos = {Position(32098, 32204, 8), Position(32104, 32204, 8)},
		stonePos = Position(32101, 32204, 8),
		stoneId = 1355,
		timeToReset = 2 * 60 * 1000 -- 2 minutes
	},
	[52412] = { -- Katana Quest Bridge/Wall Lever (Rookgaard)
		leverPos = {Position(32182, 32145, 11)},
		stonePos = Position(32185, 32145, 11),
		stoneId = 1355,
		timeToReset = 2 * 60 * 1000
	},
	-- Decorative (aid wired; flips sprite + message only) — from PR #121 / #37
	[52413] = { decorative = true },
	[50004] = { decorative = true },
	[50005] = { decorative = true },
	[50006] = { decorative = true },
	[50007] = { decorative = true },
	[50008] = { decorative = true }
}

local function resetLever(pos, stonePos, stoneId)
	local tile = Tile(pos)
	if tile then
		local lever = tile:getItemById(1946)
		if lever then
			lever:transform(1945)
		end
	end

	if stonePos and stoneId then
		local stoneTile = Tile(stonePos)
		if stoneTile and not stoneTile:getItemById(stoneId) then
			Game.createItem(stoneId, 1, stonePos)
		end
	end
end

function onUse(player, item, fromPosition, target, toPosition, isHotkey)
	-- Porta level/quest: trata e sai antes das alavancas de Rookgaard
	local doorRet = handleDoorExecution(player, item, fromPosition, target, toPosition)
	if doorRet ~= nil then
		return doorRet
	end

	local quest = config[item.actionid]
	if not quest then
		return false
	end

	if item.itemid == 1945 then
		if quest.decorative then
			item:transform(1946)
			player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You hear a mechanism moving in the distance.")
			addEvent(resetLever, 2 * 60 * 1000, item:getPosition())
			return true
		end

		local stoneTile = Tile(quest.stonePos)
		if stoneTile then
			local stone = stoneTile:getItemById(quest.stoneId)
			if stone then
				stone:remove()
				item:transform(1946)
				player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "You hear a mechanism moving in the distance.")

				for _, pos in ipairs(quest.leverPos) do
					addEvent(resetLever, quest.timeToReset, pos, quest.stonePos, quest.stoneId)
				end
			else
				player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "The passage is already open.")
			end
		end
	elseif item.itemid == 1946 then
		player:sendTextMessage(MESSAGE_EVENT_ADVANCE, "The mechanism is already active.")
	end
	return true
end
