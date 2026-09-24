@echo off
title NosleiraOT - Discord Bot 24/7
color 0A
echo ===================================================
echo   Iniciando NosleiraOT Discord Bot com Bun...
echo ===================================================

cd /d "d:\Server\discord-setup"

:loop
echo [%date% %time%] Iniciando bot.js...
bun run bot.js
echo [%date% %time%] Bot parou. Reiniciando em 3 segundos...
timeout /t 3 /nobreak >nul
goto loop
