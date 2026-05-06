from fastapi import APIRouter, Depends, HTTPException
from typing import List, Any, Dict
from utils.auth import get_current_user
from services.supabase_service import supabase
from models.schemas import DashboardStatsResponse, UserStatsResponse
from datetime import datetime, timedelta
import asyncio

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

@router.get("/dashboard/{user_id}", response_model=DashboardStatsResponse)
async def get_dashboard_stats(user_id: str, current_user: str = Depends(get_current_user)):
    """
    Get aggregated stats for the user dashboard.
    """
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        # 1. Fetch Profile (streak, total_questions)
        profile_res = supabase.table("profiles").select("*").eq("id", user_id).execute()
        profile = profile_res.data[0] if profile_res.data else {}
        
        # 2. Count total papers
        papers_count_res = supabase.table("papers").select("id", count="exact").eq("user_id", user_id).execute()
        papers_count = papers_count_res.count if papers_count_res.count is not None else 0
        
        # 3. Count total sessions
        sessions_count_res = supabase.table("chat_sessions").select("id", count="exact").eq("user_id", user_id).execute()
        sessions_count = sessions_count_res.count if sessions_count_res.count is not None else 0
        
        # 4. Recent papers (last 5)
        recent_papers_res = supabase.table("papers") \
            .select("id, title, subject, created_at, page_count") \
            .eq("user_id", user_id) \
            .order("created_at", descending=True) \
            .limit(5) \
            .execute()
        recent_papers = recent_papers_res.data or []
            
        # 5. Recent sessions (last 3)
        recent_sessions_res = supabase.table("chat_sessions") \
            .select("id, title, paper_id, updated_at, message_count, papers(title)") \
            .eq("user_id", user_id) \
            .order("updated_at", descending=True) \
            .limit(3) \
            .execute()
        recent_sessions = recent_sessions_res.data or []

        # 6. Activity (last 14 days)
        fourteen_days_ago = (datetime.now() - timedelta(days=14)).isoformat()
        activity_res = supabase.table("messages") \
            .select("created_at, chat_sessions!inner(user_id)") \
            .eq("chat_sessions.user_id", user_id) \
            .eq("role", "user") \
            .gte("created_at", fourteen_days_ago) \
            .execute()
        messages = activity_res.data or []

        # Process Activity
        activity_map = { (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d'): 0 for i in range(14) }
        for msg in messages:
            date = msg['created_at'][:10]
            if date in activity_map:
                activity_map[date] += 1
        
        activity = [{"date": k, "count": v} for k, v in sorted(activity_map.items())]

        # Process Top Subjects
        subject_res = supabase.table("papers").select("subject").eq("user_id", user_id).execute()
        subjects = {}
        for p in (subject_res.data or []):
            s = p.get('subject', 'Unknown')
            subjects[s] = subjects.get(s, 0) + 1
        
        top_subjects = [{"subject": k, "count": v} for k, v in sorted(subjects.items(), key=lambda x: x[1], reverse=True)[:3]]

        return {
            "total_papers": papers_count,
            "total_questions": profile.get("total_questions", 0),
            "total_sessions": sessions_count,
            "study_streak": profile.get("study_streak", 0),
            "recent_papers": recent_papers,
            "recent_sessions": recent_sessions,
            "activity": activity,
            "top_subjects": top_subjects
        }

    except Exception as e:
        print(f"Error in dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve dashboard statistics")

@router.get("/user/{user_id}", response_model=UserStatsResponse)
async def get_user_detailed_stats(user_id: str, current_user: str = Depends(get_current_user)):
    """
    Get detailed analytical stats for the settings page.
    """
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        # 1. Profile for member since
        profile_res = supabase.table("profiles").select("created_at").eq("id", user_id).single().execute()
        profile = profile_res.data
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found. Please complete your profile setup.")
        
        # 2. Papers by subject (Full list)
        papers_res = supabase.table("papers").select("subject, created_at").eq("user_id", user_id).execute()
        papers = papers_res.data or []
        subjects_map = {}
        for p in papers:
            s = p['subject']
            subjects_map[s] = subjects_map.get(s, 0) + 1
        papers_by_subject = [{"subject": k, "count": v} for k, v in subjects_map.items()]

        # 3. Monthly uploads (Last 6 months)
        six_months_ago = (datetime.now() - timedelta(days=180))
        monthly_map = {}
        for i in range(6):
            month_key = (datetime.now() - timedelta(days=i*30)).strftime('%Y-%m')
            monthly_map[month_key] = 0
            
        for p in papers:
            month_key = p['created_at'][:7]
            if month_key in monthly_map:
                monthly_map[month_key] += 1
        monthly_uploads = [{"month": k, "count": v} for k, v in sorted(monthly_map.items())]

        # 4. Daily activity (Last 30 days)
        thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
        messages_res = supabase.table("messages") \
            .select("created_at, chat_sessions!inner(user_id)") \
            .eq("chat_sessions.user_id", user_id) \
            .eq("role", "user") \
            .gte("created_at", thirty_days_ago) \
            .execute()
        messages = messages_res.data or []
            
        daily_map = {}
        for i in range(30):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            daily_map[date] = 0
        for m in messages:
            date = m['created_at'][:10]
            if date in daily_map:
                daily_map[date] += 1
        daily_activity = [{"date": k, "count": v} for k, v in sorted(daily_map.items())]

        # 5. Total saved questions
        saved_count = supabase.table("saved_questions").select("id", count="exact").eq("user_id", user_id).execute().count
        
        # 6. Days active (Distinct days with messages)
        all_user_messages_res = supabase.table("messages") \
            .select("created_at, chat_sessions!inner(user_id)") \
            .eq("chat_sessions.user_id", user_id) \
            .execute()
        all_user_messages = all_user_messages_res.data or []
        active_days = len(set(m['created_at'][:10] for m in all_user_messages))

        return {
            "papers_by_subject": papers_by_subject,
            "monthly_uploads": monthly_uploads,
            "daily_activity": daily_activity,
            "total_saved_questions": saved_count or 0,
            "days_active": active_days,
            "member_since": profile.get('created_at', datetime.now())
        }

    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Stats retrieval error: {str(e)}")
