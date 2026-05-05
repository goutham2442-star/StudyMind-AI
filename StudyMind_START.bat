@echo off
setlocal enabledelayedexpansion

title StudyMind AI - Startup Diagnostic
mode con: cols=100 lines=30
color 0b

echo.
echo  ======================================================================
echo     🎓 StudyMind AI - Startup Diagnostic
echo  ======================================================================
echo.

:: 1. Check Files
echo  [*] Checking configurations...
if not exist "studymind-frontend\.env.local" (
    echo  [!] ERROR: studymind-frontend\.env.local is missing!
    echo      Please create it before starting.
    pause
    exit /b
)

:: 2. Launching Services
echo.
echo  [1/2] Starting Backend...
:: Using 'start' without /min so you can see if the backend crashes
start "StudyMind Backend" cmd /k "cd backend && python main.py"

echo  [2/2] Starting Frontend...
:: Using 'start' without /min so you can see if the frontend crashes
start "StudyMind Frontend" cmd /k "cd studymind-frontend && npm run dev"

echo.
echo  [*] Launching Browser in 5 seconds...
timeout /t 5

:: Try to open browser
explorer "http://localhost:3000"

echo.
echo  ----------------------------------------------------------------------
echo   ✅ System should be opening in your browser now.
echo   If not, manually go to: http://localhost:3000
echo  ----------------------------------------------------------------------
echo.
echo   NOTE: Keep the other two terminal windows open!
echo.
pause
