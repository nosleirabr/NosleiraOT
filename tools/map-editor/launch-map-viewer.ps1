# Viewer web do mapa — workspace OpenTibia-740.
param(
	[switch]$All = $true,
	[string]$Region = '32369,32215,7',
	[string]$Size = '64,64',
	[string]$Otbm = 'maps/build/world.otbm',
	[int]$Port = 8765,
	[switch]$SkipBuild,
	[switch]$NoBrowser,
	[switch]$Quick
)

$ErrorActionPreference = 'Stop'

function Find-WorkspaceRoot([string]$Start) {
	$dir = Get-Item -LiteralPath $Start
	while ($dir) {
		$compose = Join-Path $dir.FullName 'docker-compose.yml'
		$maps = Join-Path $dir.FullName 'maps'
		if ((Test-Path -LiteralPath $compose) -and (Test-Path -LiteralPath $maps)) {
			return $dir.FullName
		}
		if (-not $dir.Parent) { break }
		$dir = $dir.Parent
	}
	throw "Workspace root not found (docker-compose.yml + maps/). Clone opentibia-740/workspace and siblings."
}

$Root = Find-WorkspaceRoot $PSScriptRoot
Set-Location $Root

$cliProj = Join-Path $Root 'tools\map-editor\Ot74.Map.Cli\Ot74.Map.Cli.csproj'
$otmapDll = Join-Path $Root 'tools\map-editor\Ot74.Map.Cli\bin\Debug\net10.0\otmap.dll'
$viewerDir = Join-Path $Root 'maps\build\viewer'
$otbmPath = Join-Path $Root ($Otbm -replace '/', '\')

if (-not (Test-Path -LiteralPath $otbmPath)) {
	Write-Error "Map missing: $otbmPath`nRun: dotnet exec ... build --from-source  OR  git -C maps lfs pull"
	exit 1
}

$dat = Join-Path $Root 'client\data\things\740\Tibia.dat'
$spr = Join-Path $Root 'client\data\things\740\Tibia.spr'
if (-not (Test-Path -LiteralPath $dat) -or -not (Test-Path -LiteralPath $spr)) {
	Write-Error "Client 7.4 assets missing under client\data\things\740\ (Tibia.dat / Tibia.spr)."
	exit 1
}

if (-not $SkipBuild -or -not (Test-Path -LiteralPath $otmapDll)) {
	Write-Host 'Building otmap...'
	dotnet build $cliProj -nologo -v q
	if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$metaPath = Join-Path $viewerDir 'meta.json'
$sectorsPath = Join-Path $viewerDir 'sectors.json'
$hasData = (Test-Path -LiteralPath $metaPath) -and (
	(Test-Path -LiteralPath $sectorsPath) -or (Test-Path -LiteralPath (Join-Path $viewerDir 'tiles.json'))
)

$viewerDataOk = $false
if ($hasData -and (Test-Path -LiteralPath $metaPath)) {
	try {
		$meta = Get-Content -LiteralPath $metaPath -Raw | ConvertFrom-Json
		$mode = [string]$meta.extra.mode
		$things = [int]$meta.clientThings
		if ($mode -eq 'sectors' -and $things -gt 500 -and (Test-Path -LiteralPath $sectorsPath)) {
			$viewerDataOk = $true
		} elseif ($mode -eq 'region' -and -not (Test-Path -LiteralPath $sectorsPath) -and $Quick) {
			$viewerDataOk = $true
		}
	} catch {
		$viewerDataOk = $false
	}
}

if ($SkipBuild -and $viewerDataOk) {
	Write-Host 'Reusing existing maps/build/viewer (SkipBuild).'
} elseif ($SkipBuild -and $hasData -and -not $viewerDataOk) {
	Write-Host 'SkipBuild ignored: viewer meta/sectors mismatch. Regenerating...'
	if ($Quick) {
		dotnet exec $otmapDll viewer-data --region $Region --size $Size --otbm $Otbm --out maps/build/viewer
		if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
	} else {
		dotnet exec $otmapDll viewer-data --all --otbm $Otbm --out maps/build/viewer
		if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
	}
} elseif ($Quick) {
	dotnet exec $otmapDll viewer-data --region $Region --size $Size --otbm $Otbm --out maps/build/viewer
	if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} else {
	dotnet exec $otmapDll viewer-data --all --otbm $Otbm --out maps/build/viewer
	if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (-not (Test-Path -LiteralPath (Join-Path $viewerDir 'index.html'))) {
	Write-Error "Viewer shell was not written to $viewerDir"
	exit 1
}

Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
	ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

$listener = [System.Net.HttpListener]::new()
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)
try {
	$listener.Start()
} catch {
	Write-Error "Could not bind $prefix. Try -Port 8766. $_"
	exit 1
}

Write-Host ""
Write-Host "Map viewer: $prefix"
Write-Host "Salvar grava YAML em maps/src/sectors (Ctrl+S). Ctrl+C para parar."
Write-Host ""

if (-not $NoBrowser) {
	Start-Process $prefix
}

$mime = @{
	'.html' = 'text/html; charset=utf-8'
	'.js'   = 'application/javascript; charset=utf-8'
	'.css'  = 'text/css; charset=utf-8'
	'.json' = 'application/json; charset=utf-8'
	'.png'  = 'image/png'
	'.ico'  = 'image/x-icon'
}

try {
	while ($listener.IsListening) {
		$ctx = $listener.GetContext()
		$method = $ctx.Request.HttpMethod
		$rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))

		if ($method -eq 'POST' -and $rel -eq 'api/save') {
			$reader = New-Object IO.StreamReader($ctx.Request.InputStream, $ctx.Request.ContentEncoding)
			$json = $reader.ReadToEnd()
			$reader.Close()
			$payloadPath = Join-Path $viewerDir 'pending-save.json'
			[IO.File]::WriteAllText($payloadPath, $json)
			$saveOut = & dotnet exec $otmapDll viewer-save --in $payloadPath --viewer $viewerDir --sectors maps/src/sectors 2>&1
			$ok = $LASTEXITCODE -eq 0
			$bodyObj = if ($ok) {
				@{ ok = $true; log = ($saveOut | Out-String).Trim(); sectors = 'maps/src/sectors' }
			} else {
				@{ ok = $false; error = ($saveOut | Out-String).Trim() }
			}
			$body = ($bodyObj | ConvertTo-Json -Compress)
			$bytes = [Text.Encoding]::UTF8.GetBytes($body)
			$ctx.Response.StatusCode = if ($ok) { 200 } else { 500 }
			$ctx.Response.ContentType = 'application/json; charset=utf-8'
			$ctx.Response.Headers['Cache-Control'] = 'no-cache'
			$ctx.Response.ContentLength64 = $bytes.Length
			$ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
			$ctx.Response.Close()
			continue
		}

		if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
		$path = [IO.Path]::GetFullPath((Join-Path $viewerDir $rel))
		$rootFull = [IO.Path]::GetFullPath($viewerDir)
		if (-not $path.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $path)) {
			$ctx.Response.StatusCode = 404
			$bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
			$ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
			$ctx.Response.Close()
			continue
		}

		$ext = [IO.Path]::GetExtension($path).ToLowerInvariant()
		$ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
		$ctx.Response.Headers['Cache-Control'] = 'no-cache'
		$bytes = [IO.File]::ReadAllBytes($path)
		$ctx.Response.ContentLength64 = $bytes.Length
		$ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
		$ctx.Response.Close()
	}
} finally {
	$listener.Stop()
	$listener.Close()
}
