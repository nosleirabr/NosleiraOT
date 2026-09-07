# Map-as-code — fluxo

Fonte de verdade: **YAML em `maps/src/`**. A tool `tools/map-editor` compila e visualiza — não versiona dados de mapa.

```
maps/src/  (quests, sectors, meta, regions)
        │  otmap build --from-source
        ▼
maps/build/world.otbm  ──► docker compose (TFS)
```

## Regras

1. Não versionar baseline `world.otbm` na raiz de `maps/`.
2. Import raro: `otmap decompile` de OTBM externo → grava `maps/src/`.
3. Edição: YAML direto ou **Salvar** no viewer → `maps/src/sectors/`.
4. Bake: `otmap build --from-source` (sem `--overlay`).
5. `maps/build/viewer/` é preview regenerável (gitignored). `build/world.otbm` pode ir ao Git via LFS.

## Comandos (raiz do workspace)

```powershell
dotnet build tools\map-editor\Ot74.Map.Cli\Ot74.Map.Cli.csproj -nologo -v q
$otmap = 'tools\map-editor\Ot74.Map.Cli\bin\Debug\net10.0\otmap.dll'

dotnet exec $otmap build --from-source
dotnet exec $otmap viewer-data --all --otbm maps/build/world.otbm --out maps/build/viewer
.\tools\map-editor\launch-map-viewer.ps1
```

Atalhos viewer: [`tools/map-editor/viewer/README.md`](../tools/map-editor/viewer/README.md).

## Mais detalhe

| Tópico | Onde |
|--------|------|
| Layout do repo `maps/` | [`maps/README.md`](../maps/README.md) |
| Schema quests YAML | [`maps/src/quests/README.md`](../maps/src/quests/README.md) |
| CLI `otmap` | [`tools/map-editor/README.md`](../tools/map-editor/README.md) |
| Realmap / histórico | [`maps/docs/REALMAP_74.md`](../maps/docs/REALMAP_74.md) |
