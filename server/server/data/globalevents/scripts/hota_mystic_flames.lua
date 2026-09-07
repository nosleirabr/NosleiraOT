-- HOTA access: convert teleports (1387) next to coal basins into mystic flames (1397)
-- and remember destinations for scarab coin sacrifice (hota_scarab_coin.lua).
-- Not part of inject_quests — no chest/uid mutation.
HotaTeleportDests = HotaTeleportDests or {}

local function convertBasinTeleports()
	local startX, endX = 33000, 33400
	local startY, endY = 32500, 33050
	local zLevels = {9, 10, 11, 12, 13, 14, 15}
	local basins = {1484, 1485}
	local converted = 0

	for _, z in ipairs(zLevels) do
		for x = startX, endX do
			for y = startY, endY do
				local tile = Tile(Position(x, y, z))
				if tile then
					local hasBasin = false
					for _, basinId in ipairs(basins) do
						if tile:getItemById(basinId) then
							hasBasin = true
							break
						end
					end

					if hasBasin then
						for dx = -1, 1 do
							for dy = -1, 1 do
								local adjTile = Tile(Position(x + dx, y + dy, z))
								if adjTile then
									local tpItem = adjTile:getItemById(1387)
									if tpItem and tpItem:isTeleport() then
										local dest = tpItem:getDestination()
										if dest then
											local posKey = (x + dx) .. "_" .. (y + dy) .. "_" .. z
											HotaTeleportDests[posKey] = dest
											tpItem:transform(1397)
											converted = converted + 1
										end
									end
								end
							end
						end
					end
				end
			end
		end
	end

	print(">> [HOTA] Converted " .. converted .. " basin teleports into mystic flames.")
end

function onStartup()
	convertBasinTeleports()
end
