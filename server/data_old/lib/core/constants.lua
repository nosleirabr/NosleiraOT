CONTAINER_POSITION = 0xFFFF

-- Canonical item IDs for datapack scripts (Tibia 7.4 / this fork's items.xml).
-- Prefer ItemIds.* over magic numbers. Extend groups here — do not create parallel ID files.
-- Names follow common TibiaWiki / items.xml labels; verify id against items.xml before adding.
ItemIds = {
	ARMORS = {
		CROWN_ARMOR = 2487, -- crown armor
		MAGIC_PLATE_ARMOR = 2472, -- magic plate armor
		DRAGON_SCALE_MAIL = 2492, -- dragon scale mail
	},
	HELMETS = {
		CROWN_HELMET = 2491, -- crown helmet
		DEVIL_HELMET = 2462, -- devil helmet
		WARRIOR_HELMET = 2475, -- warrior helmet
	},
	LEGS = {
		CROWN_LEGS = 2488, -- crown legs
		PLATE_LEGS = 2647, -- plate legs
	},
	BOOTS = {
		SOFT_BOOTS = 2640, -- pair of soft boots
		STEEL_BOOTS = 2645, -- steel boots
	},
	SHIELDS = {
		CROWN_SHIELD = 2519, -- crown shield
		MASTERMIND_SHIELD = 2514, -- mastermind shield
		DEMON_SHIELD = 2520, -- demon shield
	},
	WEAPONS = {
		FIRE_SWORD = 2392, -- fire sword
		GIANT_SWORD = 2393, -- giant sword
	},
	RINGS = {
		TIME_RING = 2169, -- time ring
		ENERGY_RING = 2167, -- energy ring
		LIFE_RING = 2168, -- life ring
	},
	AMULETS = {
		AMULET_OF_LOSS = 2173, -- amulet of loss
		STRANGE_TALISMAN = 2161, -- strange talisman
	},
	RUNES = {
		SUDDEN_DEATH = 2268, -- sudden death rune (items.xml: spell rune)
		ULTIMATE_HEALING = 2273, -- ultimate healing rune (items.xml: spell rune)
		GREAT_FIREBALL = 2304, -- great fireball rune (items.xml: spell rune)
		DESTROY_FIELD = 2261, -- destroy field rune (items.xml: spell rune)
	},
	CONTAINERS = {
		BAG = 1987, -- bag
		BACKPACK = 1988, -- backpack
	},
}
