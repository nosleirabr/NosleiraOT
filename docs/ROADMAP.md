# Roadmap ó OT Server 7.4 (base est·vel)

Tracker visual: [GitHub Project](https://github.com/users/matosnathan/projects/1)

Fluxo agentic (Ready -> In progress -> In review/Done via **Project Workflows**, branch `<id>-mN-summary`): [`docs/AGENTIC_KANBAN.md`](AGENTIC_KANBAN.md)

Este documento È a **fonte canÙnica de ordem de entrega**. Issues/milestones no GitHub espelham estes epics. Detalhe tÈcnico continua em `KNOWN_DEFECTS.md`, `REALMAP_74.md`, `QUESTS_AND_FEATURES.md` e `TESTING.md`.

---

## Objetivo norte

Entregar uma **vers„o est·vel de Tibia 7.4** o mais limpa e funcional possÌvel:

- conte˙do 7.4 implementado e **testado** (autom·tico + manual);
- server **est·vel e test·vel**;
- client **com cÛdigo-fonte** customiz·vel (ex.: login por **nome de account em string**, n„o sÛ n˙mero/`uint32`);
- repositÛrio serve de **projeto base** ó a partir dele nascem variantes com outras configs, mapas e regras;
- infra de nuvem **definida e reproduzÌvel** (Terraform/Terragrunt), com hardening, antibot e observabilidade (logs/traces).

**N„o È objetivo agora:** features modernas de OT (shop web, roulette, mounts, etc.).

**Icebox (futuro, approach indefinido):** gerador/validador de mapa OTBM ou substituiÁ„o do OTBM por outra representaÁ„o test·vel.

---

## Como ler prioridades

| SÌmbolo | Significado |
|---------|-------------|
| **P0** | Bloqueia jogabilidade ou release |
| **P1** | Paridade de conte˙do / qualidade necess·ria para ""base est·vel...ù |
| **P2** | Importante, mas pode seguir em paralelo ou apÛs o n˙cleo |
| **Icebox** | Desej·vel; n„o bloqueia a vers„o est·vel |

Cada **milestone** = fatia entreg·vel. Cada **epic** = grupo de issues no Project.

---

## Ordem de fechamento (prioridade)

Ordem alinhada ao [GitHub Project](https://github.com/users/matosnathan/projects/1) ó feche nesta sequÍncia; n„o pule P0 de M1 por itens mais ""interessantes...ù de milestones posteriores.

**Regra de aceitaÁ„o:** feature marcada **Done** no cÛdigo ainda precisa de story `[Manual QA]` antes do milestone fechar. **L3 automatizado ‚â† aceitaÁ„o.**

1. **M0 leftovers** ó fechar primeiro o que sobrou da fundaÁ„o *(hoje: Done)*.
2. **M1 (P0)** *(Done)* ó primeiro: NPCs fantasma ([#81](https://github.com/matosnathan/otserver/issues/81)), shops stubs ([#80](https://github.com/matosnathan/otserver/issues/80)), smoke ([#33](https://github.com/matosnathan/otserver/issues/33)), balanceamento combate ([#101](https://github.com/matosnathan/otserver/issues/101)), **Manual QA M1** ([#83](https://github.com/matosnathan/otserver/issues/83)...ì[#86](https://github.com/matosnathan/otserver/issues/86), combate [#109](https://github.com/matosnathan/otserver/issues/109)).
3. **M2 (P1)** ó em seguida: levers ([#37](https://github.com/matosnathan/otserver/issues/37)); ba˙s restantes (uma story por quest, [#82](https://github.com/matosnathan/otserver/issues/82)); stubs de NPC de quest ([#36](https://github.com/matosnathan/otserver/issues/36)); portas ([#38](https://github.com/matosnathan/otserver/issues/38)); **Manual QA M2** ([#87](https://github.com/matosnathan/otserver/issues/87), [#88](https://github.com/matosnathan/otserver/issues/88)). Mission quests j· foram quebradas em stories e est„o **Done** ([#66](https://github.com/matosnathan/otserver/issues/66)...ì[#79](https://github.com/matosnathan/otserver/issues/79)); umbrella [#35](https://github.com/matosnathan/otserver/issues/35) **Done**.
4. **M3 em paralelo (P1)** ó CI ([#39](https://github.com/matosnathan/otserver/issues/39)) pode comeÁar junto, mas **nunca** supera M1 P0.
5. **M4 / M5 / M6 / Icebox** ó permanecem Backlog **P2** atÈ o n˙cleo M1+M2 estar fechado.

---

## Vis„o da sequÍncia (ordem de entrega)

```
M0 FundaÁ„o          ‚îÄ‚îÄ‚ñ∫ j· em grande parte feito (stack + login numÈrico + realmap carregando)
        ‚îÇ
M1 Jogabilidade n˙cleo ‚îÄ‚îÄ‚ñ∫ travel, bancos, temples, shops, rates cl·ssicos
        ‚îÇ
M2 Conte˙do 7.4        ‚îÄ‚îÄ‚ñ∫ quests Miracle74, NPCs de quest, levers/aids (D-018/D-019)
        ‚îÇ
M3 Server test·vel     ‚îÄ‚îÄ‚ñ∫ CI verde, L1...ìL4 amplos, mitigaÁ„o de exploits, perfis de config
        ‚îÇ
M4 Client com fonte    ‚îÄ‚îÄ‚ñ∫ client open-source + accounts string + site/protocolo alinhados
        ‚îÇ
M5 Infra + seguranÁa   ‚îÄ‚îÄ‚ñ∫ definiÁ„o nuvem, Terragrunt/Terraform, hardening, antibot, logs/traces
        ‚îÇ
M6 Release base est·vel‚îÄ‚îÄ‚ñ∫ checklist, docs de fork, templates de variante
        ‚îÇ
Icebox Mapa            ‚îÄ‚îÄ‚ñ∫ gerador OTBM / alternativa (n„o bloqueia M6)
```

**Por que esta ordem**

1. Sem **M1**, o mapa real n„o È jog·vel de ponta a ponta (cidades mortas / sem barcos).
2. Sem **M2**, n„o h· paridade de conte˙do para chamar de ""7.4 completo...ù.
3. Sem **M3**, qualquer client novo ou fork custom herda um server fr·gil.
4. **M4** vem depois do n˙cleo est·vel: contas string **exigem** client com fonte; atÈ l· o protocolo cl·ssico continua numÈrico (`uint32`).
5. **M5** prepara produÁ„o: infra como cÛdigo, apps ""infra-ready...ù, proteÁ„o e rastreabilidade ó **antes** de declarar a base est·vel p˙blica.
6. **M6** empacota a base para gerar variantes (incluindo deploy repetÌvel).
7. Ferramenta de mapa fica no **icebox** porque o approach ainda n„o est· decidido.

**Paralelismo:** definiÁ„o de infra + healthchecks/logs estruturados podem comeÁar em paralelo com **M3/M4**; apply de produÁ„o e antibot fino dependem do stack j· jog·vel.

---

## M0 ó FundaÁ„o do stack *(quase concluÌdo)*

**Meta:** Docker + TFS 1.2 + MyAAC + MariaDB + client cl·ssico sobem; login 7.4 numÈrico funciona; realmap carrega; defects blockers documentados.

| Epic | Prioridade | Estado | Docs / evidÍncia |
|------|------------|--------|------------------|
| Stack Compose (mysql, tfs, myaac) | P0 | Feito | `docker/`, `docs/BOOTSTRAP.md` |
| Login account numÈrica (`uint32`) | P0 | Feito | D-001/D-002, learning login-numeric |
| Realmap 7.4 (222222) como `world` | P0 | Feito (mapa); conte˙do aberto | D-004, `REALMAP_74.md` |
| Teleports crÌticos / buracos Z | P0 | Parcial / v·rios fechados | D-007, D-015 |
| Bootstrap + learnings + skills | P1 | Feito | `README.md`, `AGENTS.md`, `docs/learnings/` |
| Suite de testes L1...ìL4 inicial | P1 | Em andamento | `TESTING.md` |

**CritÈrio de saÌda:** clone novo sobe com `docs/BOOTSTRAP.md`; admin loga; personagem entra no mundo.

---

## M1 ó Jogabilidade n˙cleo *(quase feito ó gaps de smoke/shops/fantasma)*

**Meta:** um jogador consegue Rook -> mainland -> viajar entre cidades, usar cambista/templo/shops sem quebrar fidelidade 7.4.

| Epic | Prioridade | Estado | Notas |
|------|------------|--------|-------|
| Travel (barcos, carpetes) | P0 | **Feito** | Scripts + `TravelContractTests` verdes |
| Oracle / vocaÁıes / towns | P0 | **Feito** | `The Oracle.lua` towns/kits 7.4 |
| Cambistas + temples/healers | P0 | **Feito** | `money_exchange` + `healer.lua` (sem banco virtual) |
| Worms / fishing 7.4 (sem `3976`) | P1 | **Feito** | [#31](https://github.com/matosnathan/otserver/issues/31) **Done** |
| Rates cl·ssicos 1x (perfil base) | P1 | **Feito** | `config.lua` rates = 1 |
| NPCs fantasma no spawn | P0 | **Feito** | [#81](https://github.com/matosnathan/otserver/issues/81) |
| Smoke manual + contratos L3 | P0 | Aberto | [#33](https://github.com/matosnathan/otserver/issues/33) ó L3 travel ok; L4 skip |
| Shops stubs (`default.lua`) | P0 | **Feito** | [#80](https://github.com/matosnathan/otserver/issues/80) |
| Balanceamento 7.4 (vocaÁıes/skills/combate) | P0 | **Feito** | Epic [#101](https://github.com/matosnathan/otserver/issues/101); pesquisa [#102](https://github.com/matosnathan/otserver/issues/102) Ready; configs/testes [#103](https://github.com/matosnathan/otserver/issues/103)...ì[#108](https://github.com/matosnathan/otserver/issues/108) Backlog atÈ matriz; Manual QA [#109](https://github.com/matosnathan/otserver/issues/109) |
| `[Manual QA] Travel ó barcos e carpetes` | P0 | Aberto | [#83](https://github.com/matosnathan/otserver/issues/83) |
| `[Manual QA] Cambistas ó convers„o de dinheiro` | P0 | Aberto | [#84](https://github.com/matosnathan/otserver/issues/84) |
| `[Manual QA] Oracle, temples e healers` | P0 | Aberto | [#85](https://github.com/matosnathan/otserver/issues/85) |
| `[Manual QA] ConversaÁ„o NPCs core` | P0 | Aberto | [#86](https://github.com/matosnathan/otserver/issues/86) |
| `[Manual QA] Combate 7.4` | P0 | Aberto | [#109](https://github.com/matosnathan/otserver/issues/109) |

**Restante M1:** [#81](https://github.com/matosnathan/otserver/issues/81), [#33](https://github.com/matosnathan/otserver/issues/33), [#80](https://github.com/matosnathan/otserver/issues/80), [#101](https://github.com/matosnathan/otserver/issues/101) + Manual QA [#83](https://github.com/matosnathan/otserver/issues/83)...ì[#86](https://github.com/matosnathan/otserver/issues/86)/[#109](https://github.com/matosnathan/otserver/issues/109).

### Manual QA (obrigatÛrio para fechar M1)

Features com cÛdigo **Done** ainda precisam de stories de **Manual QA** antes de considerar o milestone fechado.

**Regra:** L3 automatizado ‚â† aceitaÁ„o manual. Cada epic/quest Done deve ter issue(s) `[Manual QA]` linkada(s). Prioridade destas stories em M1: **P0** (bloqueiam o fechamento de M1). CanÙnico (n„o usar dups #89...ì#100):

- [#83](https://github.com/matosnathan/otserver/issues/83) Travel ó barcos e carpetes
- [#84](https://github.com/matosnathan/otserver/issues/84) Cambistas ó convers„o de dinheiro
- [#85](https://github.com/matosnathan/otserver/issues/85) Oracle, temples e healers
- [#86](https://github.com/matosnathan/otserver/issues/86) ConversaÁ„o NPCs core
- [#109](https://github.com/matosnathan/otserver/issues/109) Combate 7.4 ó vocaÁıes e skills

**CritÈrio de saÌda:** checklist smoke: criar char -> Rook -> Oracle -> Thais -> barco -> outra cidade -> depot/cambista -> comprar runas/food; **e** Manual QA P0 acima aceito (ou issues linkadas fechadas), incluindo combate [#109](https://github.com/matosnathan/otserver/issues/109).

---

## M2 ó Paridade de conte˙do 7.4

**Meta:** cat·logo Miracle74 (~99 quests) + comportamento de NPC de quest; levers/chests com uid/aid corretos no OTBM.

| Epic | Prioridade | Estado | Notas |
|------|------------|--------|-------|
| Mission quests (umbrella) | P0 | **Feito** | [#35](https://github.com/matosnathan/otserver/issues/35) **Done**; split por quest [#66](https://github.com/matosnathan/otserver/issues/66)...ì[#79](https://github.com/matosnathan/otserver/issues/79) **Done** |
| Ba˙s restantes (uma story por quest) | P1 | **Feito** | [#82](https://github.com/matosnathan/otserver/issues/82); D-019; auditoria |
| NPCs de quest (stubs -> scripts) | P1 | Aberto | [#36](https://github.com/matosnathan/otserver/issues/36); D-018 |
| Levers / actionids ligados a scripts | P1 | **Feito** | [#37](https://github.com/matosnathan/otserver/issues/37); invent·rio em `MAP_DATAPACK_FIX_PLAN.md` |
| Portas / storage / aids sem colis„o 8.0 | P1 | **Feito** | [#38](https://github.com/matosnathan/otserver/issues/38); learning `quest-actionid-8-0-collision` |
| Cobertura `audit-quest-coverage.ps1` | P1 | Em andamento | Meta: subir de 0/91; tracking via [#82](https://github.com/matosnathan/otserver/issues/82) |
| `[Manual QA] Mission quests (log 7.4)` | P1 | Aberto | [#87](https://github.com/matosnathan/otserver/issues/87) ó cÛdigo Done (#66...ì#79) |
| `[Manual QA] Quests injector (amostra)` | P1 | Aberto | [#88](https://github.com/matosnathan/otserver/issues/88) |

**Restante M2 (tracking):** [#82](https://github.com/matosnathan/otserver/issues/82) + [#36](https://github.com/matosnathan/otserver/issues/36) / [#37](https://github.com/matosnathan/otserver/issues/37) / [#38](https://github.com/matosnathan/otserver/issues/38) + Manual QA [#87](https://github.com/matosnathan/otserver/issues/87)/[#88](https://github.com/matosnathan/otserver/issues/88).

### Manual QA (M2)

Mesma regra de M1: cÛdigo Done n„o fecha o milestone sem aceitaÁ„o manual. L3 automatizado ‚â† Manual QA. Prioridade das stories `[Manual QA]` de M2: **P1**.

- [#87](https://github.com/matosnathan/otserver/issues/87) Mission quests (log 7.4)
- [#88](https://github.com/matosnathan/otserver/issues/88) Quests injector (amostra)

**CritÈrio de saÌda:** relatÛrio de cobertura de quests em nÌvel aceit·vel (definir % no milestone); quests ‚ncora jog·veis com teste L3/L4 onde couber; **e** Manual QA P1 acima aceito (ou issues linkadas).

---

## M3 ó Server est·vel e test·vel

**Meta:** o server da base È previsÌvel, com CI e contratos que protegem forks.

| Epic | Prioridade | Notas |
|------|------------|-------|
| CI obrigatÛrio L1+L2+L3 em PR | P0 | **Feito** | Linting endurecido |
| Ampliar L3 (quests, spawns, travel) | P0 | Novos branches => novos testes |
| L4 protocolo em pipeline opt-in/nightly | P1 | Stack Docker no CI |
| MitigaÁıes de dupe / exploits era 7.4 | P1 | `ITEM_DUPLICATION_BUGS.md` |
| PerfÌs de config (`base` vs variante) | P1 | **Feito** | Sem secrets; config.lua isolado |
| Defects comunidade (D-010...¶D-017) triagem | P2 | Um a um com evidÍncia |

**CritÈrio de saÌda:** PR n„o mergeia com L1...ìL3 vermelho; smoke L4 documentado; lista de exploits conhecidos mitigada ou aceita com rationale.

---

## M4 ó Client com cÛdigo-fonte

**Meta:** sair do client cl·ssico fechado (account sÛ numÈrica) para um client **customiz·vel com fonte**, mantendo look/fidelidade 7.4 o m·ximo possÌvel.

| Epic | Prioridade | Notas |
|------|------------|-------|
| Escolher base (OTClient / fork documentado) | P0 | Tradeoff vibe cl·ssica vs flexibilidade |
| Pipeline de assets 7.4 (dat/spr/otb) | P0 | Learnings de sprites / Object Builder |
| Login por **account name string** | P0 | Protocolo + UI; deixa de ser sÛ `uint32` |
| Server/MyAAC alinhados a string | P0 | Migrar do modo ""nome numÈrico...ù |
| Build reproduzÌvel do client (Windows) | P1 | Docs em `client/` |
| Features sÛ se n„o quebrarem 7.4 | P2 | Phase 3 antiga do `AGENTS.md` |

**CritÈrio de saÌda:** criar account `minha_conta` no site, logar no client com string, listar chars e entrar no jogo; cÛdigo do client versionado e build·vel.

---

## M5 ó Infra nuvem, seguranÁa e observabilidade

**Meta:** produÁ„o reproduzÌvel e defens·vel: definiÁ„o de infra, apps alinhadas a ela, Terraform/Terragrunt, configs de nuvem, proteÁ„o contra invas„o, antibot, logs/traces para monitoramento.

Base atual: `infra/` (Terraform DigitalOcean + firewall + user-data) e workflow de production (parcialmente desabilitado). Evoluir para multi-env com **Terragrunt**, hardening e telemetria.

| Epic | Prioridade | Notas |
|------|------------|-------|
| DefiniÁ„o da infra (arquitetura alvo) | P0 | Diagrama: rede, VM/droplet, DB, TLS, DNS, backups, secrets; doc em `docs/` + `infra/` |
| Adequar projetos ao encaixe na infra | P0 | Compose/12-factor: healthchecks, env por ambiente, volumes, sem secrets no Git, ports sÛ as necess·rias |
| Terraform + Terragrunt (construÁ„o) | P0 | MÛdulos TF; Terragrunt para `dev`/`staging`/`prod`; state remoto; plan/apply no CI |
| ConfiguraÁıes gerais de nuvem | P0 | Firewall, SSH keys, DNS, TLS (ACME), snapshots/backups, region/latÍncia BR (`HOSTING.md`) |
| ProteÁ„o contra invasıes (hardening) | P0 | UFW/SG, fail2ban/rate-limit SSH, least privilege, secrets management, surface mÌnima 22/80/443/7171/7172 |
| Sistema antibot | P1 | DetecÁ„o/limite de conexıes, captcha no site se couber, padrıes de login abuse, ban/IP tools ó sem quebrar fidelidade 7.4 in-game |
| Logs, traces e monitoramento | P0 | Logs estruturados (tfs/myaac/docker), correlaÁ„o request/login, alertas b·sicos, retenÁ„o; opcional APM/OTel depois |

**CritÈrio de saÌda:** `terragrunt run-all plan` (ou equivalente) documentado; um ambiente sobe do zero via IaC + deploy; portas expostas justificadas; antibot mÌnimo ativo; d· para rastrear um login/falha pelos logs sem SSH ad-hoc.

---

## M6 ó Release da base est·vel

**Meta:** tag/release que È o **projeto base** para variantes customizadas (inclui caminho de deploy da M5).

| Epic | Prioridade | Notas |
|------|------------|-------|
| Checklist de release (manual + auto) | P0 | Bootstrap, testes, defects abertos aceitos, smoke de infra |
| Docs ""como forkar / variante...ù | P0 | configs, rates, mapa, branding, **e** como apontar uma variante na infra |
| Templates de `.env` / `config.lua` por perfil | P1 | base 1x, custom rates, etc. |
| Invent·rio do que est· in/out da era 7.4 | P1 | Fidelidade explÌcita |

**CritÈrio de saÌda:** outro time (ou vocÍ) consegue clonar a tag, subir stack local **e** (opcional) provisionar um env via Terragrunt, e criar uma variante sÛ mudando configs/docs ó sem reescrever o n˙cleo.

---

## Icebox ó Mapa test·vel / alÈm do OTBM

**N„o bloqueia M6.** Approach ainda aberto.

| Epic | Prioridade | Notas |
|------|------------|-------|
| Pesquisa: gerador/validador OTBM | Icebox | Fixtures pequenas para CI |
| Pesquisa: formato alternativo ao OTBM | Icebox | Tradeoffs TFS / RME / tooling |
| Contratos de mapa sem depender sÛ do RME | Icebox | Ampliar L2 com mapas sintÈticos |
| Merge seletivo CipSoft 7.55 (`map.bak`) | Icebox | D-020; n„o substituir 7.4 por atacado |

**CritÈrio de saÌda (quando virar milestone):** decis„o documentada + POC com testes.

---

## Mapeamento legado -> este roadmap

O `AGENTS.md` antigo tinha Phases 1...ì3 genÈricas. Mapeamento:

| Antes | Agora |
|-------|--------|
| Phase 1 stack/defects | **M0** |
| Phase 2 accounts numÈricas / mapa | **M0** (login numÈrico) + **M1...ìM2** (mapa jog·vel/conte˙do) |
| Phase 3 client | **M4** (sÛ depois do n˙cleo test·vel) |
| ó | **M3** qualidade server (explÌcito) |
| ó | **M5** infra / seguranÁa / observabilidade |
| ó | **M6** release base |
| ó | **Icebox** mapa/OTBM |

---

## Como usar o GitHub Project

1. **Milestones** do repo = M0...¶M6 (+ Icebox).
2. **Issues** rotuladas: `epic`, `P0`/`P1`/`P2`, camada (`server`, `client`, `maps`, `site`, `docker`, `tests`, `docs`, `infra`, `security`, `observability`).
3. Board kanban: Backlog -> Ready -> In progress -> Review -> Done.
4. Uma issue de epic por linha das tabelas acima; tasks menores linkadas com ""blocked by...ù / subtarefas.
5. Ao fechar um epic, atualizar o **critÈrio de saÌda** do milestone e este arquivo se a ordem mudar.

---

## PrÛximo passo imediato

Fechar o restante de **M1 (P0)**: NPCs fantasma ([#81](https://github.com/matosnathan/otserver/issues/81)), shops stubs ([#80](https://github.com/matosnathan/otserver/issues/80)), smoke ([#33](https://github.com/matosnathan/otserver/issues/33)), balanceamento ([#101](https://github.com/matosnathan/otserver/issues/101) / [#102](https://github.com/matosnathan/otserver/issues/102)...ì[#109](https://github.com/matosnathan/otserver/issues/109)), e **Manual QA M1** ([#83](https://github.com/matosnathan/otserver/issues/83)...ì[#86](https://github.com/matosnathan/otserver/issues/86), [#109](https://github.com/matosnathan/otserver/issues/109)). Em seguida **M2 (P1)**: levers/chests/NPC stubs via [#82](https://github.com/matosnathan/otserver/issues/82) + [#36](https://github.com/matosnathan/otserver/issues/36)/[#37](https://github.com/matosnathan/otserver/issues/37)/[#38](https://github.com/matosnathan/otserver/issues/38) + **Manual QA M2** ([#87](https://github.com/matosnathan/otserver/issues/87)/[#88](https://github.com/matosnathan/otserver/issues/88)). CI M3 ([#39](https://github.com/matosnathan/otserver/issues/39)) pode andar em paralelo sem ultrapassar M1 P0.


