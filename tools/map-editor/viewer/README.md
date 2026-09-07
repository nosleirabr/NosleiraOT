# Map viewer (web)

Editor web do mapa. Shell em `viewer/`; dados em `maps/build/viewer/` (gerados por `otmap viewer-data`).

## Abrir (workspace root)

```powershell
# Bake + viewer-data + HTTP (recomendado)
.\tools\map-editor\launch-map-viewer.ps1

# Só Thais (rápido)
.\tools\map-editor\launch-map-viewer.ps1 -Quick

# Reusar JSON já gerado
.\tools\map-editor\launch-map-viewer.ps1 -SkipBuild
```

Pré-requisito: `maps/build/world.otbm` e assets `client/data/things/740/Tibia.dat` + `.spr`.

## Gerar dados manualmente

```powershell
$otmap = 'tools\map-editor\Ot74.Map.Cli\bin\Debug\net10.0\otmap.dll'
dotnet exec $otmap viewer-data --all --otbm maps/build/world.otbm --out maps/build/viewer
```

## Salvar

Botão **Salvar** ou Ctrl+S → `otmap viewer-save` → YAML em `maps/src/sectors/`. Depois: `otmap build --from-source`.

## Atalhos

| Ação | Tecla |
|------|-------|
| Pan | Ctrl + arrastar |
| Zoom | Scroll |
| Apagar tile | Del |
| Salvar | Ctrl+S |

## QA automatizado (opcional)

```powershell
cd tools\map-editor\viewer
npm install
.\..\..\..\tools\map-editor\launch-map-viewer.ps1 -Quick -NoBrowser
node qa-editor.mjs
```

Mais comandos CLI: [`../README.md`](../README.md). Fluxo completo: [`../../../docs/MAP_AS_CODE_FLOW.md`](../../../docs/MAP_AS_CODE_FLOW.md).
