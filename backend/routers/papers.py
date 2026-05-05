import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status, Request
from utils.auth import get_current_user, get_optional_user
from utils.security import sanitize_text, validate_pdf_content, validate_exam_year, check_ownership, validate_uuid
from utils.rate_limiter import limiter
from services.supabase_service import supabase
from services.pdf_service import extract_text, get_page_count
from services.gemini_service import analyze_paper
from models.schemas import PaperResponse, PaperListResponse
import re

router = APIRouter(prefix="/api/papers", tags=["Papers"])

def sanitize_filename(filename: str) -> str:
    """Basic filename sanitization."""
    return re.sub(r'[^a-zA-Z0-9._-]', '_', filename)

@router.post("/upload", response_model=PaperResponse)
@limiter.limit("5/minute")
async def upload_paper(
    request: Request,
    file: UploadFile = File(...),
    title: str = Form(...),
    subject: str = Form(...),
    year: Optional[int] = Form(None),
    is_public: bool = Form(True),
    tags: Optional[str] = Form(None),
    current_user_id: str = Depends(get_current_user)
):
    """
    Upload a PDF paper, extract text, analyze with AI, and save to DB.
    """
    # 1. Validation
    file_bytes = await file.read()
    
    # Verify magic bytes for PDF
    validate_pdf_content(file_bytes)
    
    # Check file size (20MB)
    MAX_SIZE = 20 * 1024 * 1024
    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 20MB.")
    
    # Validate exam year
    if year:
        validate_exam_year(year)

    # Sanitize text inputs
    title = sanitize_text(title)
    subject = sanitize_text(subject)

    # Use the authenticated user ID
    user_id = current_user_id
    
    file_path = None
    try:
        # 2. PDF Processing
        page_count = get_page_count(file_bytes)
        try:
            extracted_text = extract_text(file_bytes)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

        # 3. Storage Upload
        unique_id = uuid.uuid4()
        safe_name = sanitize_filename(file.filename)
        filename = f"{unique_id}_{safe_name}"
        file_path = f"papers/{filename}"
        
        storage_response = supabase.storage.from_("papers").upload(
            path=file_path,
            file=file_bytes,
            file_options={"content-type": "application/pdf"}
        )
        
        public_url = supabase.storage.from_("papers").get_public_url(file_path)

        # 4. AI Analysis
        ai_analysis = await analyze_paper(extracted_text)
        
        # 5. Database Insertion
        tag_list = [t.strip() for t in tags.split(",")] if tags else []
        
        paper_data = {
            "user_id": user_id,
            "title": title,
            "subject": subject,
            "exam_year": year,
            "file_url": public_url,
            "file_path": file_path,
            "extracted_text": extracted_text,
            "summary": ai_analysis.get("summary"),
            "key_topics": ai_analysis.get("key_topics", []),
            "exam_questions": ai_analysis.get("exam_questions", []),
            "page_count": page_count,
            "is_public": is_public,
            "tags": tag_list
        }
        
        db_response = supabase.table("papers").insert(paper_data).execute()
        if not db_response.data or len(db_response.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to save paper record to database")
        
        # 6. Update Profile Stats
        try:
            profile_res = supabase.table("profiles").select("total_papers").eq("id", user_id).single().execute()
            if profile_res.data:
                new_count = (profile_res.data.get("total_papers") or 0) + 1
                supabase.table("profiles").update({"total_papers": new_count}).eq("id", user_id).execute()
        except Exception as profile_err:
            print(f"Stats update failed (non-critical): {profile_err}")
            # We don't fail the whole request if stats update fails

        return db_response.data[0]

    except Exception as e:
        # Cleanup storage if record wasn't saved
        if file_path:
            try:
                supabase.storage.from_("papers").remove([file_path])
            except:
                pass
        
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/library", response_model=PaperListResponse)
async def get_library(
    subject: Optional[str] = None,
    year: Optional[int] = None,
    search: Optional[str] = None,
    public_only: bool = True,
    user_id: Optional[str] = None,
    limit: int = Query(12, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user_id: Optional[str] = Depends(get_optional_user)
):
    """
    Search and filter papers in the library.
    """
    query = supabase.table("papers").select("*", count="exact")
    
    # 1. Privacy Filters
    if public_only or not current_user_id:
        query = query.eq("is_public", True)
    elif user_id:
        # Filter for specific user's papers (requires ownership check or public)
        if user_id == current_user_id:
            query = query.eq("user_id", user_id)
        else:
            query = query.eq("user_id", user_id).eq("is_public", True)
    
    # 2. Content Filters
    if subject:
        query = query.eq("subject", subject)
    if year:
        query = query.eq("exam_year", year)
    if search:
        query = query.ilike("title", f"%{search}%")
        
    # 3. Pagination & Ordering
    response = query.order("created_at", descending=True).range(offset, offset + limit - 1).execute()
    
    return {
        "papers": response.data,
        "total": response.count
    }

@router.get("/{paper_id}", response_model=PaperResponse)
async def get_paper(
    paper_id: str,
    current_user_id: Optional[str] = Depends(get_optional_user)
):
    """
    Get full details of a paper and increment view count.
    """
    try:
        response = supabase.table("papers").select("*").eq("id", paper_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Paper not found")
        
        paper = response.data
        
        # Privacy check
        if not paper["is_public"] and (not current_user_id or current_user_id != paper["user_id"]):
            raise HTTPException(status_code=403, detail="You do not have access to this private paper.")
        
        # Increment view count (fire and forget)
        supabase.table("papers").update({"view_count": paper["view_count"] + 1}).eq("id", paper_id).execute()
        
        return paper
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Paper retrieval error: {str(e)}")

@router.delete("/{paper_id}")
async def delete_paper(
    paper_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Delete a paper, its file from storage, and update user stats.
    """
    try:
        # Verify ownership
        response = supabase.table("papers").select("user_id", "file_path").eq("id", paper_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Paper not found")
        
        paper = response.data
        if paper["user_id"] != current_user_id:
            raise HTTPException(status_code=403, detail="You can only delete your own papers.")
        
        # 1. Delete from Storage
        supabase.storage.from_("papers").remove([paper["file_path"]])
        
        # 2. Delete from DB (cascades automatically based on schema)
        supabase.table("papers").delete().eq("id", paper_id).execute()
        
        # 3. Update Profile Stats
        try:
            profile_res = supabase.table("profiles").select("total_papers").eq("id", current_user_id).single().execute()
            if profile_res.data:
                new_count = max(0, (profile_res.data.get("total_papers") or 1) - 1)
                supabase.table("profiles").update({"total_papers": new_count}).eq("id", current_user_id).execute()
        except Exception as profile_err:
            print(f"Stats update failed (non-critical): {profile_err}")

        return {"success": True}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Paper deletion error: {str(e)}")
