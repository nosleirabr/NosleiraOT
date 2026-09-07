# Real map 7.4 — escolha, lacunas e plano de conteúdo

## Mapa escolhido (agora)

**Opção 1 — 222222 TibiCAM autêntico 7.4**

- Local: `maps/world.otbm` (+ `world-spawn.xml`, `world-house.xml`) + `maps/vendor/` (cache de arquivo)
- **Download (não está no Git):** [OTLand thread 270466](https://otland.net/threads/7-4-authentic-real-map-extracted-from-tibicam-files.270466/) — anexo `Tibia 7.4 Real Map - by 222222.zip`
- Inclui: tiles, layout da era de borders, houses, **posições** de monster/NPC, textos no mapa
- **Não** inclui: scripts de NPC, scripts de quest, fórmulas da engine

O server carrega os mesmos nomes de arquivo de `server/server/data/world/` (`mapName = "world"`). **Edite só em `maps/`.** Docker faz bind-mount de `maps/world.*`; sem Docker use `.\tools\deploy-maps.ps1` / `Open-RME.bat`. Não faça commit das cópias de runtime.

## Opção adiada (futuro)

**Opção 2 — Setores binários CipSoft 7.55 (`map.bak`)**

- Thread: https://otland.net/threads/cipsoft-binary-sector-converter-tool-tibia-7-5-real-map.303803/
- Tool: https://github.com/danilopucci/cipsoft-binary-sector-converter
- Era: **7.55**, não 7.4 puro (Banuta ausente, POI WIP, Liberty Bay incompleto, etc.)
- Formato: CipSoft `.sec` → precisa de pipeline de conversão antes de OTBM/TFS 1.2

**Como podemos usar depois (não agora):**

| Uso | Por quê |
|-----|-----|
| Referência de tiles / borders / coastlines | Cruzar autenticidade vs 222222 |
| Merge de layouts de creature spawn | Onde a cobertura TibiCAM era fraca |
| Extrair daily items / tile flags | Atributos precisos CipSoft |
| Sanity checks de geometria de salas de quest | Comparar salas contra o leak |

**Não** substitua o mapa 7.4 por atacado por 7.55 sem decisão explícita de era. Prefira merge seletivo depois que ambos estiverem em formato comparável.

Também acompanhe: **Lazarus Project** (7.4 preciso CipSoft, não público na data da pesquisa).

---

## NPCs, scripts e quests — como fazemos

O mapa só posiciona NPCs/monsters. O comportamento vive em `server/server/data/`.

### Estado atual deste datapack

- **Phase 0 feita:** 309 XMLs stub para cada NPC único no spawn → `script="default.lua"` (hi/bye)
- Looks em geral copiados do pack irmão `otserver800` (só nomes); **nenhuma** Lua 8.0 de shop/travel/quest importada
- Regenerador: `tools/generate-npc-stubs.ps1`
- 6 placeholders fora do spawn mantidos: `Alice`, `Deruno`, `Eryn`, `Riona`, `The Forgotten King`, `Tyoric`
- `The Oracle` é stub no momento (`The Oracle.lua` antigo de Rhyves mantido para rewrite da Phase 1)
- `quests.xml`: 6 mission quests (veja [`QUESTS_AND_FEATURES.md`](QUESTS_AND_FEATURES.md))
- Sistema genérico de baú (`actionid` 2000/2001), portas, tools
- ~100+ XMLs de monster já presentes (boa base para nomes de spawn)


### Progresso de shops Phase 2 / Phase 3 (2026-08-23)

- **Phase 2:** `tools/apply-phase2-shops.ps1` - merchants centrais das cidades (Rook/Thais/Carlin/Ab'Dendriel/Kazordoon/Venore/Darashia) via `module_shop` + `shop_buyable`/`shop_sellable` + `|PLAYERNAME|`; bankers extras (Ishebad, Yberius, ...) para `bank.lua`; temple healers (Maealil, Padreia, ...) para `healer.lua`.
- **Phase 3:** `tools/apply-phase3-shops.ps1` - mais merchants stub (Cornelia, Gamel, McRonalds, jewelry, food, tools, ...); magic sellers para `runes.lua`; mais temple healers (Amanda, Hyacinth, ...).
- NPCs de quest intencionalmente deixados em `default.lua`. Sem cópia em massa de Lua do otserver800.

### Pipeline (ordem recomendada)

```
1. Map load smoke     → OTBM 0.5.0 + matching items.otb loads without fatal item IDs
2. Spawn coverage     → every <monster name> in world-spawn.xml has monster XML
3. NPC stubs          → DONE (generate-npc-stubs.ps1)
4. Travel / banks     → boat captains, depot, temples (blocks playability)  ← next
5. Core shops         → tools, runes, food, equipment by city
6. Quests by area     → Rook → Thais → Carlin → … (one storage map at a time)
7. Action/unique IDs  → scan OTBM for aids/uids; wire movements/actions
8. Optional 7.55 merge→ only where evidence beats TibiCAM
```

### NPCs

1. Extrair nomes únicos de `world-spawn.xml` (`<npc name="...">`).
2. Para cada nome faltando, adicionar `server/server/data/npc/<Name>.xml` apontando para um script.
3. Scripts em `npc/scripts/` — começar com módulos compartilhados (travel, trade, bless) e depois keywords por NPC.
4. Fontes de diálogo/outfit (prioridade):
   - TibiaWiki / arquivo de tibia.com (filtrado por era)
   - Transcrições de NPC do leak CipSoft 7.7 (cortar conteúdo pós-7.4)
   - Lua do irmão `otserver800` **só** como esqueleto TFS (remover Port Hope / Liberty Bay / Svargrond / VoiceModule / Storage moderno)
5. Validar com learning `npc-script-validation` + `docker compose logs -f tfs`.

XML de NPC ausente ⇒ aviso de spawn / NPC invisível — o mapa jogável vira cidades vazias.

### Whitelist Phase 1 (próximo — comportamento, não dump)

Porte **um NPC por vez** de 8.0/Wiki; corte para destinos/itens 7.4:

| Prioridade | Exemplos |
|----------|----------|
| Oracle | `The Oracle` → towns/vocations do mainland (não Rhyves) |
| Boats | `Captain Bluebear`, `Captain Greyhound`, outros captains na lista de spawn |
| Carpet | `Uzon` (e outros carpet NPCs no spawn) |
| Banks / temples | bankers das cidades + temple healers no spawn |
| Starter shops | `Al Dee` (Rook) depois shops de tool/food/rune de Thais/Carlin |

**Não** copie em massa `otserver800/server/data/npc/scripts`.

### Monsters

1. Diff dos nomes de monster no spawn vs `monster/monsters.xml`.
2. Adicionar XMLs faltantes; preferir loot/exp 7.4 (Wiki + cams), não dumps modernos de TFS.
3. Opção 2 (7.55) é fonte forte depois para densidade de spawn e nomes CipSoft.

### Quests / scripts

| Camada | O quê | Onde |
|-------|------|--------|
| Map | portas, baús, levers, teleports com action/unique IDs | OTBM |
| Actions | use chest/lever/tool | `data/actions/` |
| Movements | step tiles, level doors | `data/movements/` |
| Storage | progresso de quest | `storages` / scripts de NPC |
| Quests list | UI / tracking (opcional) | `quests.xml` |

Catálogo de quests (99 nomes Miracle74, divisão mission vs chest): [`QUESTS_AND_FEATURES.md`](QUESTS_AND_FEATURES.md). Pesquisa de fontes do datapack: [`QUEST_SOURCES.md`](QUEST_SOURCES.md).

Abordagem prática:

1. Rodar scanners (`docs/TESTING.md`): teleports `0,0,0`, aids sem handlers, monsters/NPCs faltando.
2. Implementar sistemas **genéricos** primeiro (quest doors, chests, rope/shovel spots).
3. Portar quests famosas uma a uma (Demon Helmet, Annihilator, Postman, …) usando Wiki + cams antigos — não scripts OT modernos com itens pós-7.4.
4. Manter um registro de storage IDs (evitar colisões) — acompanhar em `docs/KNOWN_DEFECTS.md` / futuro `docs/STORAGE_MAP.md`.

Nota do autor 222222: um datapack mais completo com ~83% dos aids/uids de quest foi prometido, mas nunca publicado de forma confiável junto com o mapa. Assuma que construímos os scripts nós mesmos.

### Gate de integração (quando trocar o world)

Só quando:

- [ ] OTBM carrega neste build TFS 1.2
- [ ] Towns/temples definidos para MyAAC
- [ ] NPCs críticos de travel funcionam (boats / oracle / acesso a depot)
- [ ] Backup de spawn mantido; RME não usado para “salvar de novo” spawns às cegas
- [ ] D-004 atualizado com evidência

Até lá: manter `maps/realmap-74/` como cópia de staging.
