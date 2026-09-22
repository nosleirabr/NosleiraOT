---
name: otserver-skillhandler
description: >-
  Lida com adição, remoção e gerenciamento de skills e experience no OT Server 7.4.
  Use para comandos .addskill, treinadores NPC e sistemas de progression.
---

# OT Server Skill Handler

## Quando usar

- Commands `.addskill` via talkaction
- NPCs treinadores de skills
- Sistemas de progression e level-up
- Modificar experince/skill rates

## Checklist

```
- [ ] Usar player:addSkillTries(SKILL_*, tenta) para skills
- [ ] Usar player:addExperience(exp) para exp
- [ ] Validar level antes de adicionar (niver máximo?)
- [ ] Aplicar config rate RATE_SKILL e RATE_XP
- [ ] Retornar mensagem de feedback ao player
- [ ] Usar repo-relative paths (sem C:\Users...)
```

## Padrões do Projeto

### IDs de Skill (SKILL_*)

```lua
-- Use as constantes definidas em data/lib/core/player.lua / game.lua
SKILL_FIST, SKILL_SWORD, SKILL_AXE, SKILL_CLUB
SKILL_DISTANCE, SKILL_SHIELD, SKILL_FISHING, SKILL_MAGLEVEL
```

### Adicionar Tries (recomendado)

```lua
player:addSkillTries(SKILL_SWORD, 50) -- soma 50 tries em Sword
```

### Adicionar Experience

```lua
local lvl = player:getLevel()
local expNeeded = ((50 * lvl * lvl * lvl) - (150 * lvl * lvl) + (400 * lvl)) / 3
player:addExperience(expNeeded, true)
```

### Comando Talkaction (.addskill)

Use `data/talkactions/scripts/add_skill.lua` como referência:
- Formato: `add <nome_player>, <skill>, <quantidade>`
- Ex: `add Admin sword 100`

## IDs (ItemIds, Storage, etc.)

- Estender ItemIds em `server/server/data/lib/core/constants.lua`
- Comments em português em blocks não óbvios
- Early return / inverted if para evitar aninhamentos profundos

## After coding

- Testar commands manualmente no servidor
- Se finding reutilizável provado, usar `otserver-learnings-ingest` em `docs/learnings/`