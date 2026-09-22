# Bootstrap — Nosleira OT Server 7.4

Monorepo único no GitHub. Clone **uma** vez; `server/`, `site/`, `client/`, `maps/` e `tools/` já vêm dentro.

## 1. Clone

```powershell
cd D:\Server
git clone https://github.com/nosleirabr/Oteserver7.4.git .
# ou, se a pasta ainda não existe:
# git clone https://github.com/nosleirabr/Oteserver7.4.git D:\Server
```

Se o mapa usa Git LFS:

```powershell
git lfs install
git lfs pull
```

```powershell
copy .env.template .env
# se não houver .env.template: copy .env.example .env
```

Skills do agente ficam em `.agents/skills/` (Antigravity) e `.cursor/skills/` (Cursor), **neste** repo — já vêm com o clone acima.

## 2. Brain

Learnings versionados: [`docs/learnings/`](learnings/index.md). Sem pasta home fora do Git.

## 3. Stack

```powershell
dotnet build tools\map-editor\Ot74.Map.Cli\Ot74.Map.Cli.csproj -nologo -v q
$otmap = 'tools\map-editor\Ot74.Map.Cli\bin\Debug\net10.0\otmap.dll'
dotnet exec $otmap build --from-source

docker compose up -d --build
```

Login de dev: account `1` / `admin123` / character `Admin`.

## 4. Viewer

```powershell
.\tools\map-editor\launch-map-viewer.ps1
```

Fluxo map-as-code: [`MAP_AS_CODE_FLOW.md`](MAP_AS_CODE_FLOW.md).
