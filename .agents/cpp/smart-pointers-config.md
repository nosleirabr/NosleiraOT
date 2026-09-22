# C++ Smart Pointers Configuration - OTClient Project
# Based on project_skillz.md standards

## Default Smart Pointer: std::unique_ptr
- Usage: `std::unique_ptr<Type>` por default
- Exception: `std::shared_ptr` apenas quando necessário (multiples owners)
- Raw pointers: Apenas em blocos de escopo limitado ou helper functions

## Memory Management Patterns
```
✅ CORRECT:
std::unique_ptr<Player> player = std::make_unique<Player>(id);
std::unique_ptr<Resource> res = std::make_unique<Resource>("id");
// Automatic cleanup via RAII

❌ EVITAR:
Player* player = new Player(); // Memory leak risk
Player* array = new Player[10]; // Use std::vector<std::unique_ptr<Player>> instead
```

## Concurrency Patterns
```
✅ CORRECT - std::scoped_lock (C++17):
std::scoped_lock lock(playersMtx, otherMtx); // Multiple mutexes safely

✅ CORRECT - std::lock_guard:
std::lock_guard<std::mutex> lock(playersMtx); // Single mutex, RAII

❌ EVITAR:
- Raw lock()/unlock() sem RAII
- volatile para sincronização (não é sync primitive)
- double-checked locking hand-rolled
```

## Pimpl Idiom (Already Applied)
- Application class uses `std::unique_ptr<ApplicationImpl> m_impl`
- Reduz dependencies em headers
- Melhora tempo de compilação
- Esconde implementação details