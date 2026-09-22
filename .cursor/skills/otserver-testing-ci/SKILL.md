---
name: otserver-testing-ci
description: >-
  OT Server testing and CI/CD standards: Lua unit tests, integration tests,
  test frameworks (LuaUnit/busted), GitHub Actions/GitLab CI configuration,
  test coverage thresholds and automation for stable 7.4 bases.
---

# OT Server Testing & CI

## When to use

- Writing or changing Lua scripts that contain game logic
- Adding new features that require regression testing
- Before merging significant changes via Pull Request
- When setting up automated testing pipelines for OT 7.4 server

## Test Standards

- **Lua Unit Tests:** Use LuaUnit or busted framework for structured tests
  ```lua
  local test = require "lunit"

  function test:testPlayerCreation()
      -- test logic here
      self:assertNotNil(player)
  end

  function test:testTeleport()
      -- coordinate validation
      self:assertEqual(newPos.x, 33333)
  end
  ```

- **Test Naming:** Use descriptive names (`test_<function>`, `test_<feature>`)
- **Arrange-Act-Assert:** Structure tests with clear sections
- **Test Isolation:** Each test should be independent (no shared state)

## CI/CD Integration

- **GitHub Actions:** Add `.github/workflows/ci.yml` to run tests on PR
  ```yaml
  name: OT Server CI

  on: [pull_request, push]

  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Run Lua tests
          run: |
            make test
            -- or: lua run_tests.lua
        - name: Upload coverage
          uses: actions/upload-artifact@v3
          with:
            name: coverage-report
            path: coverage/
    ```

- **Test Coverage:** Maintain minimum 80% coverage for core gameplay logic
- **Fast Feedback:** Unit tests should run in < 5 minutes
- **Integration Tests:** Run on merge to main branch only

## Testing Checklist

```
- [ ] New code has corresponding unit tests
- [ ] Tests cover happy path and error cases
- [ ] No test depends on shared global state without setup/teardown
- [ ] Tests run successfully locally before PR
- [ ] CI pipeline green before merge
- [ ] Edge cases tested (invalid inputs, boundary conditions)
- [ ] Performance tests for critical paths (if applicable)
```

## Common Test Patterns for OT 7.4

### Player Creation
```lua
function testPlayerHasCorrectInitValues()
    local player = Player("test_id")
    -- Verify default stats
    self:assertEqual(player:getLevel(), 1)
    self:assertEqual(player:getHealth(), 100)
end
```

### Teleport Validation
```lua
function testTeleportValidatesCoordinates()
    local func = function(newPos) return g_map:teleportThing(player, newPos) end
    -- Test out-of-bounds
    self:assertFalse(func({x = 999999, y = 999999, z = 0}))
end
```

### Item Use Validation
```lua
function testItemUseRequiresValidTarget()
    -- Test using sword on non-creature
    self:assertError(castSpell("exevo gran mas", player, npc))
end
```

## After Coding

- Run all related tests from `docs/TESTING.md` before PR
- If tests prove reusable finding, document in `docs/learnings/` only
- Update test data/fixtures if game balance changed