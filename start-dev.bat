@echo off
:: Setzt die Zeichenkodierung auf UTF-8 für die Emojis
chcp 65001 >nul

:: Ändert den Fenstertitel und die Farbe (0B = Schwarz/Türkis)
title BenSim Soundboard - Host System
color 0B

echo ========================================================
echo       🎙️ BENSIM SOUNDBOARD - SYSTEM START
echo ========================================================
echo.

echo [1/3] Bereite Frontend vor (Kompilierung)...
:: Wechselt in den Frontend-Ordner, baut die App neu und geht zurück. 
:: (So vergisst du nie wieder den Build-Schritt!)
cd frontend
call npm run build
cd ..

echo.
echo [2/3] Plane UI-Start...
:: Startet einen unsichtbaren Timer (3 Sek), der dann Chrome im "App-Modus" öffnet.
:: Im App-Modus fehlen die URL-Leiste und Tabs - es sieht aus wie ein echtes Programm.
start "" /B cmd /c "timeout /t 3 >nul && start chrome --app=http://localhost:8080"

echo.
echo [3/3] Starte Backend...
echo.
:: Wechselt in den Backend-Ordner und startet den Server. 
:: Das Terminal bleibt offen, damit du QR-Code und Logs siehst.
cd backend
node index.js