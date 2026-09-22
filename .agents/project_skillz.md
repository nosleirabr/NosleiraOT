# Project Skillz - Contexto da IA para OpenTibia/OTC

## Tecnologia Pilha
- **Linguagem:** C++17 (padrão do projeto)
- **Build:** CMake com vcpkg
- **Game Engine:** OpenTibia/OTC (Tibia server emulator)
- **Scripting:** Lua 5.1/5.3 (via init.lua)
- **Banco de Dados:** MySQL/Database integration
- **Arquitetura:** Server-side game logic, modules, protocol handling

## Padrões de Segurança OWASP (Critical para Game Servers)

### SQL Injection Prevention
- NUNCA usar string concatenation em queries SQL
- SEMPRE usar prepared statements / parameterized queries
- Validar todos os pacotes recebidos do cliente

**Anti-pattern (perigoso):**
```cpp
// DANGER - string concatenation
std::string query = "SELECT * FROM players WHERE id = " + playerInput;
```

**Pattern (seguro):**
```cpp
// CORRECT - parameterized query
PreparedStatement::prepare("SELECT * FROM players WHERE id = ?");
PreparedStatement::setInt(1, playerId);
```

### XSS Prevention (se houver interface web/admin)
- Output encoding em todas as transmissões para cliente
- Sanitizar dados vindo do cliente antes de broadcast
- Content Security Policy headers em endpoints HTTP

### CSRF Prevention
- Tokens em sessões HTTP/admin
- Validar origin de requests
- SameSite cookies rigorosos

### RCE Prevention
- Validar tamanho de pacotes recebidos
- Limitar tamanho máximo de mensagens
- Sanitizar todos os dados binários incoming

## Arquitetura do Projeto

### Camadas Identificadas
- **Module Layer:** `modules/` - módulos do servidor (auth, combat, map, etc.)
- **Protocol Layer:** Handshake, login, game packets
- **Database Layer:** Queries MySQL, connection pooling
- **Lua Interface:** Scripts `init.lua`, event handlers

### Dependency Rule
- Módulos internos não devem dependir de módulos externos
- Dependências devem apontar para centro (lógica de jogo)
- `src/` contém implementações concretas

## Otimização C++ (Game Server Performance)

### Smart Pointers Padrão
```cpp
// ✅ CORRECT - unique_ptr por default (ownership exclusiva)
std::unique_ptr<Player> player = std::make_unique<Player>(id);

// ✅ CORRECT - shared_ptr apenas quando necessário (múltiplos owners)
std::shared_ptr<Player> sharedPlayer = std::make_shared<Player>(id);

// ❌ EVITAR - raw pointers para heap allocation
Player* player = new Player(); // memory leak risk

// ✅ CORRECT - scoped_lock para seções críticas
std::scoped_lock lock(mtx); // C++17, evita deadlock com múltiplos mutexes

// ✅ CORRECT - named locks, evítar lock()/unlock() raw
std::mutex playersMtx;
std::lock_guard<std::mutex> lock(playersMtx); // RAII
```

### Concurrency Patterns
- **Evitar data races:** shared state must be protected
- **Prefer `std::scoped_lock`** over manual lock/unlock
- **Use `std::jthread`** ao invés de `std::thread` (C++20, auto-join)
- **Never call unknown code while holding a lock** (callback com lock segurado)
- **Minimize critical sections** - keep lock duration short

**Exemplo de thread safe:**
```cpp
std::shared_ptr<Player> getPlayer(uint32_t id) {
    std::lock_guard<std::mutex> lock(playerMapMtx);
    return playerMap[id]; // safe read
}
```

## Otimização Lua (Scripts do Servidor)

### Table Pre-allocation
- Usar `table.create(n)` antes de popular tabela grande
- Evitar rehash indesejado definindo tamanho inicial

**Anti-pattern:**
```lua
-- BAD - causa rehash a cada inserção
local t = {}
for i = 1, 100 do
    t[i] = i
end
```

**Pattern (otimizado):**
```lua
-- GOOD - pre-allocates, zero rehash
local t = table.create(100)
for i = 1, 100 do
    t[i] = i
end
```

### Remover Polling (Citizen.Wait/0 equivalents)
- Game servers: usar eventos ao invés de loops `while true do Wait(0)`
- Substituir polling por system events (player login, creature spawn, etc.)

