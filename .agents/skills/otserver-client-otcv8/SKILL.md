---
name: otserver-client-otcv8
description: >-
  OTClient / OTCv8 client & Lua scripting standards: C++17 memory management (std::unique_ptr, scoped_lock),
  Lua table pre-allocation (table.create) and event-driven patterns (avoiding polling),
  OWASP game server security rules, and minimalist UI/UX design patterns for OTClient modules.
  Use when developing, optimizing, or reviewing OTCv8 client modules, Lua UI scripts, and engine C++ code.
---

# OTServer Client & OTCv8 Standards

## When to use

- Working on OTCv8 client modules (`modules/`, `layouts/`, Lua scripts)
- Optimizing C++ engine code or Lua scripts for performance
- Implementing game UI/UX with minimalist design principles
- Applying security checks against game server exploits and packet manipulation

## C++17 Standards (OTC Engine / Client)

- **Smart Pointers:** Use `std::unique_ptr` by default for exclusive ownership. Use `std::shared_ptr` only when multiple owners are strictly required. Never use raw `new`/`delete`.
- **Concurrency:** Protect shared state with `std::scoped_lock` or `std::lock_guard` (RAII). Avoid raw `lock()`/`unlock()` or `volatile` for synchronization.
- **Header Inclusion:** Use forward declarations and minimize header includes.

## Lua Scripting Standards (OTC / Game Modules)

- **Table Pre-allocation:** Always use `table.create(n)` before populating large tables to prevent repeated rehashing.
  ```lua
  -- ✅ CORRECT - zero rehash
  local t = table.create(100)
  for i = 1, 100 do t[i] = i end
  ```
- **Event-Driven over Polling:** Never use `while true do Wait(0)` loops. Use system events and callbacks (`registerEvent`, `onThink` with reasonable intervals).
- **Garbage Collection:** Clean up tables and trigger `collectgarbage("collect")` on reload.

## OWASP Security for Game Servers

- **Packet Validation:** Validate all client packets and messages before processing (max size 65535 bytes, strict type and range checks).
- **SQL Injection Prevention:** Use parameterized queries and prepared statements exclusively. Never concatenate strings into SQL queries.
- **Data Sanitization:** Sanitize all incoming binary data and coordinate boundaries.

## Minimalist UI/UX Principles

- **Instant Feedback:** Visual response on `pointer-down` (never wait for click release).
- **Direct Manipulation:** 1:1 cursor tracking during drag operations without dead zones.
- **Restricted Palette & Surfaces:** Hairline borders (1px), generous whitespace, no heavy drop shadows.
- **Game HUD Elements:** Fixed positions, zero blocking animations on think loops.
