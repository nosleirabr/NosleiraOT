# `client/modules`

Módulos Lua do OTClientV8 (UI + protocolo). Bootstrap: `init.lua` → `corelib` / `gamelib` → `client` → `game_interface`.

Hubs importantes:

- `client/client.otmod` — shell de login/options  
- `game_interface/interface.otmod` — stack in-game (`load-later`)  
- `game_features/features.lua` — flags por versão (772: LooktypeU16, MessageStatements, LoginPacketEncryption; `GameBot` off)  
- `client_options/` — defaults do jogador (ajustados por `OT74Dev`)

Gates de fidelidade: ver `../ot74_dev.lua` e `../README.md`.

**Não** renomeie pastas para “desligar” módulos — quebra referências. Tire do `load-later` ou early-return no `init()`.
