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
    print("🚀 Starting StudyMind AI API...")
    
    # Test Supabase
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        print("⚠️ Warning: Supabase credentials missing")
    else:
        try:
            create_client(supabase_url, supabase_key)
            print("✅ Supabase connection successful")
        except Exception as e:
            print(f"❌ Supabase connection failed: {e}")

    # Test Gemini
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("⚠️ Warning: Gemini API key missing")
    else:
        try:
            genai.configure(api_key=gemini_key)
            print("✅ Gemini API configured")
        except Exception as e:
            print(f"❌ Gemini configuration failed: {e}")

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
    return {
        "status": "online",
        "timestamp": time.time(),
        "version": "1.0.0",
        "service": "StudyMind AI API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
