# Quest injectors (removed)

Runtime injection is **disabled**. Quests are baked into `maps/build/world.otbm` via
`maps/src/quests/*.yaml` + `otmap build --from-source`.

`inject_quests` stays commented in `globalevents.xml`. Do not re-enable.

The former `quest_injectors/*.lua` and `inject_quests.lua` were deleted after
map contracts (`Levers_have_actionid_or_uniqueid`, quest bake) went green.
Historical copies live in git history. Prefer editing the YAML sources.
