@echo off
setlocal enabledelayedexpansion

title StudyMind AI - Academic Intelligence Platform
mode con: cols=100 lines=30
color 0b

echo.
echo  ======================================================================
echo     🎓 StudyMind AI - High-Performance Academic Intelligence
echo  ======================================================================
echo.

:: 1. Check for Environment Files
echo  [*] Checking configurations...
if not exist "studymind-frontend\.env.local" (
    if exist "studymind-frontend\.env.local.example" (
        echo  [!] WARNING: studymind-frontend\.env.local is missing!
        echo      Creating it from template...
        copy "studymind-frontend\.env.local.example" "studymind-frontend\.env.local" >nul
        echo      PLEASE OPEN "studymind-frontend\.env.local" AND ADD YOUR KEYS!
    )
)

if not exist "backend\.env" (
    if exist "backend\.env.example" (
        echo  [!] WARNING: backend\.env is missing!
        echo      Creating it from template...
        copy "backend\.env.example" "backend\.env" >nul
        echo      PLEASE OPEN "backend\.env" AND ADD YOUR KEYS!
    )
)

:: 2. Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] ERROR: Python is not installed or not in PATH.
    pause
    exit /b
)

:: 3. Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] ERROR: Node.js is not installed or not in PATH.
    pause
    exit /b
)

echo.
echo  [1/3] Starting Backend (FastAPI)...
start "StudyMind Backend" /min cmd /k "cd backend && python main.py"

echo  [2/3] Starting Frontend (Next.js)...
start "StudyMind Frontend" /min cmd /k "cd studymind-frontend && npm run dev"

echo.
echo  [3/3] Waiting for services to initialize...
echo.

:: Countdown timer
for /l %%i in (5,-1,1) do (
    <nul set /p "=🚀 Launching in %%i... "
    timeout /t 1 /nobreak >nul
    echo.
)

:: Open the website
start http://localhost:3000

echo.
echo  ----------------------------------------------------------------------
echo   ✅ SUCCESS: StudyMind AI is running!
echo.
echo   - Local Dashboard: http://localhost:3000
echo   - API Documentation: http://localhost:8000/docs
echo.
echo   NOTE: If you see a "Configuration Error", make sure you have
echo         added your Supabase keys to the .env files.
echo  ----------------------------------------------------------------------
echo.

timeout /t 10 >nul
exit
