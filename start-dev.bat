@echo off
title BenSim Soundboard Server
echo =========================================
echo BenSim Soundboard wird gestartet...
echo =========================================

cd backend

:: Startet den Timer und danach Edge (mit korrekter Windows-Syntax)
start /b cmd /c timeout /t 2 ^>nul ^& start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:8080

node index.js