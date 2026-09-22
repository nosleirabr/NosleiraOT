# Clean Architecture & DDD - OTClient Project
# Based on project_skillz.md standards

## Project Structure (4 Layers)

### 1. Domain Layer (Core) - Center
- Entities, Value Objects, Aggregates
- Domain Events
- **Rule**: Apenas tipos primitivos .NET (`int`, `string`, `Exception`)
- **No dependencies**: Nenhuma referência a infraestrutura

### 2. Application Layer - Around Domain
- Use Cases / Commands / Queries
- CQRS pattern: Comandos (write) vs Queries (read)
- Interfaces abstratas para infraestrutura
- **Regra**: Apenas depende do Domínio

### 3. Infrastructure Layer - External Concerns
- Implementações concretas
- Entity Framework DbContext
- Repository implementations
- External services (email, file system, APIs)
- **Regra**: Dependem de Domínio e Aplicação

### 4. API/Presentation Layer - Entry Point
- Minimal API Endpoints
- Controllers (se houver)
- Dependency Injection wiring
- **Regra**: Apenas referencia Aplicação (via DI)

## Dependency Rule
```
Domain → Nenhuma dependência
Application → Domain apenas
Infrastructure → Domain + Application  
API → Apenas Application
```

## Module Organization (OTClient Specific)
```
modules/          → game_actionbar, game_battle, game_console, etc.
corelib/          → globals, table, math, string, net
framework/        → core, graphics, net, luaengine, ui
src/              → main, client, framework modules
```

## Checklist de Code Review
- [ ] Módulos dependem de interfaces abstratas?
- [ ] Sem circular dependencies entre módulos?
- [ ] Lógica de jogo isolada de implementação de rede?
- [ ] Dependency Inversion Principle aplicado?
- [ ] Aggregates e Entities bem definidos?
- [ ] Repositórios seguem padrão Repository Pattern?