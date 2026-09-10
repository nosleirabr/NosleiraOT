# Defeitos conhecidos

Checklist de defeitos conhecidos/da comunidade + locais para corrigir um a um.

## Confirmados localmente

- [x] **D-007** Buracos, escadas e alçapões caindo no vazio no Z=15 corrigidos no mapa.
- [x] **D-008** NPCs com outfits desabilitados (144, 145) corrigidos para usar outfits válidos.
- [x] **D-009** Destino de viagem do barco fantasma (ghostShip) corrigido.

- [x] **D-001** Nomes de account devem ser numéricos para o client 7.4 (era `admin`).
- [x] **D-002** MyAAC cria nomes de account em string por padrão — incompatível com o protocolo 7.4.
- [x] **D-003** Towns MyAAC: mapeamento 7.4 + script `site/tools/fix_towns_database.sql` (Dawnport?Rookgaard).
- [x] **D-004** Realmap autêntico 7.4 (222222) carregado como `data/world/world.otbm` (65000×65000); mapa de teste removido. NPCs/quests ainda faltam (D-018/D-019).
- [x] **D-005** Rates base em 1x (`rateExp/Skill/Loot/Magic = 1` em `config.lua`).
- [x] **D-006** gitignore ignorava `data/` anteriormente (corrigido).

## Conhecidos da comunidade/OTLand para esta linhagem (a verificar)

- [x] **D-010** Mapas reais podem crashar/carregar errado com versão OTBM errada ou DB ausente (IOMap parser protegido contra crashs em itens não-existentes/versões inconsistentes).
- [x] **D-011** Divergências de Item ID quando RME items.otb != items do server (Verificado via SHA-256: Ambos RME 7.4/7.6 e Server usam exatamente o mesmo arquivo).
- [ ] **D-012** Áreas de mapa pós-7.4 (Port Hope, Tiquanda, Dark Cathedral) se usar mapas impuros.
- [x] **D-013** Client é shell 7.72 + assets 7.4 — possíveis quirks de sprite/UI.
- [ ] **D-014** Bed / UH trap / height stack historicamente precisaram de patches (UHTrap já habilitado).
- [x] **D-015** Tiles de teleport sem destination em mapas reais (Corrigido 100% via RME - 93 teleports sem destino arrumados).
- [x] **D-016** Bugs de diálogo/script de NPC em datasets mais completos.
- [x] **D-017** Portas/baús de quest com actionids/storage errados (correções em PRs de quests/mapas).
- [x] **D-018** **Comportamento** de NPC: travel + healers + cambistas feitos; shops migrados para Lua (~77 merchants, PR #110); 9 NPCs fantasma recriados (PR #111). Último stub `default.lua` (`A Strange Fellow`) substituído por script real com diálogos de lore 7.4. Zero stubs restantes. Shops 7.4 **não** vendem worms (`3976`); vara sem isca (`useWorms = false`). Veja [`docs/learnings/wiki/npc-shops-lua.md`](learnings/wiki/npc-shops-lua.md).
- [ ] **D-019** Quests: progresso grande na `main` (Djinn War, Postman, Orc King, Banshee seals, White Raven, Rookgaard NPCs, Medusa Shield, inject de baús, Annihilator via `inject_quests.lua`, PR #111). Paridade Miracle74 / uids OTBM / levers ainda incompletos — rode `.\tools\audit-quest-coverage.ps1`. Não copiar Lua 8.0 pelo aid. Catálogo: [`QUESTS_AND_FEATURES.md`](QUESTS_AND_FEATURES.md). Veja [`docs/learnings/wiki/quest-actionid-8-0-collision.md`](learnings/wiki/quest-actionid-8-0-collision.md).
- [ ] **D-020** Adiado: avaliar CipSoft 7.55 `map.bak` como fonte de merge para spawns/tiles (não substituição por atacado) — veja `docs/REALMAP_74.md`.

## Como capturar erros

- `docker compose logs -f tfs`
- Habilitar `warnUnsafeScripts`
- Validar no RME
- Scanners de mapa com script (veja `docs/TESTING.md`)

