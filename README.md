# StudyMind AI - SaaS AI Study Assistant

A premium AI-powered platform for university students to manage notes, chat with an AI tutor, and organize their academic life.

## Project Structure
- **/frontend**: React + Vite + TailwindCSS + Framer Motion
- **/backend**: FastAPI + Gemini AI + Supabase

## Setup Instructions

### Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file from `.env.example` and add your keys:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `GEMINI_API_KEY`
4. Run the server:
   ```bash
   python main.py
   ```

### Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example` and add your keys:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run the development server:
   ```bash
   npm run dev
   ```

## Key Features
- **AI Tutor**: Real-time academic help via Gemini 1.5 Flash.
- **Library**: Manage your uploaded study materials.
- **Upload**: Intelligent PDF processing (coming soon).
- **Planner**: AI-generated study schedules.
