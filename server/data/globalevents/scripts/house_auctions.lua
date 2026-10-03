local function processHouseAuctions()
	-- Fetch houses with finished auctions
	local currentTime = os.time()
	local resultId = db.storeQuery("SELECT `id`, `highest_bidder`, `bid`, `name` FROM `houses` WHERE `bid_end` > 0 AND `bid_end` < " .. currentTime)
	if resultId ~= false then
		repeat
			local houseId = result.getNumber(resultId, "id")
			local highestBidder = result.getNumber(resultId, "highest_bidder")
			local bid = result.getNumber(resultId, "bid")
			local houseName = result.getString(resultId, "name")
			
			local house = House(houseId)
			if house then
				local playerGuid = highestBidder
				if playerGuid > 0 then
					-- Check if player exists and has money
					local playerBalance = 0
					local res = db.storeQuery("SELECT `balance` FROM `players` WHERE `id` = " .. playerGuid)
					if res ~= false then
						playerBalance = result.getNumber(res, "balance")
						result.free(res)
					end
					
					if playerBalance >= bid then
						-- Deduct money
						db.query("UPDATE `players` SET `balance` = `balance` - " .. bid .. " WHERE `id` = " .. playerGuid)
						db.query('UPDATE houses SET paid = ' .. (os.time() + (30 * 24 * 60 * 60)) .. ' WHERE id = ' .. houseId)
						-- Set owner
						house:setOwnerGuid(playerGuid)
						print("> House Auction: " .. houseName .. " won by player guid " .. playerGuid .. " for " .. bid .. " gold.")
					else
						print("> House Auction: Player guid " .. playerGuid .. " did not have enough money for " .. houseName .. ". House remains free.")
					end
				end
				-- Reset bid status for this house in DB and memory
				db.query("UPDATE `houses` SET `bid` = 0, `bid_end` = 0, `last_bid` = 0, `highest_bidder` = 0 WHERE `id` = " .. houseId)
			end
		until not result.next(resultId)
		result.free(resultId)
	end
	return true
end

function onThink(interval)
	processHouseAuctions()
	return true
end

function onStartup()
	processHouseAuctions()
	return true
end
