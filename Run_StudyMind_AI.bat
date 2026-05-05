@echo off
setlocal enabledelayedexpansion

title StudyMind AI - Academic Intelligence Platform
mode con: cols=80 lines=25
color 0b

echo.
echo  ============================================================
echo     🎓 StudyMind AI - Academic Intelligence Platform
echo  ============================================================
echo.

:: 1. Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Error: Python is not installed or not in PATH.
    pause
    exit /b
)

:: 2. Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Error: Node.js is not installed or not in PATH.
    pause
    exit /b
)

echo  [1/3] Starting Backend (FastAPI)...
start "StudyMind Backend" /min cmd /k "cd backend && python main.py"

echo  [2/3] Starting Frontend (Next.js)...
start "StudyMind Frontend" /min cmd /k "cd studymind-frontend && npm run dev"

echo.
echo  [3/3] Waiting for services to initialize...
echo.

:: Countdown timer
for /l %%i in (8,-1,1) do (
    <nul set /p "=🚀 Launching in %%i... "
    timeout /t 1 /nobreak >nul
    echo.
)

:: Open the website
start http://localhost:3000

echo.
echo  ------------------------------------------------------------
echo   ✅ SUCCESS: StudyMind AI is running!
echo.
echo   - Local Dashboard: http://localhost:3000
echo   - API Documentation: http://localhost:8000/docs
echo.
echo   Note: Keep the background windows open to maintain
echo         the server connection.
echo  ------------------------------------------------------------
echo.

timeout /t 5 >nul
exit
