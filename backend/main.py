from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import time
from routers import auth, papers, chat, stats
from utils.rate_limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from supabase import create_client
import google.generativeai as genai

load_dotenv()

# Rate limiter setup
app = FastAPI(
    title="StudyMind AI API",
    description="Backend API for StudyMind AI - Academic Intelligence Platform",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration with multi-origin support
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Startup event: test Supabase + Gemini connections
@app.on_event("startup")
async def startup_event():
    print("\n" + ">> " + "="*48)
    print("  StudyMind AI API | Professional Academic Intelligence")
    print("  " + "="*48)
    
    from services.supabase_service import supabase, SUPABASE_URL
    from services.gemini_service import model
    
    status_msg = []
    
    if supabase:
        print(f"  [+] Supabase: Connected ({SUPABASE_URL})")
        status_msg.append("supabase_ok")
    else:
        print("  [!] Supabase: CRITICAL CONFIGURATION MISSING")
        status_msg.append("supabase_fail")
        
    if model:
        print("  [+] Gemini: AI Model Initialized (v1.5 Flash)")
        status_msg.append("gemini_ok")
    else:
        print("  [!] Gemini: AI MODEL UNAVAILABLE")
        status_msg.append("gemini_fail")
        
    print("  " + "="*48 + "\n")

# Include routers
app.include_router(auth.router)
app.include_router(papers.router)
app.include_router(chat.router)
app.include_router(stats.router)

# Global Error Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"🔥 UNHANDLED ERROR: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "A critical error occurred in the processing pipeline.",
            "type": type(exc).__name__
        }
    )

@app.get("/health")
async def health_check():
    from services.supabase_service import supabase
    from services.gemini_service import model
    
    return {
        "status": "operational",
        "timestamp": time.time(),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "services": {
            "database": "connected" if supabase else "error",
            "intelligence_engine": "ready" if model else "unavailable"
        },
        "version": "1.0.0-pro"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
