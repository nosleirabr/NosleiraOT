# Bootstrap — OpenTibia-740 (multi-repo)

Clone o **workspace** e os siblings. Não há `bootstrap.ps1` — rode os comandos abaixo no PowerShell.

## 1. Clones

```powershell
cd C:\Projetos
git clone https://gitlab.com/opentibia-740/workspace.git opentibia-740
cd opentibia-740

git clone https://gitlab.com/opentibia-740/server.git server
git clone https://gitlab.com/opentibia-740/site.git site
git clone https://gitlab.com/opentibia-740/client.git client
git clone https://gitlab.com/opentibia-740/maps.git maps

# Tool: path GitLab = map_editor (underscore); pasta local = tools/map-editor
New-Item -ItemType Directory -Force -Path tools | Out-Null
git clone https://gitlab.com/opentibia-740/tools/map_editor.git tools/map-editor

New-Item -ItemType Directory -Force -Path infra | Out-Null
git clone https://gitlab.com/opentibia-740/infra/ci-templates.git infra/ci-templates

# AI kit — mesmo repo em .cursor (Cursor) e .agents (Antigravity)
git clone https://gitlab.com/opentibia-740/ai.git .cursor
git clone https://gitlab.com/opentibia-740/ai.git .agents

git -C maps lfs install
git -C maps lfs pull

copy .env.template .env
```

Atualizar skills depois:

```powershell
git -C .cursor pull
git -C .agents pull
```

## 2. Brain (local, ainda sem Git)

Opcional: copie learnings antigos para `brain/` na raiz do workspace (gitignored).

## 3. Stack

```powershell
# Bake do mapa a partir do YAML (obrigatório se build/world.otbm não veio via LFS)
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
