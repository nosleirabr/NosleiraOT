@echo off
title AI Development Stack
echo ============================================
echo   AI Development Stack
echo ============================================
echo.
echo [1] Claude Code
echo [2] OmniRoute (AI Model Gateway - http://localhost:20128)
echo [3] Both (OmniRoute first, then Claude Code)
echo [0] Exit
echo.
set /p choice=Selecione uma opcao: 
if "%choice%"=="1" call "%~dp0ClaudeCode.bat"
if "%choice%"=="2" call "%~dp0OmniRoute.bat"
if "%choice%"=="3" (
    start "" "%~dp0OmniRoute.bat"
    timeout /t 3 /nobreak >nul
    call "%~dp0ClaudeCode.bat"
)
if "%choice%"=="0" exit
