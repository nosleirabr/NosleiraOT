# maps — OpenTibia 7.4 (map-as-code)

Fonte de verdade: **YAML em `src/`**. Não há `world.otbm` de baseline no Git.

A tool [`tools/map-editor`](../tools/map-editor/README.md) (otmap) **gera** o OTBM a partir deste código.

## Layout

```
src/                    # FONTE — versionada
  world.map.yaml
  quests/
  sectors/              # geometria (LFS)
  meta/
  regions/
world-spawn.xml
world-house.xml
build/
  world.otbm            # artefato bake (LFS) — regenerável
  viewer/               # gitignored — preview JSON
docs/                   # MAP_AS_CODE*, REALMAP_74, …
```

## Fluxo

1. **Import (raro / já feito):** `otmap decompile` a partir de um `.otbm` externo → grava `src/`. Não versionar o OTBM de entrada.
2. **Dia a dia:** editar YAML em `src/` (quests, setores, Salvar do viewer).
3. **Bake:** `otmap build --from-source` → `build/world.otbm` (**sem** `--overlay`, **sem** baseline OTBM).
4. **Runtime:** Compose na raiz do repo monta `maps/build/world.otbm` + spawn/house no TFS.

Comandos: ver [`docs/MAP_AS_CODE_FLOW.md`](../docs/MAP_AS_CODE_FLOW.md) e [`maps/docs/README.md`](docs/README.md).

## Git

| Path | Git |
|------|-----|
| `src/` (quests, sectors, meta, regions) | sim (sectors via LFS) |
| `world-spawn.xml` / `world-house.xml` | sim |
| `build/world.otbm` | sim (LFS) |
| `build/viewer/` | **não** |
| `world.otbm` na raiz | **não existe** |

```powershell
git lfs install
git lfs pull
```
