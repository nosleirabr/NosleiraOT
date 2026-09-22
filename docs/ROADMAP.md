# Roadmap — OT Server 7.4 (base estável)

Tracker: [Issues nosleirabr/Oteserver7.4](https://github.com/nosleirabr/Oteserver7.4/issues)

Fluxo agentic (branch `<id>-mN-summary`, PR com `Closes #N`): [`docs/AGENTIC_KANBAN.md`](AGENTIC_KANBAN.md)

Este documento é a **fonte canônica de ordem de entrega**. Links `#NN` para `matosnathan/otserver` abaixo são **histórico** de um tracker anterior; issues **ativas** deste servidor estão em `nosleirabr/Oteserver7.4`. Detalhe técnico continua em `KNOWN_DEFECTS.md`, `REALMAP_74.md`, `QUESTS_AND_FEATURES.md` e `TESTING.md`.

---

## Objetivo norte

Entregar uma **versão estável de Tibia 7.4** o mais limpa e funcional possível:

- conteúdo 7.4 implementado e **testado** (automático + manual);
- server **estável e testável**;
- client **com código-fonte** customizável (ex.: login por **nome de account em string**, não só número/`uint32`);
- repositório serve de **projeto base** — a partir dele nascem variantes com outras configs, mapas e regras;
- infra de nuvem **definida e reproduzível** (Terraform/Terragrunt), com hardening, antibot e observabilidade (logs/traces).

**Não é objetivo agora:** features modernas de OT (shop web, roulette, mounts, etc.).

**Icebox (futuro, approach indefinido):** gerador/validador de mapa OTBM ou substituição do OTBM por outra representação testável.

---

## Como ler prioridades

| Símbolo | Significado |
|---------|-------------|
| **P0** | Bloqueia jogabilidade ou release |
| **P1** | Paridade de conteúdo / qualidade necessária para ""base estável... |
| **P2** | Importante, mas pode seguir em paralelo ou após o núcleo |
| **Icebox** | Desejável; não bloqueia a versão estável |

Cada **milestone** = fatia entregável. Cada **epic** = grupo de issues no Project.

---

## Ordem de fechamento (prioridade)

Ordem alinhada ao roadmap — feche nesta sequência; não pule P0 de M1 por itens mais “interessantes” de milestones posteriores.

**Regra de aceitação:** feature marcada **Done** no código ainda precisa de story `[Manual QA]` antes do milestone fechar. **L3 automatizado â‰  aceitação.**

1. **M0 leftovers** — fechar primeiro o que sobrou da fundação *(hoje: Done)*.
2. **M1 (P0)** *(Done)* — primeiro: NPCs fantasma ([#81](https://github.com/matosnathan/otserver/issues/81)), shops stubs ([#80](https://github.com/matosnathan/otserver/issues/80)), smoke ([#33](https://github.com/matosnathan/otserver/issues/33)), balanceamento combate ([#101](https://github.com/matosnathan/otserver/issues/101)), **Manual QA M1** ([#83](https://github.com/matosnathan/otserver/issues/83)...“[#86](https://github.com/matosnathan/otserver/issues/86), combate [#109](https://github.com/matosnathan/otserver/issues/109)).
3. **M2 (P1)** — em seguida: levers ([#37](https://github.com/matosnathan/otserver/issues/37)); baús restantes (uma story por quest, [#82](https://github.com/matosnathan/otserver/issues/82)); stubs de NPC de quest ([#36](https://github.com/matosnathan/otserver/issues/36)); portas ([#38](https://github.com/matosnathan/otserver/issues/38)); **Manual QA M2** ([#87](https://github.com/matosnathan/otserver/issues/87), [#88](https://github.com/matosnathan/otserver/issues/88)). Mission quests já foram quebradas em stories e estão **Done** ([#66](https://github.com/matosnathan/otserver/issues/66)...“[#79](https://github.com/matosnathan/otserver/issues/79)); umbrella [#35](https://github.com/matosnathan/otserver/issues/35) **Done**.
4. **M3 em paralelo (P1)** — CI ([#39](https://github.com/matosnathan/otserver/issues/39)) pode começar junto, mas **nunca** supera M1 P0.
5. **M4 / M5 / M6 / Icebox** — permanecem Backlog **P2** até o núcleo M1+M2 estar fechado.

---

## Visão da sequência (ordem de entrega)

```
M0 Fundação          â”€â”€â–º já em grande parte feito (stack + login numérico + realmap carregando)
        â”‚
M1 Jogabilidade núcleo â”€â”€â–º travel, bancos, temples, shops, rates clássicos
        â”‚
M2 Conteúdo 7.4        â”€â”€â–º quests Miracle74, NPCs de quest, levers/aids (D-018/D-019)
        â”‚
M3 Server testável     â”€â”€â–º CI verde, L1...“L4 amplos, mitigação de exploits, perfis de config
        â”‚
M4 Client com fonte    â”€â”€â–º client open-source + accounts string + site/protocolo alinhados
        â”‚
M5 Infra + segurança   â”€â”€â–º definição nuvem, Terragrunt/Terraform, hardening, antibot, logs/traces
        â”‚
M6 Release base estávelâ”€â”€â–º checklist, docs de fork, templates de variante
        â”‚
Icebox Mapa            â”€â”€â–º gerador OTBM / alternativa (não bloqueia M6)
```

**Por que esta ordem**

1. Sem **M1**, o mapa real não é jogável de ponta a ponta (cidades mortas / sem barcos).
2. Sem **M2**, não há paridade de conteúdo para chamar de ""7.4 completo....
3. Sem **M3**, qualquer client novo ou fork custom herda um server frágil.
4. **M4** vem depois do núcleo estável: contas string **exigem** client com fonte; até lá o protocolo clássico continua numérico (`uint32`).
5. **M5** prepara produção: infra como código, apps ""infra-ready..., proteção e rastreabilidade — **antes** de declarar a base estável pública.
6. **M6** empacota a base para gerar variantes (incluindo deploy repetível).
7. Ferramenta de mapa fica no **icebox** porque o approach ainda não está decidido.

**Paralelismo:** definição de infra + healthchecks/logs estruturados podem começar em paralelo com **M3/M4**; apply de produção e antibot fino dependem do stack já jogável.

---

## M0 — Fundação do stack *(quase concluído)*

**Meta:** Docker + TFS 1.2 + MyAAC + MariaDB + client clássico sobem; login 7.4 numérico funciona; realmap carrega; defects blockers documentados.

| Epic | Prioridade | Estado | Docs / evidência |
|------|------------|--------|------------------|
| Stack Compose (mysql, tfs, myaac) | P0 | Feito | `docker/`, `docs/BOOTSTRAP.md` |
| Login account numérica (`uint32`) | P0 | Feito | D-001/D-002, learning login-numeric |
| Realmap 7.4 (222222) como `world` | P0 | Feito (mapa); conteúdo aberto | D-004, `REALMAP_74.md` |
| Teleports críticos / buracos Z | P0 | Parcial / vários fechados | D-007, D-015 |
| Bootstrap + learnings + skills | P1 | Feito | `README.md`, `AGENTS.md`, `docs/learnings/` |
| Suite de testes L1...“L4 inicial | P1 | Em andamento | `TESTING.md` |

**Critério de saída:** clone novo sobe com `docs/BOOTSTRAP.md`; admin loga; personagem entra no mundo.

---

## M1 — Jogabilidade núcleo *(quase feito — gaps de smoke/shops/fantasma)*

**Meta:** um jogador consegue Rook -> mainland -> viajar entre cidades, usar cambista/templo/shops sem quebrar fidelidade 7.4.

| Epic | Prioridade | Estado | Notas |
|------|------------|--------|-------|
| Travel (barcos, carpetes) | P0 | **Feito** | Scripts + `TravelContractTests` verdes |
| Oracle / vocações / towns | P0 | **Feito** | `The Oracle.lua` towns/kits 7.4 |
| Cambistas + temples/healers | P0 | **Feito** | `money_exchange` + `healer.lua` (sem banco virtual) |
| Worms / fishing 7.4 (sem `3976`) | P1 | **Feito** | [#31](https://github.com/matosnathan/otserver/issues/31) **Done** |
| Rates clássicos 1x (perfil base) | P1 | **Feito** | `config.lua` rates = 1 |
| NPCs fantasma no spawn | P0 | **Feito** | [#81](https://github.com/matosnathan/otserver/issues/81) |
| Smoke manual + contratos L3 | P0 | Aberto | [#33](https://github.com/matosnathan/otserver/issues/33) — L3 travel ok; L4 skip |
| Shops stubs (`default.lua`) | P0 | **Feito** | [#80](https://github.com/matosnathan/otserver/issues/80) |
| Balanceamento 7.4 (vocações/skills/combate) | P0 | **Feito** | Epic [#101](https://github.com/matosnathan/otserver/issues/101); pesquisa [#102](https://github.com/matosnathan/otserver/issues/102) Ready; configs/testes [#103](https://github.com/matosnathan/otserver/issues/103)...“[#108](https://github.com/matosnathan/otserver/issues/108) Backlog até matriz; Manual QA [#109](https://github.com/matosnathan/otserver/issues/109) |
| `[Manual QA] Travel — barcos e carpetes` | P0 | Aberto | [#83](https://github.com/matosnathan/otserver/issues/83) |
| `[Manual QA] Cambistas — conversão de dinheiro` | P0 | Aberto | [#84](https://github.com/matosnathan/otserver/issues/84) |
| `[Manual QA] Oracle, temples e healers` | P0 | Aberto | [#85](https://github.com/matosnathan/otserver/issues/85) |
| `[Manual QA] Conversação NPCs core` | P0 | Aberto | [#86](https://github.com/matosnathan/otserver/issues/86) |
| `[Manual QA] Combate 7.4` | P0 | Aberto | [#109](https://github.com/matosnathan/otserver/issues/109) |

**Restante M1:** [#81](https://github.com/matosnathan/otserver/issues/81), [#33](https://github.com/matosnathan/otserver/issues/33), [#80](https://github.com/matosnathan/otserver/issues/80), [#101](https://github.com/matosnathan/otserver/issues/101) + Manual QA [#83](https://github.com/matosnathan/otserver/issues/83)...“[#86](https://github.com/matosnathan/otserver/issues/86)/[#109](https://github.com/matosnathan/otserver/issues/109).

### Manual QA (obrigatório para fechar M1)

Features com código **Done** ainda precisam de stories de **Manual QA** antes de considerar o milestone fechado.

**Regra:** L3 automatizado â‰  aceitação manual. Cada epic/quest Done deve ter issue(s) `[Manual QA]` linkada(s). Prioridade destas stories em M1: **P0** (bloqueiam o fechamento de M1). Canônico (não usar dups #89...“#100):

- [#83](https://github.com/matosnathan/otserver/issues/83) Travel — barcos e carpetes
- [#84](https://github.com/matosnathan/otserver/issues/84) Cambistas — conversão de dinheiro
- [#85](https://github.com/matosnathan/otserver/issues/85) Oracle, temples e healers
- [#86](https://github.com/matosnathan/otserver/issues/86) Conversação NPCs core
- [#109](https://github.com/matosnathan/otserver/issues/109) Combate 7.4 — vocações e skills

**Critério de saída:** checklist smoke: criar char -> Rook -> Oracle -> Thais -> barco -> outra cidade -> depot/cambista -> comprar runas/food; **e** Manual QA P0 acima aceito (ou issues linkadas fechadas), incluindo combate [#109](https://github.com/matosnathan/otserver/issues/109).

---

## M2 — Paridade de conteúdo 7.4

**Meta:** catálogo Miracle74 (~99 quests) + comportamento de NPC de quest; levers/chests com uid/aid corretos no OTBM.

| Epic | Prioridade | Estado | Notas |
|------|------------|--------|-------|
| Mission quests (umbrella) | P0 | **Feito** | [#35](https://github.com/matosnathan/otserver/issues/35) **Done**; split por quest [#66](https://github.com/matosnathan/otserver/issues/66)...“[#79](https://github.com/matosnathan/otserver/issues/79) **Done** |
| Baús restantes (uma story por quest) | P1 | **Feito** | [#82](https://github.com/matosnathan/otserver/issues/82); D-019; auditoria |
| NPCs de quest (stubs -> scripts) | P1 | Aberto | [#36](https://github.com/matosnathan/otserver/issues/36); D-018 |
| Levers / actionids ligados a scripts | P1 | **Feito** | [#37](https://github.com/matosnathan/otserver/issues/37); inventário em `MAP_DATAPACK_FIX_PLAN.md` |
| Portas / storage / aids sem colisão 8.0 | P1 | **Feito** | [#38](https://github.com/matosnathan/otserver/issues/38); learning `quest-actionid-8-0-collision` |
| Cobertura `audit-quest-coverage.ps1` | P1 | Em andamento | Meta: subir de 0/91; tracking via [#82](https://github.com/matosnathan/otserver/issues/82) |
| `[Manual QA] Mission quests (log 7.4)` | P1 | Aberto | [#87](https://github.com/matosnathan/otserver/issues/87) — código Done (#66...“#79) |
| `[Manual QA] Quests injector (amostra)` | P1 | Aberto | [#88](https://github.com/matosnathan/otserver/issues/88) |

**Restante M2 (tracking):** [#82](https://github.com/matosnathan/otserver/issues/82) + [#36](https://github.com/matosnathan/otserver/issues/36) / [#37](https://github.com/matosnathan/otserver/issues/37) / [#38](https://github.com/matosnathan/otserver/issues/38) + Manual QA [#87](https://github.com/matosnathan/otserver/issues/87)/[#88](https://github.com/matosnathan/otserver/issues/88).

### Manual QA (M2)

Mesma regra de M1: código Done não fecha o milestone sem aceitação manual. L3 automatizado â‰  Manual QA. Prioridade das stories `[Manual QA]` de M2: **P1**.

- [#87](https://github.com/matosnathan/otserver/issues/87) Mission quests (log 7.4)
- [#88](https://github.com/matosnathan/otserver/issues/88) Quests injector (amostra)

**Critério de saída:** relatório de cobertura de quests em nível aceitável (definir % no milestone); quests âncora jogáveis com teste L3/L4 onde couber; **e** Manual QA P1 acima aceito (ou issues linkadas).

---

## M3 — Server estável e testável

**Meta:** o server da base é previsível, com CI e contratos que protegem forks.

| Epic | Prioridade | Notas |
|------|------------|-------|
| CI obrigatório L1+L2+L3 em PR | P0 | **Feito** | Linting endurecido |
| Ampliar L3 (quests, spawns, travel) | P0 | **Feito** | Testes de integridade de ShopModule criados |
| L4 protocolo em pipeline opt-in/nightly | P1 | Stack Docker no CI |
| Mitigações de dupe / exploits era 7.4 | P1 | `ITEM_DUPLICATION_BUGS.md` |
| Perfís de config (`base` vs variante) | P1 | **Feito** | Sem secrets; config.lua isolado |
| Defects comunidade (D-010...¦D-017) triagem | P2 | Um a um com evidência |

**Critério de saída:** PR não mergeia com L1...“L3 vermelho; smoke L4 documentado; lista de exploits conhecidos mitigada ou aceita com rationale.

---

## M4 — Client com código-fonte

**Meta:** sair do client clássico fechado (account só numérica) para um client **customizável com fonte**, mantendo look/fidelidade 7.4 o máximo possível.

| Epic | Prioridade | Notas |
|------|------------|-------|
| Escolher base (OTClient / fork documentado) | P0 | Tradeoff vibe clássica vs flexibilidade |
| Pipeline de assets 7.4 (dat/spr/otb) | P0 | Learnings de sprites / Object Builder |
| Login por **account name string** | P0 | Protocolo + UI; deixa de ser só `uint32` |
| Server/MyAAC alinhados a string | P0 | Migrar do modo ""nome numérico... |
| Build reproduzível do client (Windows) | P1 | Docs em `client/` |
| Features só se não quebrarem 7.4 | P2 | Phase 3 antiga do `AGENTS.md` |

**Critério de saída:** criar account `minha_conta` no site, logar no client com string, listar chars e entrar no jogo; código do client versionado e buildável.

---

## M5 — Infra nuvem, segurança e observabilidade

**Meta:** produção reproduzível e defensável: definição de infra, apps alinhadas a ela, Terraform/Terragrunt, configs de nuvem, proteção contra invasão, antibot, logs/traces para monitoramento.

Base atual: `infra/` (Terraform DigitalOcean + firewall + user-data) e workflow de production (parcialmente desabilitado). Evoluir para multi-env com **Terragrunt**, hardening e telemetria.

| Epic | Prioridade | Notas |
|------|------------|-------|
| Definição da infra (arquitetura alvo) | P0 | Diagrama: rede, VM/droplet, DB, TLS, DNS, backups, secrets; doc em `docs/` + `infra/` |
| Adequar projetos ao encaixe na infra | P0 | Compose/12-factor: healthchecks, env por ambiente, volumes, sem secrets no Git, ports só as necessárias |
| Terraform + Terragrunt (construção) | P0 | Módulos TF; Terragrunt para `dev`/`staging`/`prod`; state remoto; plan/apply no CI |
| Configurações gerais de nuvem | P0 | Firewall, SSH keys, DNS, TLS (ACME), snapshots/backups, region/latência BR (`HOSTING.md`) |
| Proteção contra invasões (hardening) | P0 | UFW/SG, fail2ban/rate-limit SSH, least privilege, secrets management, surface mínima 22/80/443/7171/7172 |
| Sistema antibot | P1 | Detecção/limite de conexões, captcha no site se couber, padrões de login abuse, ban/IP tools — sem quebrar fidelidade 7.4 in-game |
| Logs, traces e monitoramento | P0 | Logs estruturados (tfs/myaac/docker), correlação request/login, alertas básicos, retenção; opcional APM/OTel depois |

**Critério de saída:** `terragrunt run-all plan` (ou equivalente) documentado; um ambiente sobe do zero via IaC + deploy; portas expostas justificadas; antibot mínimo ativo; dá para rastrear um login/falha pelos logs sem SSH ad-hoc.

---

## M6 — Release da base estável

**Meta:** tag/release que é o **projeto base** para variantes customizadas (inclui caminho de deploy da M5).

| Epic | Prioridade | Notas |
|------|------------|-------|
| Checklist de release (manual + auto) | P0 | Bootstrap, testes, defects abertos aceitos, smoke de infra |
| Docs ""como forkar / variante... | P0 | configs, rates, mapa, branding, **e** como apontar uma variante na infra |
| Templates de `.env` / `config.lua` por perfil | P1 | base 1x, custom rates, etc. |
| Inventário do que está in/out da era 7.4 | P1 | Fidelidade explícita |

**Critério de saída:** outro time (ou você) consegue clonar a tag, subir stack local **e** (opcional) provisionar um env via Terragrunt, e criar uma variante só mudando configs/docs — sem reescrever o núcleo.

---

## Icebox — Mapa testável / além do OTBM

**Não bloqueia M6.** Approach ainda aberto.

| Epic | Prioridade | Notas |
|------|------------|-------|
| Pesquisa: gerador/validador OTBM | Icebox | Fixtures pequenas para CI |
| Pesquisa: formato alternativo ao OTBM | Icebox | Tradeoffs TFS / RME / tooling |
| Contratos de mapa sem depender só do RME | Icebox | Ampliar L2 com mapas sintéticos |
| Merge seletivo CipSoft 7.55 (`map.bak`) | Icebox | D-020; não substituir 7.4 por atacado |

**Critério de saída (quando virar milestone):** decisão documentada + POC com testes.

---

## Mapeamento legado -> este roadmap

O `AGENTS.md` antigo tinha Phases 1...“3 genéricas. Mapeamento:

| Antes | Agora |
|-------|--------|
| Phase 1 stack/defects | **M0** |
| Phase 2 accounts numéricas / mapa | **M0** (login numérico) + **M1...“M2** (mapa jogável/conteúdo) |
| Phase 3 client | **M4** (só depois do núcleo testável) |
| — | **M3** qualidade server (explícito) |
| — | **M5** infra / segurança / observabilidade |
| — | **M6** release base |
| — | **Icebox** mapa/OTBM |

---

## Como usar o GitHub Project

1. **Milestones** do repo = M0...¦M6 (+ Icebox).
2. **Issues** rotuladas: `epic`, `P0`/`P1`/`P2`, camada (`server`, `client`, `maps`, `site`, `docker`, `tests`, `docs`, `infra`, `security`, `observability`).
3. Board kanban: Backlog -> Ready -> In progress -> Review -> Done.
4. Uma issue de epic por linha das tabelas acima; tasks menores linkadas com ""blocked by... / subtarefas.
5. Ao fechar um epic, atualizar o **critério de saída** do milestone e este arquivo se a ordem mudar.

---

## Próximo passo imediato

Fechar o restante de **M1 (P0)**: NPCs fantasma ([#81](https://github.com/matosnathan/otserver/issues/81)), shops stubs ([#80](https://github.com/matosnathan/otserver/issues/80)), smoke ([#33](https://github.com/matosnathan/otserver/issues/33)), balanceamento ([#101](https://github.com/matosnathan/otserver/issues/101) / [#102](https://github.com/matosnathan/otserver/issues/102)...“[#109](https://github.com/matosnathan/otserver/issues/109)), e **Manual QA M1** ([#83](https://github.com/matosnathan/otserver/issues/83)...“[#86](https://github.com/matosnathan/otserver/issues/86), [#109](https://github.com/matosnathan/otserver/issues/109)). Em seguida **M2 (P1)**: levers/chests/NPC stubs via [#82](https://github.com/matosnathan/otserver/issues/82) + [#36](https://github.com/matosnathan/otserver/issues/36)/[#37](https://github.com/matosnathan/otserver/issues/37)/[#38](https://github.com/matosnathan/otserver/issues/38) + **Manual QA M2** ([#87](https://github.com/matosnathan/otserver/issues/87)/[#88](https://github.com/matosnathan/otserver/issues/88)). CI M3 ([#39](https://github.com/matosnathan/otserver/issues/39)) pode andar em paralelo sem ultrapassar M1 P0.



