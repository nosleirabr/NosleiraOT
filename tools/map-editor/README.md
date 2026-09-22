# Ot74.Map — map-editor (toolchain only)

CLI `otmap` + web viewer. **Sem dados de mapa.** Fonte YAML e bake: pasta `maps/` neste repositório.

Fluxo completo: `docs/MAP_AS_CODE_FLOW.md` na raiz.

## Mental model

```
maps/src/ (YAML versionado)
        │  otmap build --from-source
        ▼
maps/build/world.otbm  ──► Docker / TFS
```

- **Não** há `maps/world.otbm` de baseline no Git.
- **Salvar** no viewer grava YAML em `maps/src/sectors` (e quests quando aplicável).
- Import raro: `otmap decompile --otbm path/externo.otbm`.

## Projetos

| Projeto | Papel |
|---------|--------|
| `Ot74.Map.Core` | Reader/writer OTBM streaming |
| `Ot74.Map.Source` | YAML, quests, decompile, SourceCompiler |
| `Ot74.Map.Items` / `Sprites` | items.otb, .dat/.spr, atlas |
| `Ot74.Map.Cli` (`otmap`) | CLI headless |
| `viewer/` | Editor web |

## Build / bake (workspace root)

```powershell
dotnet build tools\map-editor\Ot74.Map.Cli\Ot74.Map.Cli.csproj -nologo -v q
$otmap = 'tools\map-editor\Ot74.Map.Cli\bin\Debug\net10.0\otmap.dll'

dotnet exec $otmap build --from-source
dotnet exec $otmap viewer-data --all --otbm maps/build/world.otbm --out maps/build/viewer
.\tools\map-editor\launch-map-viewer.ps1
```

Env opcional: `OT74_MAPS` (absoluto) se `maps/` não for sibling do compose.

## Git

Código da tool neste monorepo: `tools/map-editor/` em [nosleirabr/Oteserver7.4](https://github.com/nosleirabr/Oteserver7.4).
