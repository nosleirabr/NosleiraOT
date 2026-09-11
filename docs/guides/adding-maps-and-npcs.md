# Guia: Adicionar Mapas e NPCs

Como adicionar ou modificar conteúdo de mapa (OTBM) e NPCs no datapack 7.4.

---

## Índice

1. [Estrutura de arquivos](#estrutura-de-arquivos)
2. [Editar o mapa (OTBM)](#editar-o-mapa-otbm)
3. [Adicionar um NPC](#adicionar-um-npc)
4. [Adicionar um item de quest (baú/lever)](#adicionar-um-item-de-quest-baúlever)
5. [Adicionar um spawn de monstro](#adicionar-um-spawn-de-monstro)
6. [Restrições de fidelidade 7.4](#restrições-de-fidelidade-74)
7. [Testes](#testes)

---

## Estrutura de arquivos

```
server/server/data/
├── world/
│   └── world.otbm         ← mapa principal (gerado pelo RME)
├── npc/
│   ├── scripts/           ← scripts Lua dos NPCs
│   └── NPCName.xml        ← definição do NPC (aparência, scripts)
├── monster/
│   └── MonsterName.xml    ← definição de monstros
└── lib/
    └── core/
        └── constants.lua  ← IDs compartilhados (ItemIds, StorageKeys, etc.)
```

---

## Editar o mapa (OTBM)

### Ferramenta

Use o **Remere's Map Editor (RME)** com o OTB do TFS 1.2 / 7.4.

> Dica: o RME está em `tools/map-editor/`. Veja [`tools/README.md`](../../tools/README.md) se existir.

### Passos

1. Abra `server/server/data/world/world.otbm` no RME
2. Faça as edições (tiles, itens, unique IDs, action IDs)
3. Salve e feche o RME
4. Valide com o script de auditoria (se disponível):
   ```bash
   # Exemplo — veja docs/TESTING.md para o comando correto
   pwsh tools/audit-quest-coverage.ps1
   ```

### Unique IDs e Action IDs

Ao colocar itens especiais no mapa:

- **Unique ID (UID):** identifica um item único no mundo (ex: um baú específico de quest)
- **Action ID (AID):** associa o item a um script de ação

> **Atenção:** AIDs de 8.x podem colidir com AIDs 7.4. Consulte [`docs/MAP_DATAPACK_FIX_PLAN.md`](../MAP_DATAPACK_FIX_PLAN.md) antes de atribuir novos AIDs.

---

## Adicionar um NPC

### 1. Criar o arquivo XML do NPC

Crie `server/server/data/npc/NomeDoNPC.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<npc name="Nome do NPC" script="scripts/nome_do_npc.lua"
     walkinterval="2000" floorchange="0">
  <health now="100" max="100"/>
  <look type="128" head="58" body="113" legs="39" feet="115" addons="0"/>
  <parameters>
    <parameter key="message_greet" value="Saudações, |PLAYERNAME|!"/>
  </parameters>
</npc>
```

> **Look type:** consulte `items.xml` ou uma referência de sprites 7.4 para o ID correto.

### 2. Criar o script Lua do NPC

Crie `server/server/data/npc/scripts/nome_do_npc.lua`:

```lua
-- Script do NPC Nome do NPC
-- Segue o padrão de shopModule ou talkModule do TFS 1.2

local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

-- Registra os eventos padrão do NPC
npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)
npcHandler:addModule(FocusModule:new())
npcHandler:addModule(CloseModule:new())

-- Respostas básicas
local function onGreet(cid)
    npcHandler:say("Bem-vindo, " .. Player(cid):getName() .. "!", cid)
    return true
end

npcHandler:setCallback(CALLBACK_GREET, onGreet)
npcHandler:init()
```

### 3. Posicionar o NPC no mapa

No RME: clique com botão direito no tile → **Place NPC** → selecione `NomeDoNPC`.

Ou adicione manualmente no arquivo de spawns/mapa.

---

## Adicionar um item de quest (baú/lever)

### 1. Registrar o Action ID em constants.lua

```lua
-- server/server/data/lib/core/constants.lua
ActionIds = ActionIds or {}
ActionIds.QUESTS = ActionIds.QUESTS or {}

-- Baú da Missão Exemplo (AID único, não conflita com 8.0)
ActionIds.QUESTS.BAU_MISSAO_EXEMPLO = 5100
```

### 2. Criar o script de ação

Crie ou estenda `server/server/data/actions/scripts/quests/missao_exemplo.lua`:

```lua
-- Baú da Missão Exemplo
-- AID: 5100 | UID: definido no mapa via RME
local storageKey = 54321 -- chave de storage da missão exemplo

local function onUse(player, item, fromPosition, target, toPosition, isHotkey)
    -- retorna se jogador já coletou
    if player:getStorageValue(storageKey) >= 1 then
        player:sendTextMessage(MESSAGE_INFO_DESCR, "O baú está vazio.")
        return true
    end

    -- entrega o item e marca o storage
    player:addItem(2160, 1) -- 2160 = platinum coin (exemplo)
    player:setStorageValue(storageKey, 1)
    player:sendTextMessage(MESSAGE_INFO_DESCR, "Você encontrou um tesouro!")
    return true
end

return {
    onUse = onUse
}
```

### 3. Registrar em actions.xml

```xml
<action actionid="5100" script="quests/missao_exemplo.lua"/>
```

---

## Adicionar um spawn de monstro

No RME: **Map** → **Edit Spawns** → clique no tile → adicione o monstro com raio e intervalo.

Ou edite diretamente o arquivo de spawns (se separado do OTBM):

```xml
<spawn centerx="100" centery="200" centerz="7" radius="3">
  <monster name="Troll" x="101" y="200" z="7" spawntime="60"/>
</spawn>
```

> Use apenas criaturas da era 7.4. Consulte [`docs/QUESTS_AND_FEATURES.md`](../QUESTS_AND_FEATURES.md) para a lista.

---

## Restrições de fidelidade 7.4

- Não adicione criaturas inexistentes no Tibia 7.4
- Não use features de mapa de versões posteriores (ex: rotação de itens 8.x)
- AIDs acima de 8000 podem colidir com o datapack 8.0 herdado — consulte [`docs/MAP_DATAPACK_FIX_PLAN.md`](../MAP_DATAPACK_FIX_PLAN.md)
- StorageKeys devem ser únicos; registre em `constants.lua`

---

## Testes

Após adicionar conteúdo, valide:

```bash
# Sobe o servidor com o novo conteúdo
docker compose up -d --build

# Verifica logs de erro
docker compose logs tfs | grep -iE "error|warning|lua"

# Teste no jogo: logue, vá ao local, use o item/NPC
```

Para quests, crie um script de teste L3 (ver [`docs/TESTING.md`](../TESTING.md)).
