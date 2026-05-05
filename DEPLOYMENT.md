# 🚀 StudyMind AI Deployment Guide

Follow these steps to deploy the StudyMind AI platform to production.

---

## 1. Supabase Setup (Database & Auth)

1.  **Authentication**:
    *   Go to **Authentication > Providers** in your Supabase Dashboard.
    *   Enable **Email** (Confirm Email: On).
    *   Enable **Google OAuth** (Optional but recommended).
    *   Add Redirect URL: `https://your-app-name.vercel.app/auth/callback`.

2.  **Storage**:
    *   Create a bucket named `papers`.
    *   Make it **Public**.
    *   Create a bucket named `avatars`.
    *   Make it **Public**.

3.  **Database RLS**:
    *   Ensure Row Level Security is enabled on `profiles`, `papers`, `chat_sessions`, and `messages` tables.
    *   Add policies allowing users to read/write their own data (`auth.uid() = user_id`).

---

## 2. Backend Deployment (Render)

1.  **Create New Web Service**:
    *   Connect your GitHub repository.
    *   Render will automatically detect `backend/render.yaml`.
2.  **Environment Variables**:
    *   `SUPABASE_URL`: Your Supabase project URL.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Secret service key (Backend only!).
    *   `SUPABASE_JWT_SECRET`: Found in Project Settings > API.
    *   `GEMINI_API_KEY`: Your Google AI API key.
    *   `ALLOWED_ORIGINS`: `https://your-app-name.vercel.app`.
3.  **Health Check**:
    *   Set Health Check Path to `/health`.

---

## 3. Frontend Deployment (Vercel)

1.  **Import Project**:
    *   Select the `studymind-frontend` directory as the root.
    *   Framework: **Next.js**.
2.  **Environment Variables**:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
    *   `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://studymind-api.onrender.com`).
    *   `NEXTAUTH_SECRET`: Generate a 32-character random string.
3.  **Deploy**:
    *   Hit Deploy! Vercel will build and host your Next.js app.

---

## ✅ Post-Deployment Checklist

- [ ] All environment variables verified.
- [ ] Supabase storage buckets are public.
- [ ] OAuth redirect URLs match the Vercel domain.
- [ ] CORS on Render allows the Vercel domain.
- [ ] Test the full flow: Register → Upload PDF → AI Analysis → Chat.
