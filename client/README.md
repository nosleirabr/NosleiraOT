# Client (OTClientV8 → fidelidade 7.4)

Produto: **OTClientV8** falando protocolo **772** com o TFS deste repo.  
Objetivo: UI e comportamento o mais próximos possível do **CipSoft Tibia 7.4** (Christmas Update 2004), sem bot/shop/overlays modernos para o jogador final.

O CipSoft híbrido antigo e o OTClient Redemption ficam em `client_base/` (gitignored). Esta pasta é a única versãoada como client.

## O que tem hoje

| Item | Estado |
|------|--------|
| Base | OTClientV8 ready-to-use (`otclient_dx.exe` / `otclient_gl.exe`) |
| Layout | `retro` |
| Login | `127.0.0.1:7171` protocolo `772`, account numérica |
| Assets | `data/things/772/` (híbrido do stack) + cópia `740/` |
| Bot / shop / market / prey | Presentes no disco, **não** no `load-later` e `GameBot` off |
| Action bar / top bar Tibia 12 / overlays HP | Código ainda existe; **desligado** por default via `ot74_dev.lua` |
| Light hack | Default: luzes ligadas + ambient 0 (escuridão autêntica) |
| Gate de desenvolvimento | `ot74_dev.lua` + opcional `dev_features.lua` (**gitignore**) |

Como rodar: abra `otclient_dx.exe` **nesta pasta** (Start in = `client/`).

Login de dev: account `1` / `admin123` / char `Admin` (stack Docker no ar).

## Objetivo (para onde vamos)

1. Sidebar única à direita, viewport clássico, console embaixo — look CipSoft 7.4.
2. HP/mana da sidebar sem números/overlays modernos; barras de criatura sem % numérico.
3. Sem soul (7.5+), sem quest log (7.9+), sem addons/item hotkeys (7.8+), sem som (som oficial veio muito depois).
4. Sem vBot, action bars, top bar 12.x, light hack, profiles, shaders, shop, etc. no build do jogador.
5. Features modernas restantes removidas ou mortas **uma a uma**, sempre atrás do gate `OT74Dev` / `dev_features.lua`.

