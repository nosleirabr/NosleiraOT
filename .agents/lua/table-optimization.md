# Lua Table Optimization - OTClient Project
# Based on project_skillz.md standards

## Table Pre-allocation Pattern
```
✅ CORRECT - table.create(n):
local t = table.create(100)  -- Pre-allocates 100 array slots
for i = 1, 100 do
    t[i] = i
end
-- Zero rehash, optimal performance

❌ EVITAR - causa rehash a cada inserção:
local t = {}
for i = 1, 100 do
    t[i] = i  -- Causes ~7 rehashes
end
```

## Memory Optimization
```
✅ CORRECT - table.size() para contar:
if table.size(t) > 0 then
    -- table has data
end

✅ CORRECT - Weak tables para evitar memory leaks:
local weakTable = setmetatable({}, {__mode = "k"})  -- keys are weak
-- Garbage collector will collect when no strong references
```

## Event-Driven Pattern (Replace Polling)
```
✅ CORRECT - Event handlers:
registerEvent("PlayerLogin", function(player)
    -- handle login, not loop
end)

❌ EVITAR - polling loops Wait(0):
while true do
    Wait(0)  -- 60x/s, sobrecarrega CPU
    -- check all players, distances, etc.
end
```

## Lua Script Conventions
```
function onInit()
    -- Called when resource starts
    -- Set up tables with table.create()
end

function onThink(interval)
    -- Reasonable interval, NÃO Use Wait(0)!
    Wait(1000)  -- 1 second interval
end

function onReload()
    -- Called on server reload
    -- Clean up tables, collect garbage
    collectgarbage("collect")
end
```