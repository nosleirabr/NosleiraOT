local combat = Combat()
combat:setParameter(COMBAT_PARAM_TYPE, COMBAT_PHYSICALDAMAGE)
combat:setParameter(COMBAT_PARAM_BLOCKARMOR, true)
combat:setParameter(COMBAT_PARAM_EFFECT, CONST_ME_HITAREA)

local area = createCombatArea(AREA_SQUARE1X1)
combat:setArea(area)

function onGetFormulaValues(player, level, maglevel)
	min = -(level * 2.2)
	max = -(level * 3.85)
	return min, max
end

combat:setCallback(CALLBACK_PARAM_LEVELMAGICVALUE, "onGetFormulaValues")

function onCastSpell(creature, var)
	local player = creature:getPlayer()
	if not player then
		return false
	end

	local reqMana = player:getLevel() * 4
	if player:getMana() < reqMana then
		player:sendCancelMessage(RETURNVALUE_NOTENOUGHMANA)
		player:getPosition():sendMagicEffect(CONST_ME_POFF)
		return false
	end

	-- check for stairHop delay (if pacified)
	if getCreatureCondition(creature, CONDITION_PACIFIED) then
		creature:sendCancelMessage(RETURNVALUE_YOUAREEXHAUSTED)
		creature:getPosition():sendMagicEffect(CONST_ME_POFF)
		return false
	end

	-- Deduct mana and add mana spent for ML advancement
	player:addMana(-reqMana)
	player:addManaSpent(reqMana)
	
	return combat:execute(creature, var)
end
