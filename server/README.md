# Server (TFS 1.2 / Tibia 7.4)

## O que é esta camada

- **Raiz de runtime do server**: `server/server/`
- **Fontes C++**: `server/src/`
- **Config**: `server/server/config.lua` (montado nos containers)
- **Schema do DB**: `server/schema.sql`
- **Data**: `server/server/data/` (npc, items, actions, spells, etc.)

## Learnings principais

- **Login numérico (7.4)**: o client envia account como `uint32`; DB/site devem usar nomes de account numéricos.
  - Veja `docs/learnings/wiki/login-numeric-accounts-7-4.md`

## Logs / debugging

- Prefira logs do docker:
  - `docker compose logs -f tfs`

## Links

- Guia do projeto: [`README.md`](../README.md) da raiz (roteamento para agentes: [`AGENTS.md`](../AGENTS.md))
- Catálogo de learnings: `docs/learnings/index.md`

---

# Upstream: forgottenserver 7.4

Baseado em um branch downgraded por [@ninjalulz](https://github.com/ninjalulz/), que segundo o arquivo 'definition.h' é **TFS 1.2**. O [Forgotten Server](https://github.com/otland/forgottenserver/) original é um emulador de servidor MMORPG gratuito e open-source escrito em C++. É um fork do projeto [OpenTibia Server](https://github.com/opentibia/server). Client customizado incluído (client 7.72 com dat/spr/pic 7.4).

### Getting Started

* [Compiling](https://github.com/otland/forgottenserver/wiki/Compiling)
* [Scripting Reference](https://github.com/otland/forgottenserver/wiki/Script-Interface)

### Support

Se precisar de ajuda, visite o [nosso tópico no fórum OTLand](https://otland.net/threads/7-4-tfs-1-2.245320/).

### Issues

Usamos o [issue tracker no GitHub](https://github.com/babymannen/theforgottenserver-7.4/issues).
