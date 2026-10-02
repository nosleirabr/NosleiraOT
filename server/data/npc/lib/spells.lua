-- System for 7.4 Authentic NPC Spell Learning
-- Standardized 7.4 Spell Tables by Vocation

local SPELLS_74 = {
    knight = {
        {name = "Find Person", words = "exiva", price = 80, level = 8, premium = false},
        {name = "Light", words = "utevo lux", price = 100, level = 8, premium = false},
        {name = "Magic Rope", words = "exani tera", price = 200, level = 9, premium = true},
        {name = "Antidote", words = "exana pox", price = 150, level = 10, premium = false},
        {name = "Levitate", words = "exani hur", price = 500, level = 12, premium = true},
        {name = "Great Light", words = "utevo gran lux", price = 500, level = 13, premium = false},
        {name = "Haste", words = "utani hur", price = 600, level = 14, premium = true},
        {name = "Challenge", words = "exeta res", price = 2000, level = 20, premium = true},
        {name = "Berserk", words = "exori", price = 2500, level = 35, premium = true}
    },
    paladin = {
        {name = "Find Person", words = "exiva", price = 80, level = 8, premium = false},
        {name = "Light", words = "utevo lux", price = 100, level = 8, premium = false},
        {name = "Light Healing", words = "exura", price = 170, level = 9, premium = false},
        {name = "Magic Rope", words = "exani tera", price = 200, level = 9, premium = true},
        {name = "Antidote", words = "exana pox", price = 150, level = 10, premium = false},
        {name = "Intense Healing", words = "exura gran", price = 350, level = 11, premium = false},
        {name = "Levitate", words = "exani hur", price = 500, level = 12, premium = true},
        {name = "Conjure Arrow", words = "exevo con", price = 450, level = 13, premium = false},
        {name = "Great Light", words = "utevo gran lux", price = 500, level = 13, premium = false},
        {name = "Haste", words = "utani hur", price = 600, level = 14, premium = true},
        {name = "Magic Shield", words = "utamo vita", price = 450, level = 14, premium = false},
        {name = "Conjure Poisoned Arrow", words = "exevo con pox", price = 500, level = 16, premium = false},
        {name = "Conjure Bolt", words = "exevo con mort", price = 750, level = 17, premium = true},
        {name = "Ultimate Healing", words = "exura vita", price = 1000, level = 20, premium = false},
        {name = "Conjure Explosive Arrow", words = "exevo con flam", price = 1000, level = 25, premium = true},
        {name = "Invisibility", words = "utana vid", price = 2000, level = 35, premium = true},
        {name = "Conjure Power Bolt", words = "exevo con vis", price = 2000, level = 59, premium = true}
    },
    sorcerer = {
        {name = "Find Person", words = "exiva", price = 80, level = 8, premium = false},
        {name = "Light", words = "utevo lux", price = 100, level = 8, premium = false},
        {name = "Light Healing", words = "exura", price = 170, level = 9, premium = false},
        {name = "Magic Rope", words = "exani tera", price = 200, level = 9, premium = true},
        {name = "Antidote", words = "exana pox", price = 150, level = 10, premium = false},
        {name = "Intense Healing", words = "exura gran", price = 350, level = 11, premium = false},
        {name = "Levitate", words = "exani hur", price = 500, level = 12, premium = true},
        {name = "Great Light", words = "utevo gran lux", price = 500, level = 13, premium = false},
        {name = "Haste", words = "utani hur", price = 600, level = 14, premium = true},
        {name = "Magic Shield", words = "utamo vita", price = 450, level = 14, premium = false},
        {name = "Energy Beam", words = "exevo vis lux", price = 1000, level = 18, premium = true},
        {name = "Fire Wave", words = "exevo flam hur", price = 800, level = 18, premium = true},
        {name = "Strong Haste", words = "utani gran hur", price = 1300, level = 20, premium = true},
        {name = "Ultimate Healing", words = "exura vita", price = 1000, level = 20, premium = false},
        {name = "Creature Illusion", words = "utevo res ina", price = 1000, level = 23, premium = false},
        {name = "Summon Creature", words = "utevo res", price = 2000, level = 25, premium = false},
        {name = "Cancel Invisibility", words = "exana ina", price = 1500, level = 26, premium = true},
        {name = "Ultimate Light", words = "utevo vis lux", price = 1600, level = 26, premium = true},
        {name = "Great Energy Beam", words = "exevo gran vis lux", price = 1800, level = 29, premium = true},
        {name = "Invisibility", words = "utana vid", price = 2000, level = 35, premium = true},
        {name = "Energy Wave", words = "exevo mort hur", price = 2500, level = 38, premium = true},
        {name = "Enchant Staff", words = "exeta vis", price = 2000, level = 41, premium = true},
        {name = "Ultimate Explosion", words = "exevo gran mas vis", price = 8000, level = 60, premium = true}
    },
    druid = {
        {name = "Find Person", words = "exiva", price = 80, level = 8, premium = false},
        {name = "Light", words = "utevo lux", price = 100, level = 8, premium = false},
        {name = "Light Healing", words = "exura", price = 170, level = 9, premium = false},
        {name = "Magic Rope", words = "exani tera", price = 200, level = 9, premium = true},
        {name = "Antidote", words = "exana pox", price = 150, level = 10, premium = false},
        {name = "Intense Healing", words = "exura gran", price = 350, level = 11, premium = false},
        {name = "Levitate", words = "exani hur", price = 500, level = 12, premium = true},
        {name = "Great Light", words = "utevo gran lux", price = 500, level = 13, premium = false},
        {name = "Haste", words = "utani hur", price = 600, level = 14, premium = true},
        {name = "Magic Shield", words = "utamo vita", price = 450, level = 14, premium = false},
        {name = "Heal Friend", words = "exura sio", price = 800, level = 18, premium = true},
        {name = "Strong Haste", words = "utani gran hur", price = 1300, level = 20, premium = true},
        {name = "Ultimate Healing", words = "exura vita", price = 1000, level = 20, premium = false},
        {name = "Creature Illusion", words = "utevo res ina", price = 1000, level = 23, premium = false},
        {name = "Summon Creature", words = "utevo res", price = 2000, level = 25, premium = false},
        {name = "Ultimate Light", words = "utevo vis lux", price = 1600, level = 26, premium = true},
        {name = "Undead Legion", words = "exana mas mort", price = 2000, level = 30, premium = true},
        {name = "Invisibility", words = "utana vid", price = 2000, level = 35, premium = true},
        {name = "Mass Healing", words = "exura gran mas res", price = 2200, level = 36, premium = true},
        {name = "Poison Storm", words = "exevo gran mas pox", price = 6000, level = 50, premium = true},
        {name = "Wild Growth", words = "exevo grav vita", price = 2000, level = 63, premium = true}
    }
}

function registerVocationSpells74(keywordHandler, npcHandler, vocationType)
    local list = SPELLS_74[vocationType:lower()]
    if not list then
        return
    end

    local spellNamesList = {}
    for _, sp in ipairs(list) do
        table.insert(spellNamesList, sp.name .. " (" .. sp.price .. " gp" .. (sp.premium and ", Premium" or "") .. ")")

        local params = {
            npcHandler = npcHandler,
            spellName = sp.name,
            price = sp.price,
            level = sp.level,
            premium = sp.premium
        }

        keywordHandler:addKeyword({sp.name:lower()}, StdModule.learnSpell, params)
        if sp.words then
            keywordHandler:addKeyword({sp.words:lower()}, StdModule.learnSpell, params)
        end
    end

    -- Palavra-chave "spells" ou "spell" para listar as magias disponíveis no NPC
    local listStr = "I can teach you the following spells: " .. table.concat(spellNamesList, ", ") .. "."
    keywordHandler:addKeyword({'spells'}, StdModule.say, {npcHandler = npcHandler, text = listStr})
    keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = listStr})
end
