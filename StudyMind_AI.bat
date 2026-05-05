@echo off
title StudyMind AI - Academic Intelligence Platform
color 0b

echo.
echo  ================================================
echo     🎓 StudyMind AI - Launching Platform
echo  ================================================
echo.

:: Start Backend in a new window
echo  [1/3] Initializing FastAPI Backend...
start "StudyMind Backend" /min cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

:: Start Frontend in a new window
echo  [2/3] Initializing Next.js Frontend...
start "StudyMind Frontend" /min cmd /k "cd studymind-frontend && npm run dev"

echo.
echo  [3/3] Waiting for platform to be ready...
echo.

:: Wait for services to start up (Next.js can take a few seconds)
timeout /t 5 /nobreak > nul

:: Open the website in the default browser
echo  🚀 Launching StudyMind AI Website...
start http://localhost:3000

echo.
echo  ------------------------------------------------
echo   ✅ SUCCESS: StudyMind AI is now live!
echo.
echo   - Backend:  http://localhost:8000
echo   - Frontend: http://localhost:3000
echo.
echo   (Keep this window open to monitor status, or close
echo    it once the browser has opened successfully.)
echo  ------------------------------------------------
echo.

:: Optional: Keep window open for a bit
timeout /t 10 /nobreak > nul
exit
