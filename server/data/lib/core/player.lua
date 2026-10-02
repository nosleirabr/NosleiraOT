local foodCondition = Condition(CONDITION_REGENERATION, CONDITIONID_DEFAULT)

function Player.feed(self, food)
	local condition = self:getCondition(CONDITION_REGENERATION, CONDITIONID_DEFAULT)
	if condition then
		condition:setTicks(condition:getTicks() + (food * 1000))
	else
		local vocation = self:getVocation()
		if not vocation then
			return nil
		end

		foodCondition:setTicks(food * 1000)
		foodCondition:setParameter(CONDITION_PARAM_HEALTHGAIN, vocation:getHealthGainAmount())
		foodCondition:setParameter(CONDITION_PARAM_HEALTHTICKS, vocation:getHealthGainTicks() * 1000)
		foodCondition:setParameter(CONDITION_PARAM_MANAGAIN, vocation:getManaGainAmount())
		foodCondition:setParameter(CONDITION_PARAM_MANATICKS, vocation:getManaGainTicks() * 1000)

		self:addCondition(foodCondition)
	end
	return true
end

function Player.getClosestFreePosition(self, position, extended)
	if self:getAccountType() >= ACCOUNT_TYPE_GOD then
		return position
	end
	return Creature.getClosestFreePosition(self, position, extended)
end

function Player.getDepotItems(self, depotId)
	return self:getDepotChest(depotId, true):getItemHoldingCount()
end

local lossPercent = {
	[0] = 100,
	[1] = 70,
	[2] = 45,
	[3] = 25,
	[4] = 10,
	[5] = 0
}

function Player.getLossPercent(self)
	local blessings = 0
	for i = 1, 5 do
		if self:hasBlessing(i) then
			blessings = blessings + 1
		end
	end
	return lossPercent[blessings]
end

function Player.isPremium(self)
	return self:getPremiumDays() > 0 or configManager.getBoolean(configKeys.FREE_PREMIUM)
end

local function isPremiumTown(town)
	if not town then
		return false
	end
	local townId = town:getId()
	-- Cidades com ID >= 7 (Darashia, Ankrahmun, Edron, etc.) são Premium
	if townId >= 7 then
		return true
	end
	local name = town:getName():lower()
	local premiumTownNames = {
		["darashia"] = true,
		["ankrahmun"] = true,
		["edron"] = true,
		["port hope"] = true,
		["cormaya"] = true,
		["liberty bay"] = true
	}
	return premiumTownNames[name] or false
end

local function isPremiumPosition(pos)
	if not pos then
		return false
	end
	local x, y = pos.x, pos.y

	-- Edron e Cormaya
	if (x >= 33000 and x <= 33450) and (y >= 31500 and y <= 32100) then
		return true
	end
	-- Continente de Darama (Darashia e Ankrahmun)
	if (x >= 33000 and x <= 33450) and (y >= 32101 and y <= 33000) then
		return true
	end
	-- Tiquanda (Port Hope)
	if (x >= 32500 and x <= 33100) and (y >= 32500 and y <= 33100) then
		return true
	end
	-- Outras ilhas Premium (Eremo, Shattered Isles, etc.)
	if (x >= 31800 and x <= 32500) and (y >= 32700 and y <= 33100) then
		return true
	end

	return false
end

-- Teleporta o jogador sem PA para o Templo de Thais se estiver em área ou cidade Premium
function Player.checkPremiumEviction(self)
	if self:isPremium() then
		return false
	end

	local currentTown = self:getTown()
	local currentPos = self:getPosition()

	local inPremTown = isPremiumTown(currentTown)
	local inPremPos = isPremiumPosition(currentPos)

	if inPremTown or inPremPos then
		local thaisTown = Town("Thais") or Town(2)
		if thaisTown then
			if inPremTown then
				self:setTown(thaisTown)
			end
			local templePos = thaisTown:getTemplePosition()
			if templePos then
				self:teleportTo(templePos)
				templePos:sendMagicEffect(CONST_ME_TELEPORT)
				self:sendTextMessage(MESSAGE_STATUS_WARNING, "Sua Premium Account expirou. Você foi teleportado para o Templo de Thais.")
				return true
			end
		end
	end

	return false
end

function Player.sendCancelMessage(self, message)
	if type(message) == "number" then
		message = Game.getReturnMessage(message)
	end
	return self:sendTextMessage(MESSAGE_STATUS_SMALL, message)
end

function Player.isUsingOtClient(self)
	return self:getClient().os >= CLIENTOS_OTCLIENT_LINUX
end

function Player.sendExtendedOpcode(self, opcode, buffer)
	if not self:isUsingOtClient() then
		return false
	end

	local networkMessage = NetworkMessage()
	networkMessage:addByte(0x32)
	networkMessage:addByte(opcode)
	networkMessage:addString(buffer)
	networkMessage:sendToPlayer(self)
	networkMessage:delete()
	return true
end

APPLY_SKILL_MULTIPLIER = true
local addSkillTriesFunc = Player.addSkillTries
function Player.addSkillTries(...)
	APPLY_SKILL_MULTIPLIER = false
	local ret = addSkillTriesFunc(...)
	APPLY_SKILL_MULTIPLIER = true
	return ret
end

local addManaSpentFunc = Player.addManaSpent
function Player.addManaSpent(...)
	APPLY_SKILL_MULTIPLIER = false
	local ret = addManaSpentFunc(...)
	APPLY_SKILL_MULTIPLIER = true
	return ret
end

function Player.depositMoney(self, amount)
	if not self:removeMoney(amount) then
		return false
	end
	self:setBankBalance(self:getBankBalance() + amount)
	return true
end

function Player.withdrawMoney(self, amount)
	local balance = self:getBankBalance()
	if amount > balance or not self:addMoney(amount) then
		return false
	end
	self:setBankBalance(balance - amount)
	return true
end

-- Bank transfer to online or offline characters (balance column).
function Player.transferMoneyTo(self, target, amount)
	local balance = self:getBankBalance()
	if amount <= 0 or amount > balance then
		return false
	end

	if self:getName():lower() == target:lower() then
		return false
	end

	local targetPlayer = Player(target)
	if targetPlayer then
		targetPlayer:setBankBalance(targetPlayer:getBankBalance() + amount)
	else
		local resultId = db.storeQuery("SELECT `name` FROM `players` WHERE `name` = " .. db.escapeString(target))
		if not resultId then
			return false
		end
		local realName = result.getString(resultId, "name")
		result.free(resultId)
		db.query("UPDATE `players` SET `balance` = `balance` + " .. amount .. " WHERE `name` = " .. db.escapeString(realName))
	end

	self:setBankBalance(balance - amount)
	return true
end

-- Salva os modos de combate em tempo real no banco de dados para consulta no site
function Player.saveCombatModes(self)
	local fightMode = self:getFightMode()
	local chaseMode = self:getChaseMode()
	local safeMode = self:isSafeFight() and 1 or 0
	db.query(string.format("UPDATE `players` SET `fight_mode` = %d, `chase_mode` = %d, `safe_mode` = %d WHERE `id` = %d", fightMode, chaseMode, safeMode, self:getGuid()))
end
