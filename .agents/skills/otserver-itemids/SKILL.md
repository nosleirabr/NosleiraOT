---
name: otserver-itemids
description: >-
  Padrões para IDs de Items no OT Server 7.4. Extender ItemIds shared groups,
  evitar hardcoding e manter consistência com items.xml e constants.lua.
---

# OT Server Item IDs

## Quando usar

- Criar novo item no datapack
- Referenciar items por ID em scripts Lua
- Organizar IDs em grupos (ARMORS, HELMETS, WEAPONS, etc.)
- Modificar ou adicionar novos items.xml

## Checklist

```
- [ ] Usar grupos compartilhados ItemIds (não IDs soltos)
- [ ] Comentar IDs em português (texto explicativo)
- [ ] Verificar item ID contra items.xml antes de adicionar
- [ ] Estender tabelas existentes ao invés de criar novas
- [ ] Caminhos repo-relative em docs/skills/examples
- [ ] Aplicar otserver-74-fidelity para mudanças de conteúdo
```

## Padrões de Item IDs

### Grupos Compartilhados

```lua
-- Em server/server/data/lib/core/constants.lua
ItemIds = {
    ARMORS = {
        CLOTH = 2468,
        STUDDED = 2470,
        WOOL = 2472,
        -- ... etc
        CROWN_ARMOR = 2487,
    },
    HELMETS = {
        CAP = 2637,
        -- ...
    },
    WEAPONS = {
        WOODEN_SWORD = 2482,
        -- ...
    }
}
```

### Uso em scripts

```lua
-- Preferido: grupo + comentário em português
if item:getId() == ItemIds.ARMORS.CROWN_ARMOR then
    -- lógica específica
end

-- Alternativa: local + comentário em português
local crownArmorId = 2487 -- armadura de coroa
if item:getId() == crownArmorId then
    -- lógica específica
end
```

### Itens novos

1. Verificar ID máximo em items.xml
2. Adicionar em constants.lua no grupo apropriado
3. Comentar o ID com o nome em português
4. Usar `local variable = ID -- description` para uso único

## After coding

- Verificar se item aparece corretamente no cliente
- Se mudança de ID, atualizar todos os references
- Aprendizado reutilizável → `otserver-learnings-ingest`