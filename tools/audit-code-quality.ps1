# audit-code-quality.ps1
# Linter autogerado pelo Antigravity baseado no .agents/project_skillz.md e OWASP
$ErrorActionPreference = "Stop"

$ServerSrc = ".\server\src"
$ServerData = ".\server\data"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  AUDITORIA DE QUALIDADE E SEGURANÇA (AI)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Baseado em: project_skillz.md & otserver-74-fidelity`n"

$violations = 0

# 1. Checar OWASP: Concatenação de SQL perigosa em C++ (Risco de Injeção)
$sqlInjection = Select-String -Path "$ServerSrc\*.cpp" -Pattern '(?i)SELECT.*from.*\s*\+\s*' -ErrorAction SilentlyContinue
if ($sqlInjection) {
    Write-Host "[!] ALERTA CRÍTICO: Possível SQL Injection via concatenação de strings encontrado!" -ForegroundColor Red
    $violations++
} else {
    Write-Host "[x] OWASP SQLi: Nenhuma concatenação perigosa de SQL detectada no C++." -ForegroundColor Green
}

# 2. Checar Memory Leaks: Uso de 'new' puro em C++ ao invés de smart pointers
$rawPointers = Select-String -Path "$ServerSrc\*.cpp" -Pattern '\bnew \w+\(' -ErrorAction SilentlyContinue
if ($rawPointers -and $rawPointers.Count -gt 50) {
    Write-Host "[!] ALERTA MEMÓRIA: Múltiplos ponteiros puros ('new') detectados. Considere migrar para std::unique_ptr!" -ForegroundColor Yellow
    $violations++
} else {
    Write-Host "[x] C++ Memory: Uso controlado ou inexistente de ponteiros puros." -ForegroundColor Green
}

# 3. Checar Performance Lua: Loops infinitos bloqueantes
$badLoops = Select-String -Path "$ServerData\*.lua" -Pattern 'while true do' -ErrorAction SilentlyContinue
if ($badLoops) {
    Write-Host "[!] ALERTA PERFORMANCE: 'while true do' encontrado em Lua (Risco de travar a thread do servidor)!" -ForegroundColor Red
    $violations++
} else {
    Write-Host "[x] Lua Performance: Nenhum loop bloqueante malicioso encontrado." -ForegroundColor Green
}

Write-Host "`n=========================================" -ForegroundColor Cyan
if ($violations -eq 0) {
    Write-Host "STATUS: EXCELENTE. O código segue os padrões do AI Kit!" -ForegroundColor Green
} else {
    Write-Host "STATUS: ATENÇÃO. Regras do project_skillz.md foram violadas." -ForegroundColor Yellow
    Write-Host "Recomendação: Refatorar seguindo C++17 e Arquitetura orientada a Eventos." -ForegroundColor Yellow
}
