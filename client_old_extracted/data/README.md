# `client/data`

Assets do OTClientV8 carregados em runtime.

| Subpasta | Papel |
|----------|--------|
| `things/772/` | `Tibia.dat` / `Tibia.spr` usados no login protocolo 772 |
| `things/740/` | Assets 7.40 de referência / experimentos |
| `styles/`, `images/`, `fonts/`, `cursors/` | UI default (sobrescrita por `layouts/retro` quando ativo) |
| `locales/`, `sounds/`, `shaders/` | i18n / áudio / shaders (muitos anacrônicos para 7.4) |

Não edite `things` com Object Builder sem alinhar assinaturas (ver learnings de hybrid signatures).
