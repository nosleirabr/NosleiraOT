---
name: otserver-talkactions
description: >-
  Padrões para criar e modificar talkactions no OT Server 7.4. Comandos .addskill,
  .say, interagir com NPCs e sysmessages padronizadas.
---

# OT Server Talkactions

## Quando usar

- Criar novo comando de chat (.addskill, .curar, etc.)
- NPCs com respostas via chat
- Sysmessages e cancelmessages padronizados
- Validar parâmetros de entrada

## Checklist

```
- [ ] Validar permission player (getAccess/getAccountType)
- [ ] Verificar parâmetros obrigatórios antes de processar
- [ ] Usar player:sendCancelMessage() para erros
- [ ] Formato param: "valor1,valor2,valor3"
- [ ] Trim left em segundoário param: split[2]:gsub("^%s*(.-)$", "%1")
- [ ] Usar repo-relative paths em scripts novos
- [ ] Aplicar otserver-74-fidelity para mudanças de gameplay
```

## Padrão de Comando (.addskill exemplo)

### Formato

```
add <nome_jogador>, <skill>, <quantidade>
```

Exemplos:
- `add Admin sword 100` - adiciona 100 tries em Sword
- `add Bob club 50` - adiciona 50 tries em Club
- `add Alice dist 200` - adiciona 200 tries em Distance

### Estrutura do Script (data/talkactions/scripts/add_skill.lua)

```lua
function onSay(player, words, param)
    -- 1. Verificar acesso (God only)
    if not player:getGroup():getAccess() then
        return true
    end
    
    -- 2. Verificar account type
    if player:getAccountType() < ACCOUNT_TYPE_GOD then
        return false
    end
    
    -- 3. Split parâmetros
    local split = param:split(",")
    if split[2] == nil then
        player:sendCancelMessage("Insufficient parameters.")
        return false
    end
    
    -- 4. Target player
    local target = Player(split[1])
    if target == nil then
        player:sendCancelMessage("Player not online.")
        return false
    end
    
    -- 5. Trim e parse count
    split[2] = split[2]:gsub("^%s*(.-)$", "%1")
    local count = tonumber(split[3]) or 1
    
    -- 6. Processar (skill ou exp)
    local ch = split[2]:sub(1, 1)
    for i = 1, count do
        if ch == "l" or ch == "e" then
            -- Level up lógica
        elseif ch == "m" then
            -- Mana lógica
        else
            -- Skill tries
            local skillId = getSkillId(split[2])
            target:addSkillTries(skillId, ...)
        end
    end
    return false
end
```

### Função helper getSkillId

```lua
local function getSkillId(skillName)
    if skillName == "club" then return SKILL_CLUB
    elseif skillName == "sword" then return SKILL_SWORD
    elseif skillName == "axe" then return SKILL_AXE
    elseif skillName:sub(1, 4) == "dist" then return SKILL_DISTANCE
    elseif skillName:sub(1, 6) == "shield" then return SKILL_SHIELD
    elseif skillName:sub(1, 4) == "fish" then return SKILL_FISHING
    else return SKILL_FIST end
end
```

## Mensagens Padrão

- `player:sendCancelMessage("msg")` - errors/feedback
- `player:sendTextMessage(MESSAGE_STATUS_WARNING, "msg")` - warnings
- Sempre retornar `false` no final para evitar processamento adicional

## After coding

- Testar command no cliente: `.addskill Admin sword 10`
- Verificar se skills foram adicionadas com `player:getSkillLevel(SKILL_SWORD)`
- Aprendizado reutilizável → `otserver-learnings-ingest`