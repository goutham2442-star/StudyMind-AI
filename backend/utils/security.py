import bleach
import magic
import uuid
from fastapi import HTTPException, status

def sanitize_text(text: str) -> str:
    if not text:
        return text
    # Strip all HTML tags
    return bleach.clean(text, tags=[], strip=True).strip()

def validate_uuid(id_str: str, name: str = "ID"):
    try:
        uuid.UUID(str(id_str))
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid {name} format"
        )

def validate_pdf_content(file_bytes: bytes):
    # Check magic bytes for PDF
    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(file_bytes)
    if file_type != 'application/pdf':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF is allowed."
        )

def validate_exam_year(year: int):
    if not (2010 <= year <= 2026):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exam year must be between 2010 and 2026"
        )

def check_ownership(resource_user_id: str, current_user_id: str):
    if str(resource_user_id) != str(current_user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource"
        )
