local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

local vocation = {}
local town = {}

-- Town ids from towns.xml
local towns = {
	['thais'] = 2,
	['kazordoon'] = 3,
	['carlin'] = 4,
	['ab\'dendriel'] = 5,
	['venore'] = 6,
	['darashia'] = 7,
	['ankrahmun'] = 8,
	['edron'] = 9
}

-- 7.4 starter kits
local vocations = {
	['sorcerer'] = {
		text = 'A SORCERER! ARE YOU SURE? THIS DECISION IS IRREVERSIBLE!',
		id = 1,
		items = {{2190, 1}, {1988, 1}, {2120, 1}, {2554, 1}}
	},
	['druid'] = {
		text = 'A DRUID! ARE YOU SURE? THIS DECISION IS IRREVERSIBLE!',
		id = 2,
		items = {{2182, 1}, {1988, 1}, {2120, 1}, {2554, 1}}
	},
	['paladin'] = {
		text = 'A PALADIN! ARE YOU SURE? THIS DECISION IS IRREVERSIBLE!',
		id = 3,
		items = {{2389, 5}, {1988, 1}, {2120, 1}, {2554, 1}}
	},
	['knight'] = {
		text = 'A KNIGHT! ARE YOU SURE? THIS DECISION IS IRREVERSIBLE!',
		id = 4,
		items = {{2383, 1}, {1988, 1}, {2120, 1}, {2554, 1}}
	}
}

function onCreatureAppear(cid)              npcHandler:onCreatureAppear(cid)            end
function onCreatureDisappear(cid)           npcHandler:onCreatureDisappear(cid)         end
function onCreatureSay(cid, type, msg)      npcHandler:onCreatureSay(cid, type, msg)    end
function onThink()                          npcHandler:onThink()                        end

local function greetCallback(cid)
	local player = Player(cid)
	local level = player:getLevel()
	if level < 8 then
		npcHandler:say('CHILD! COME BACK WHEN YOU HAVE GROWN UP!', cid)
		return false
	elseif level > 9 then
		npcHandler:say(player:getName() .. ', I CAN\'T LET YOU LEAVE - YOU ARE TOO STRONG ALREADY! YOU CAN ONLY LEAVE WITH LEVEL 9 OR LOWER.', cid)
		return false
	elseif player:getVocation():getId() > 0 then
		npcHandler:say('YOU ALREADY HAVE A VOCATION!', cid)
		return false
	end
	npcHandler:setMessage(MESSAGE_GREET, player:getName() .. ', ARE YOU PREPARED TO FACE YOUR DESTINY?')
	return true
end

local function creatureSayCallback(cid, type, msg)
	if not npcHandler:isFocused(cid) then
		return false
	end

	local player = Player(cid)
	
	-- Fix for topic not being initialized to 0
	local topic = npcHandler.topic[cid]
	if not topic then topic = 0 end

	if topic == 0 then
		if msgcontains(msg, 'yes') then
			npcHandler:say('IN WHICH TOWN DO YOU WANT TO LIVE: {THAIS}, {CARLIN}, {VENORE}, {KAZORDOON}, {AB\'DENDRIEL}, {DARASHIA}, {ANKRAHMUN}, OR {EDRON}?', cid)
			npcHandler.topic[cid] = 1
		end
	elseif topic == 1 then
		local townId = towns[msg:lower()]
		if townId then
			town[cid] = townId
			npcHandler:say('IN ' .. string.upper(msg) .. '! AND WHAT PROFESSION HAVE YOU CHOSEN: {KNIGHT}, {PALADIN}, {SORCERER}, OR {DRUID}?', cid)
			npcHandler.topic[cid] = 2
		else
			npcHandler:say('IN WHICH TOWN DO YOU WANT TO LIVE: {THAIS}, {CARLIN}, {VENORE}, {KAZORDOON}, {AB\'DENDRIEL}, {DARASHIA}, {ANKRAHMUN}, OR {EDRON}?', cid)
		end
	elseif topic == 2 then
		local vocationTable = vocations[msg:lower()]
		if vocationTable then
			npcHandler:say(vocationTable.text, cid)
			vocation[cid] = vocationTable.id
			npcHandler.topic[cid] = 3
		else
			npcHandler:say('{KNIGHT}, {PALADIN}, {SORCERER}, OR {DRUID}?', cid)
		end
	elseif topic == 3 then
		if msgcontains(msg, 'yes') then
			local chosen = nil
			for _, data in pairs(vocations) do
				if data.id == vocation[cid] then
					chosen = data
					break
				end
			end
			if not chosen then
				npcHandler:say('{KNIGHT}, {PALADIN}, {SORCERER}, OR {DRUID}?', cid)
				npcHandler.topic[cid] = 2
				return true
			end

			npcHandler:say('SO BE IT!', cid)
			player:setVocation(Vocation(chosen.id))
			
			-- Set default vocation outfit
			local outfit = player:getOutfit()
			if chosen.id == 1 or chosen.id == 2 then -- Sorcerer or Druid
				outfit.lookType = player:getSex() == PLAYERSEX_FEMALE and 138 or 130
			elseif chosen.id == 3 then -- Paladin
				outfit.lookType = player:getSex() == PLAYERSEX_FEMALE and 137 or 129
			elseif chosen.id == 4 then -- Knight
				outfit.lookType = player:getSex() == PLAYERSEX_FEMALE and 139 or 131
			end
			player:setOutfit(outfit)
			
			player:setTown(Town(town[cid]))
			for i = 1, #chosen.items do
				player:addItem(chosen.items[i][1], chosen.items[i][2])
			end

			local temple = Town(town[cid]):getTemplePosition()
			npcHandler:releaseFocus(cid)
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
			player:teleportTo(temple)
			player:getPosition():sendMagicEffect(CONST_ME_TELEPORT)
		else
			npcHandler:say('THEN WHAT? {KNIGHT}, {PALADIN}, {SORCERER}, OR {DRUID}?', cid)
			npcHandler.topic[cid] = 2
		end
	end
	return true
end

local function onAddFocus(cid)
	town[cid] = nil
	vocation[cid] = nil
end

local function onReleaseFocus(cid)
	town[cid] = nil
	vocation[cid] = nil
end

npcHandler:setCallback(CALLBACK_ONADDFOCUS, onAddFocus)
npcHandler:setCallback(CALLBACK_ONRELEASEFOCUS, onReleaseFocus)
npcHandler:setCallback(CALLBACK_GREET, greetCallback)
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:addModule(FocusModule:new())