Referência histórica detalhada: [`docs/CLIENT_74.md`](../docs/CLIENT_74.md).  
Inventário técnico OTCv8 (sessão #44): `.tmp-client44/otcv8-inventory.md` (local, gitignored).

## Arquitetura de pastas

```
client/
  otclient_dx.exe / otclient_gl.exe   # binários OTCv8
  init.lua                            # bootstrap + server list + carrega ot74_dev.lua
  ot74_dev.lua                        # defaults fiéis (versionado)
  dev_features.lua.example            # template do override local
  data/                               # assets OTCv8 + things/772|740
  layouts/retro/                      # overlay visual “clássico”
  modules/                            # UI/protocolo (Lua)
  mods/                               # mods opcionais (ex.: healthbars, autoload false)
```

Config do usuário final vai para AppData sob `APP_NAME` (`nosleiraot-client`), não para o repo.

## Gate só para nós (`OT74Dev`)

| Chave | Controla |
|-------|----------|
| `bot` | vBot / `GameBot` (já off no features.lua) |
| `lightHack` | ambient fullbright + UI de lights em Options |
| `actionBars` | `game_actionbar` init + defaults |
| `topBar` | `game_topbar` |
| `healthOverlays` | top HP/mana + círculos |
| `fpsPingOverlay` | FPS/ping |
| `questLog` / `cooldownWidgets` / `profiles` / `shaders` | fora do load-later (ligar exige recolocar no otmod) |
| `luaTerminal` | carrega `client_terminal` só se true |
| `clientFeedback` / `mobileUi` | fora do load-later |

Fluxo:

```powershell
copy client\dev_features.lua.example client\dev_features.lua
# edite as chaves true que precisa testar
```

`dev_features.lua` está no `.gitignore` do client — **não commitar**.

## Fases de alteração

| Fase | Meta | Status |
|------|------|--------|
| **0** | Escolher base OTCv8, mover para `client/`, arquivar CipSoft/Redemption | feita (#44) |
| **1** | Gate `OT74Dev` + defaults 7.4 + lista de features a matar | feita (este commit) |
| **2** | Matar/ocultar UI: action bar options, Custom tab, top bar, health overlays, light sliders | próxima |
| **3** | Layout `retro` → viewport/sidebar/console fiéis; inventário 10 slots; sem soul | depois |
| **4** | Outfit sem addons/mounts/shaders; hotkeys só texto; quest log ausente | depois |
| **5** | Remoção morta de módulos dorminhocos (shop/bot/…) **sem** rename quebrando paths | depois |
| **6** | Build a partir de `otcv8-dev` se precisar de mudança C++ | se necessário |
| **M4** | Accounts string + MyAAC/site (roadmap separado) | milestone |

Trabalhar **uma feature não-7.4 por vez**, com evidência (screenshot 7.4 + gate off).

## Features não-7.4 (backlog unitário)

Ordem sugerida (impacto × risco):

1. **Light hack** — options Graphics ambient / enableLights  
2. **Health overlays** — top bars + circles em `game_healthinfo`  
3. **Action bars** — módulo + options Custom (alto acoplamento)  
4. **Top bar 12.x** — `game_topbar`  
5. **vBot** — já dormant; endurecer (init no-op, profiles)  
6. **Profiles** — hub que chama topbar/actionbar/bot  
7. **Quest log / cooldown / shaders / stats / feedback / mobile** — já fora do load-later  
8. **Shop / market / prey / imbuing / mounts / spell list** — dormant no disco  

Gotchas: não renomear pastas para `_disabled_*`; `game_actionbar` é referenciado por options/profiles; `game_healthcircle` não é módulo separado.

## Login / protocolo

- Server exige **771–772** (`CLIENT_VERSION_*`). Client usa **772**.  
- Account **uint32** / nome numérico.  
- Não anexar flags no server string (`:25:30:…`).

## Links

- Issue: [#44](https://github.com/matosnathan/otserver/issues/44)  
- Docs 7.4: [`docs/CLIENT_74.md`](../docs/CLIENT_74.md)  
- Learning: [`docs/learnings/wiki/otclientv8-74-base.md`](../docs/learnings/wiki/otclientv8-74-base.md)  
- Root: [`../README.md`](../README.md) / router [`../AGENTS.md`](../AGENTS.md)


## 🔨 Build Reproduzivel (Windows)

Para compilar o client do zero em uma maquina limpa Windows, siga os passos abaixo:

### Requisitos

1. **Visual Studio 2022**: Instale com a carga de trabalho *"Desktop development with C++"*.
2. **CMake**: Baixe e instale a ultima versao (adicione ao PATH do sistema).
3. **vcpkg**: 
   ```powershell
   git clone https://github.com/microsoft/vcpkg.git C:\vcpkg
   cd C:\vcpkg
   .\bootstrap-vcpkg.bat
   .\vcpkg integrate install
   ```
4. **Source Code**: Garanta que o codigo fonte do client (ex: OTClient Redemption) esta clonado na pasta `client_base/OTClient-Redemption` (gitignored da base 7.4).

### Automatizado (Script)

Basta rodar o arquivo `build_windows.bat` disponivel nesta pasta. Ele fara:
- A limpeza da build antiga
- Geracao do projeto via CMake atrelando o vcpkg
- Build da solucao no modo Release (usando o MSBuild do VS2022)
- Copia dos binarios `otclient_dx.exe` e `otclient_gl.exe` para esta pasta `client/`.

### Conectando ao Servidor Local

Apos o build e execucao, o binario utiliza as configuracoes presentes no `init.lua` e `ot74_dev.lua`. Para conectar-se:
- IP: `127.0.0.1`
- Port: `7171`
- Account/Password: O default de testes (Account `1`, Password `admin123`).
- Protocolo: O client esta setado internamente para usar o protocolo 7.72 da CipSoft com assets hibridos do 7.40.

## Build Reproduzivel (Windows)
Para compilar o client do zero em uma maquina limpa Windows, siga os passos abaixo:

### Requisitos
1. Visual Studio 2022 com Desktop development with C++.
2. CMake configurado no PATH.
3. vcpkg instalado e integrado.
4. Source Code: OTClient clonado em client_base/OTClient-Redemption.

### Automatizado
Basta rodar o arquivo build_windows.bat disponivel nesta pasta.
Ele fara o clean, a geracao via CMake + vcpkg e a compilacao Release.

