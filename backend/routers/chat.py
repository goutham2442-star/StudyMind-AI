from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from typing import List, Optional
from backend.utils.auth import get_current_user
from backend.services.supabase_service import supabase
from backend.services.gemini_service import answer_question
from backend.models.schemas import (
    SessionCreateRequest, 
    SessionResponse, 
    ChatMessageRequest, 
    ChatMessageResponse,
    SavedQuestionRequest
)
from datetime import datetime
import json
import asyncio

router = APIRouter(prefix="/api/chat", tags=["Chat & Sessions"])

@router.post("/sessions", response_model=SessionResponse)
async def create_session(
    request: SessionCreateRequest, 
    user_id: str = Depends(get_current_user)
):
    """
    Create a new chat session for a paper.
    """
    title = request.title or f"Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"
    
    try:
        data = {
            "user_id": user_id,
            "paper_id": request.paper_id,
            "title": title,
            "message_count": 0
        }
        response = supabase.table("chat_sessions").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create session")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{paper_id}", response_model=List[SessionResponse])
async def get_sessions(
    paper_id: str, 
    user_id: Optional[str] = None,
    current_user_id: str = Depends(get_current_user)
):
    """
    List all chat sessions for a specific paper and user.
    """
    target_user = user_id or current_user_id
    
    try:
        response = supabase.table("chat_sessions") \
            .select("*") \
            .eq("paper_id", paper_id) \
            .eq("user_id", target_user) \
            .order("updated_at", descending=True) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/messages/{session_id}", response_model=List[ChatMessageResponse])
async def get_messages(
    session_id: str, 
    user_id: str = Depends(get_current_user)
):
    """
    Fetch message history for a specific session.
    """
    try:
        # Verify ownership
        session = supabase.table("chat_sessions").select("user_id").eq("id", session_id).single().execute()
        if not session.data or session.data["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
            
        response = supabase.table("messages") \
            .select("*") \
            .eq("session_id", session_id) \
            .order("created_at", ascending=True) \
            .execute()
        return response.data
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/message")
async def send_message(
    request: ChatMessageRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Handle chat messages with AI and return a streaming response.
    """
    # 1. Fetch paper content
    paper_res = supabase.table("papers").select("extracted_text").eq("id", request.paper_id).single().execute()
    if not paper_res.data:
        raise HTTPException(status_code=404, detail="Paper not found")
    extracted_text = paper_res.data["extracted_text"]

    # 2. Fetch last 10 messages for context
    history_res = supabase.table("messages") \
        .select("role", "content") \
        .eq("session_id", request.session_id) \
        .order("created_at", descending=True) \
        .limit(10) \
        .execute()
    
    # Reverse history to get ascending order for Gemini
    chat_history = history_res.data[::-1]

    # 3. Save user message immediately
    supabase.table("messages").insert({
        "session_id": request.session_id,
        "role": "user",
        "content": request.content
    }).execute()

    async def event_generator():
        full_ai_response = ""
        try:
            # Stream from Gemini
            async for chunk in answer_question(request.content, extracted_text, chat_history):
                # chunk is already SSE formatted from gemini_service
                if chunk.startswith("data: "):
                    # Extract the JSON string to collect full response
                    try:
                        content = json.loads(chunk[6:].strip())
                        if content != "[DONE]":
                            full_ai_response += content
                    except:
                        pass
                yield chunk

            # 4. Save AI response to DB after stream ends
            if full_ai_response:
                supabase.table("messages").insert({
                    "session_id": request.session_id,
                    "role": "assistant",
                    "content": full_ai_response
                }).execute()

                # 5. Update session stats
                session_res = supabase.table("chat_sessions").select("message_count").eq("id", request.session_id).single().execute()
                if session_res.data:
                    new_count = session_res.data["message_count"] + 2
                    supabase.table("chat_sessions").update({
                        "message_count": new_count,
                        "updated_at": datetime.now().isoformat()
                    }).eq("id", request.session_id).execute()

                # 6. Update user total questions stat
                profile_res = supabase.table("profiles").select("total_questions").eq("id", user_id).single().execute()
                if profile_res.data:
                    new_q_count = profile_res.data["total_questions"] + 1
                    supabase.table("profiles").update({"total_questions": new_q_count}).eq("id", user_id).execute()

        except Exception as e:
            error_msg = f"Error in streaming: {str(e)}"
            yield f"data: {json.dumps(error_msg)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.post("/save-question")
async def save_question(
    request: SavedQuestionRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Save a Q&A pair for later study.
    """
    try:
        data = {
            "user_id": user_id,
            "paper_id": request.paper_id,
            "question": request.question,
            "answer": request.answer
        }
        response = supabase.table("saved_questions").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/saved/{user_id}")
async def get_saved_questions(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Fetch all saved questions for a user, including paper metadata.
    """
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    try:
        # Fetch with paper join
        response = supabase.table("saved_questions") \
            .select("*, papers(title, subject)") \
            .eq("user_id", user_id) \
            .order("created_at", descending=True) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
