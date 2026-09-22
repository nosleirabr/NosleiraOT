@echo off
title Claude Code
SET PATH=%USERPROFILE%\.local\bin;%LOCALAPPDATA%\Programs\nodejs;%USERPROFILE%\.bun\bin;%PATH%
echo ============================================
echo   Claude Code - AI Coding Assistant
echo   Plugins: claude-mem, headroom, claude-setup
echo   Skills: task-observer
echo ============================================
echo.
claude %*
