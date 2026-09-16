-- Shared travel destinations for this 7.4 realmap (spawn-aligned).
-- Boat decks are on z=7 here (not z=6 like many 8.0 packs).
-- Landings: 1 SQM SW of captain (open deck), never on captain tile / railings.

TravelHarbours = {
	-- Boats (Royal Tibia Line / ferries)
	thais = Position(32311, 32211, 7),       -- Bluebear 32312,32210,7
	carlin = Position(32389, 31822, 7),      -- Greyhound 32390,31821,7
	abdendriel = Position(32733, 31669, 7),  -- Seagull 32734,31668,7
	venore = Position(32957, 32023, 7),      -- Fearless 32958,32022,7
	edron = Position(33177, 31765, 7),       -- Seahorse 33178,31764,7
	ankrahmun = Position(33091, 32885, 7),   -- Sinbeard 33092,32884,7
	darashia = Position(33290, 32482, 7),    -- Petros 33291,32481,7
	cormaya = Position(33287, 31957, 7),     -- Pemaret 33288,31956,7
	eremo = Position(33320, 31885, 7),       -- near Eremo 33322,31883,7
	-- Venore→Darashia ghost ship (Fearless only; classic ~10%)
	ghostShip = Position(33318, 32173, 6),   -- deck near Ghost/Ghoul/Skeleton spawns ~33322–33327,32177–32183
	-- Captain Jack (Ice Islands ferry)
	jackMainland = Position(32186, 31961, 7), -- Jack 32187,31960,7
	senja = Position(32192, 31660, 7),
	-- Carpets (floors differ by city)
	carpetFemor = Position(32536, 31837, 4),     -- near Uzon 32537,31836,4
	carpetDarashia = Position(33269, 32440, 6),  -- near Chemar 33270,32439,6
	carpetEdron = Position(33191, 31784, 3),     -- near Pino 33192,31783,3
	carpetKazordoon = Position(32588, 31941, 0), -- near Gewen 32588,31942,0 (mountain top)

	-- Steamship (z=15 underground; 7.4 has only Kazordoon <-> Cormaya)
	steamKazordoon = Position(32660, 31956, 15), -- near Brodrosch 32661,31957,15
	steamCormaya = Position(33312, 31988, 15)    -- near Gurbasch 33313,31989,15
}

-- Travel helper. premium=true (classic 7.4 boat/carpet).
-- Denial/success lines come from StdModule.travel (stock 7.4-era wording).
function addTravelKeyword(keywordHandler, npcHandler, keyword, cost, destination, label, travelMsg, action, discount)
	local travelKeyword = keywordHandler:addKeyword({keyword}, StdModule.say, {
		npcHandler = npcHandler,
		text = 'Do you seek a passage to ' .. label .. ' for ' .. cost .. ' gold?'
	})
	travelKeyword:addChildKeyword({'yes'}, StdModule.travel, {
		npcHandler = npcHandler,
		premium = true,
		cost = cost,
		destination = destination,
		msg = travelMsg,
		discount = discount
	}, nil, action)
	travelKeyword:addChildKeyword({'no'}, StdModule.say, {
		npcHandler = npcHandler,
		text = 'We would like to serve you some time.',
		reset = true
	})
end

