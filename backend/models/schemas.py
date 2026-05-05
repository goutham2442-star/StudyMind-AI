from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

# Paper Schemas
class PaperBase(BaseModel):
    title: str
    subject: str
    exam_year: Optional[int] = None
    is_public: bool = True

class PaperUploadRequest(PaperBase):
    pass

class PaperResponse(PaperBase):
    id: str
    user_id: str
    file_url: str
    created_at: datetime
    view_count: int
    page_count: int
    summary: Optional[str] = None
    key_topics: List[Any] = []
    
    class Config:
        from_attributes = True

class PaperListResponse(BaseModel):
    papers: List[PaperResponse]
    total: int

# Chat Schemas
class ChatMessageRequest(BaseModel):
    session_id: str
    content: str

class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

class SessionCreateRequest(BaseModel):
    paper_id: str
    title: Optional[str] = None

class SessionResponse(BaseModel):
    id: str
    user_id: str
    paper_id: str
    title: Optional[str] = None
    message_count: int
    created_at: datetime
    updated_at: datetime

# Profile Schemas
class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    university: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[int] = Field(None, ge=1, le=6)
    avatar_url: Optional[str] = None

class ProfileResponse(BaseModel):
    id: str
    full_name: str
    university: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[int] = None
    avatar_url: Optional[str] = None
    total_papers: int
    total_questions: int
    study_streak: int
    last_active: Optional[datetime] = None
    created_at: datetime

# Stats Schemas
class StatsResponse(BaseModel):
    total_study_hours: float
    notes_created: int
    ai_insights: int
    mastery_score: float
    upcoming_exams: List[dict]
