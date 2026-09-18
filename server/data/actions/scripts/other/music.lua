local instruments = {
	[2070] = CONST_ME_SOUND_WHITE, -- wooden flute
	[2071] = CONST_ME_SOUND_YELLOW, -- lyre
	[2072] = CONST_ME_SOUND_BLUE, -- lute
	[2073] = CONST_ME_SOUND_GREEN, -- drum
	[2074] = CONST_ME_SOUND_PURPLE, -- panpipes
	[2075] = CONST_ME_SOUND_RED, -- simple fanfare
	[2076] = CONST_ME_SOUND_RED, -- fanfare
	[2077] = CONST_ME_SOUND_RED, -- royal fanfare
	[2078] = CONST_ME_SOUND_RED, -- post horn
	[2079] = CONST_ME_SOUND_RED, -- war horn
	[2080] = CONST_ME_SOUND_WHITE, -- piano
	[2081] = CONST_ME_SOUND_WHITE, -- piano
	[2082] = CONST_ME_SOUND_WHITE, -- piano
	[2083] = CONST_ME_SOUND_WHITE, -- piano
	[2084] = CONST_ME_SOUND_YELLOW, -- harp
	[2085] = CONST_ME_SOUND_YELLOW, -- harp
	[2332] = CONST_ME_SOUND_RED, -- Waldo's post horn
	[2364] = CONST_ME_SOUND_RED, -- post horn
	[2367] = CONST_ME_SOUND_GREEN, -- drum
	[2368] = CONST_ME_SOUND_RED, -- simple fanfare
	[2370] = CONST_ME_SOUND_RED, -- fanfare
	[2371] = CONST_ME_SOUND_RED, -- royal fanfare
	[2372] = CONST_ME_SOUND_RED, -- royal fanfare
	[2373] = CONST_ME_SOUND_RED, -- royal fanfare
}

function onUse(player, item, fromPosition, target, toPosition)
	local soundEffect = instruments[item:getId()] or CONST_ME_SOUND_BLUE
	item:getPosition():sendMagicEffect(soundEffect)
	return true
end
