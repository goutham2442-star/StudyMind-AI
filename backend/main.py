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

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: test Supabase + Gemini connections
@app.on_event("startup")
async def startup_event():
    print("\n" + "="*50)
    print("🚀 StudyMind AI API is starting...")
    print("="*50)
    
    from services.supabase_service import supabase, SUPABASE_URL
    from services.gemini_service import model, GEMINI_API_KEY
    
    if supabase:
        print(f"✅ Supabase: Connected to {SUPABASE_URL}")
    else:
        print("❌ Supabase: MISSING CONFIGURATION (Check .env)")
        
    if model:
        print("✅ Gemini: AI Model Initialized")
    else:
        print("❌ Gemini: MISSING API KEY (Check .env)")
        
    print("="*50 + "\n")

# Include routers
app.include_router(auth.router)
app.include_router(papers.router)
app.include_router(chat.router)
app.include_router(stats.router)

# Global Error Handlers
@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"message": "Resource not found", "path": request.url.path}
    )

@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal server error", "detail": str(exc)}
    )

@app.get("/health")
async def health_check():
    from services.supabase_service import supabase
    from services.gemini_service import model
    
    return {
        "status": "online",
        "timestamp": time.time(),
        "version": "1.0.0",
        "service": "StudyMind AI API",
        "integrations": {
            "supabase": "connected" if supabase else "missing_config",
            "gemini": "connected" if model else "missing_config"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
