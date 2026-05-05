import io
import re
from PyPDF2 import PdfReader

def extract_text(file_bytes: bytes) -> str:
    """
    Extract text from a PDF file provided as bytes.
    Includes cleaning and validation.
    """
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)
        
        full_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
        
        # Clean the text
        # Remove excessive whitespace
        full_text = re.sub(r'\s+', ' ', full_text).strip()
        
        # Basic character cleaning
        full_text = full_text.encode('ascii', 'ignore').decode('ascii')
        
        # Validation for scanned/image-based PDFs
        if len(full_text) < 100:
            raise ValueError("PDF appears to be scanned or image-based. Could not extract sufficient text.")
            
        # Truncate if too long (to stay within AI token limits)
        MAX_CHARS = 50000
        if len(full_text) > MAX_CHARS:
            full_text = full_text[:MAX_CHARS] + "..."
            
        return full_text
        
    except Exception as e:
        if isinstance(e, ValueError):
            raise e
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")

def get_page_count(file_bytes: bytes) -> int:
    """
    Get the number of pages in a PDF file provided as bytes.
    """
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)
        return len(reader.pages)
    except Exception as e:
        raise ValueError(f"Failed to get page count from PDF: {str(e)}")
