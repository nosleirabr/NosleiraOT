# Tibia 7.4 client — referência de fidelidade

Fonte condensada da pesquisa de fidelidade 7.4 do client (OTClientV8).  
Relatório bruto local (gitignored): `.tmp-client44/research-74-client.md`.

## Identidade

- **Release:** 14 Dec 2004 — Christmas Update 2004 ([Updates/7.4](https://tibia.fandom.com/wiki/Updates/7.4)).
- Este stack fala protocolo **772** no wire (shell moderno o suficiente para o TFS), mas a **meta de UI/UX é 7.4**.

### O que 7.4 trouxe (conteúdo)

Login queue, skill progress bars, crystal coins, Djinns/Orshabaal, tapestries móveis, raids, Ancient Tombs / Djinn War.

### O que veio depois (não pode “parecer” nativo no client fiel)

| Feature | Aprox. versão |
|---------|----------------|
| Soul points | 7.5 |
| Wands/rods, light/gfx update | 7.6 |
| Addons, item hotkeys, stamina | 7.8 |
| Quest log | 7.9 |
| Mounts, market, store, prey, imbuing, action bars, cyclopedia, … | 8.x–12.x+ |
| Som oficial no client | 13.00 (2022) |

## Assets originais 7.4

| Fonte | URL | Notas |
|-------|-----|--------|
| OTS.me exe | https://downloads.ots.me/?dir=data%2Ftibia-clients%2Fwindows%2Fexe | `Tibia740.exe` — CRC32 `31E3734D`, MD5 `9663A259…` |
| OTS.me zip | https://downloads.ots.me/?dir=data%2Ftibia-clients%2Fwindows%2Fzip | `Tibia.exe` + dat/spr/pic |
| otservers.online | https://otservers.online/tibia-clients | SPR sig `41B9EA86`, DAT `41BF619C` |
| OTLand | https://otland.net/threads/download-older-official-clients.278275/ | Archive comunitário |

No repo: `client/data/things/740/` (cópia 7.40) e `772/` (híbrido usado no login atual). CipSoft completo em `client_base/cipsoft/` (local).

## UI 7.4 (checklist)

- Viewport ~15×11; **uma** sidebar direita; console embaixo.
- Inventário: 10 slots clássicos; Cap; **sem Soul**.
- HP/mana na sidebar: barras **sem números/%**; barra sob criatura sem números.
- Skills com progress bars (novidade 7.4); Battle + VIP existem.
- **Sem** quest log; outfit **sem** addons; hotkeys **só texto** (sem item use).
- Escuridão real; light hack = não autêntico.
- Fight/chase/secure modes; skulls white/red.
- **Sem som**.

Screenshots de referência: ver seção no relatório bruto / Imgur clássico 7.x citados na pesquisa.

## Implicações para OTClientV8

Ver `client/README.md` (fases + `OT74Dev`) e learning `docs/learnings/wiki/otclientv8-74-base.md`.
