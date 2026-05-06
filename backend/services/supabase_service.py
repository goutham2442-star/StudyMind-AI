import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# Initialize Supabase client
supabase = None

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("[!] WARNING: Supabase credentials missing from .env")
else:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        print("[+] Supabase client initialized")
    except Exception as e:
        print(f"[!] ERROR: Failed to initialize Supabase client: {e}")
