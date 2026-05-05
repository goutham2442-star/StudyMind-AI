from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from typing import List, Optional

router = APIRouter()

# Configure Gemini
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Gemini API not configured")
    
    try:
        # Construct chat history for Gemini
        history = []
        for msg in request.messages[:-1]:
            history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })
        
        chat = model.start_chat(history=history)
        last_message = request.messages[-1].content
        
        if request.context:
            prompt = f"Context: {request.context}\n\nUser Question: {last_message}"
        else:
            prompt = last_message
            
        response = chat.send_message(prompt)
        
        return {
            "role": "assistant",
            "content": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
