from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import Optional
from utils.auth import get_current_user
from services.supabase_service import supabase
from models.schemas import ProfileUpdateRequest, ProfileResponse
import uuid

router = APIRouter(prefix="/api/auth", tags=["Auth & Profile"])

@router.post("/profile", response_model=ProfileResponse)
async def create_or_update_profile(
    request: ProfileUpdateRequest, 
    user_id: str = Depends(get_current_user)
):
    """
    Upsert the user profile.
    """
    profile_data = request.model_dump(exclude_unset=True)
    profile_data["id"] = user_id
    
    try:
        response = supabase.table("profiles").upsert(profile_data).execute()
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to update profile - no data returned")
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Database error during upsert: {str(e)}")

@router.get("/profile/{user_id}", response_model=ProfileResponse)
async def get_profile(user_id: str, current_user: str = Depends(get_current_user)):
    """
    Fetch a user profile by ID.
    """
    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Database error during fetch: {str(e)}")

@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    request: ProfileUpdateRequest, 
    user_id: str = Depends(get_current_user)
):
    """
    Update specific fields in the user profile.
    """
    update_data = request.model_dump(exclude_unset=True)
    
    try:
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Profile not found or no changes made")
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Database error during update: {str(e)}")

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    """
    Upload an avatar image to Supabase Storage and update the profile.
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP are allowed.")
    
    # Validate file size (2MB)
    MAX_SIZE = 2 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 2MB.")
    
    try:
        # Generate unique filename
        file_ext = file.filename.split(".")[-1]
        file_name = f"{user_id}/{uuid.uuid4()}.{file_ext}"
        
        # Upload to Supabase Storage
        # Note: 'avatars' bucket must exist and be public or have appropriate policies
        storage_response = supabase.storage.from_("avatars").upload(
            path=file_name,
            file=content,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_("avatars").get_public_url(file_name)
        
        # Update profile with new avatar URL
        supabase.table("profiles").update({"avatar_url": public_url}).eq("id", user_id).execute()
        
        return {"avatar_url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
