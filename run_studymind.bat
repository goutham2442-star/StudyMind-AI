@echo off
title StudyMind AI - Universal Launcher
color 0b

echo.
echo  ================================================
echo     🚀 StudyMind AI - Academic Intelligence
echo  ================================================
echo.
echo  Starting local development environment...
echo.

:: Start Backend in a new window
echo  [1/2] Starting FastAPI Backend on http://localhost:8000...
start "StudyMind Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

:: Wait for backend to initialize
timeout /t 3 /nobreak > nul

:: Start Frontend in a new window
echo  [2/2] Starting Next.js Frontend on http://localhost:3000...
start "StudyMind Frontend" cmd /k "cd studymind-frontend && npm run dev"

echo.
echo  ------------------------------------------------
echo   ✅ Success! StudyMind AI is running.
echo.
echo   - Backend:  http://localhost:8000
echo   - Frontend: http://localhost:3000
echo.
echo   Close this window to stop the status monitor.
echo   (Keep the other two windows open for the apps)
echo  ------------------------------------------------
echo.
pause
