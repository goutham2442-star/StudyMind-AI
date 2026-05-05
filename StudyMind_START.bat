@echo off
setlocal enabledelayedexpansion

title StudyMind AI - Clean Start
mode con: cols=100 lines=35
color 0b

echo.
echo  ======================================================================
echo     🎓 StudyMind AI - System Optimization ^& Start
echo  ======================================================================
echo.

:: 1. Deep Cleanup
echo  [*] Performing deep cleanup of temporary files...
if exist "studymind-frontend\.next" (
    echo      - Removing Next.js cache...
    rmdir /s /q "studymind-frontend\.next"
)
for /d /r . %%d in (__pycache__) do @if exist "%%d" (
    echo      - Removing Python cache: %%d
    rmdir /s /q "%%d"
)
echo  [+] Cleanup complete!

echo.
echo  [*] Checking configurations...
if not exist "studymind-frontend\.env.local" (
    echo  [!] ERROR: studymind-frontend\.env.local is missing!
    pause
    exit /b
)

:: 2. Dependencies
echo.
echo  [*] Syncing dependencies...
cd backend && pip install -r requirements.txt >nul 2>&1 && cd ..
cd studymind-frontend && npm install >nul 2>&1 && cd ..

echo.
echo  [1/3] Launching Engine (Backend)...
start "StudyMind Backend" /min cmd /k "cd backend && python main.py"

echo  [2/3] Launching Interface (Frontend)...
start "StudyMind Frontend" /min cmd /k "cd studymind-frontend && npm run dev"

echo.
echo  [3/3] System check in progress...
for /l %%i in (5,-1,1) do (
    <nul set /p "=💎 Optimizing in %%i... "
    timeout /t 1 /nobreak >nul
    echo.
)

:: 3. Finalize
start http://localhost:3000

echo.
echo  ----------------------------------------------------------------------
echo   ✅ ALL SYSTEMS ONLINE
echo  ----------------------------------------------------------------------
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:8000
echo  ----------------------------------------------------------------------
echo.

timeout /t 5 >nul
exit
