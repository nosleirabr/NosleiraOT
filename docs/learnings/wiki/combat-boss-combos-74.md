# Combat & Boss Combos (Tibia 7.4)

## Scope
Defines the historical context and technical configuration of monster combos (melee + spell in the same tick) in the Tibia 7.4 engine, specifically regarding bosses like Orshabaal.

## Confirmed facts
- In Tibia 7.4 (2004), the combat engine strictly operated on a universal 2000ms (2 seconds) turn interval for both players and monsters.
- Monsters did not have modern "exhausts" or "cooldowns" separating different attack types.
- A monster could roll the chance to execute a spell, and if triggered, that spell would execute in the exact same millisecond as their physical melee attack.
- This simultaneous overlapping of damage is what created the notorious "hitkill combos", making bosses like Orshabaal legendary (e.g., hitting 1200 melee + 900 energy beam = 2100 instant damage).
- This was an engine-wide mechanic for all monsters (a Dragon could combo melee + fire wave), but it only resulted in lethal combos on Bosses due to their high max damage formulas.
- Cooldowns and spell groups for players and explicit monster stagger delays were not officially introduced until much later (the major Cooldown update was 8.70 in Dec 2010).

## How to detect
A modern or "casual" configuration would stagger these spells using differing interval timers (e.g. interval="3000" or adding exhaust flags) to prevent hitkills. The authentic 7.4 configuration intentionally keeps `interval="2000"` on both melee and spell attacks so they can trigger simultaneously.

## How to fix
We **DO NOT** fix this. Maintaining the lack of exhaust and the 2000ms overlapping turn is critical to preserving the authentic, hardcore 7.4 nostalgia. The user validated and confirmed that this is a desired feature, not a bug, for this project.

## Validation technique
Check boss XML files (e.g., `data/monster/bosses/orshabaal.xml`). Melee attacks and heavy spells (like energy beam or fire) should all share the `interval="2000"` attribute with accurate chance percentages.

## Risks
Players unused to classic mechanics may complain about "unfair" hitkills. This is an accepted risk of the 7.4 hardcore vision.

## Sources
- Discussion and user approval regarding 7.4 authenticity (Orshabaal damage tuning and engine mechanics).
- Historical Tibia changelogs (Update 8.70 for cooldowns).