**Anti-pattern (causa lag no servidor):**
```lua
-- BAD - runs 30-60x por segundo, sobrecarrega CPU
while true do
    Wait(0) -- ou Citizen.Wait(0) em FiveM
    -- check all players, distances, etc.
end
```

**Pattern (event-driven):**
```lua
-- GOOD - only runs when triggered
registerEvent("PlayerLogin", function(player)
    -- handle login logic
end)

registerEvent("CreatureSpawn", function(creature)
    -- handle spawn logic
end)
```

### Evitar Global Tables Desnecessárias
- Prefere tables locais escopo de função
- Use weak tables quando necessário para evitar memory leaks

## C++ Specific Patterns for This Project

### Memory Management
```cpp
// Resource manager pattern para texturas/models
class ResourceManager {
    std::map<std::string, std::unique_ptr<Resource>> resources;
    
    Resource& get(const std::string& id) {
        auto it = resources.find(id);
        if (it == resources.end()) {
            it = resources.emplace(id, std::make_unique<Resource>(id)).first;
        }
        return *it->second;
    }
};
```

### Header Inclusion
- Use forward declarations para reduzir dependências
- Pimpl idiom para esconder implementação details
- Minimize includes no header files

### Data-Oriented Design (para game entities)
- Structs de dados em vez de classes cheias de métodos
- Arrays of structs (AoS) vs Struct of Arrays (SoA) dependendo do caso
- Cache-friendly layouts para entidades no jogo

## Lua Script Conventions

### Funções que todo script deve ter
```lua
function onInit()
    -- Called when resource starts
end

function onThink(interval)
    -- Think loop with reasonable interval (não Use Wait(0)!)
end

function onReload()
    -- Called on server reload
end
```

### Table Structure Examples
```lua
-- Good: pre-defined structure
local playerData = {
    id = 0,
    name = "",
    level = 1,
    position = {x = 0, y = 0, z = 0},
    -- pre-allocated if known size
}

-- Bad: dynamic growth without pre-allocation
local playerData = {}
playerData[1] = "value1" -- triggers rehash
```

## UI/UX Minimalist (se houver client interface)

### Princípios Aplicáveis
- Feedback visual instantâneo no pointer-down (nunca wait click release)
- Manipulação direta 1:1 tracking para arrastar elementos
- Sem sombras pesadas - usar hairlines e borders sutis
- Cores restritas - hierarquia tipográfica rigorosa
- Whitespace generoso entre elementos

### Anti-patterns UI em game servers
- Evítar animações bloqueantes no think interval
- Sem `dangerouslySetInnerHTML` equivalent em templates Lua
- Feedback visual consistente em todos os estados (hover, press, disabled)

## Comandos Úteis para Este Projeto

```bash
# Build do projeto
cd clint 7.4 && mkdir build && cd build
cmake .. -DVCPKP_PATH=../vcpkg_installed
make -j$(nproc)

# Run
./otclient_gl ou ./otcv8-7.4

# Lint/checks (se houver)
clang-tidy src/*.cpp
cpplint --summary=total

# Testar Lua scripts
lua test.lua
-- ou
bin/lua some_script.lua
```

## Checklist de Code Review

### C++ Code
- [ ] Usa `std::unique_ptr` por default?
- [ ] Raw `new`/`delete` apenas quando absolutamente necessário?
- [ ] Mutexes sempre protegidos por RAII (`lock_guard`, `scoped_lock`)?
- [ ] Critical sections mínimas?
- [ ] `volatile` não usado para sincronização?

### Lua Scripts
- [ ] Tabelas grandes pre-allocated com `table.create()`?
- [ ] Sem polling `Wait(0)` em loops críticos?
- [ ] Event-driven architecture onde possível?
- [ ] Tabela sizes conhecidas antecipadamente?

### Security
- [ ] Input validation em todos os pacotes recebidos do cliente?
- [ ] SQL queries usando parâmetros (se houver DB)?
- [ ] Tamanho máximo de mensagens limitado?
- [ ] Dados do cliente sanitizados antes de broadcast?

### Architecture
- [ ] Módulos dependem de interfaces abstratas?
- [ ] Sem circular dependencies entre módulos?
- [ ] Lógica de jogo isolada de implementação de rede?