# maps/src

Fonte de mapa em código. Camada: [`../README.md`](../README.md).

| Path | Role | Git |
|------|------|-----|
| `world.map.yaml` | Manifesto (quests, sectors, regions, meta) | versionado |
| `quests/*.yaml` | Aids/uids/loot/alavancas (bake) | versionado |
| `regions/*.yaml` | Overlays pontuais | versionado |
| `sectors/` | Geometria (import) | versionado (LFS) |
| `meta/` | Header/towns/waypoints/mapdata | versionado |

## Fluxo

```powershell
# No workspace root (siblings maps/ + tools/map-editor/)
dotnet build tools\map-editor\Ot74.Map.Cli\Ot74.Map.Cli.csproj -nologo -v q
$otmap = 'tools\map-editor\Ot74.Map.Cli\bin\Debug\net10.0\otmap.dll'

dotnet exec $otmap build --from-source
docker compose restart tfs
```

Saída: `maps/build/world.otbm`.
