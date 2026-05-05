import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List, Dict, Any, Generator

load_dotenv()

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

# Use Gemini 1.5 Pro or Flash depending on requirements
# Pro is better for deep analysis, Flash is faster
model = genai.GenerativeModel('gemini-1.5-flash')

async def analyze_paper(extracted_text: str) -> Dict[str, Any]:
    """
    Analyze the exam paper text and return a structured JSON response.
    """
    prompt = f"""
    You are an academic analysis AI. Analyze this university exam paper and respond ONLY with valid JSON, no other text.
    
    Paper content:
    {extracted_text[:8000]}
    
    Respond with exactly this JSON structure:
    {{
      "summary": "150-word summary of the paper topics and structure",
      "key_topics": [
        {{"topic": "Topic Name", "description": "One sentence description"}},
        {{"topic": "Topic Name", "description": "One sentence description"}},
        {{"topic": "Topic Name", "description": "One sentence description"}},
        {{"topic": "Topic Name", "description": "One sentence description"}},
        {{"topic": "Topic Name", "description": "One sentence description"}},
        {{"topic": "Topic Name", "description": "One sentence description"}},
        {{"topic": "Topic Name", "description": "One sentence description"}},
        {{"topic": "Topic Name", "description": "One sentence description"}}
      ],
      "exam_questions": [
        {{"question": "Question text", "answer": "Detailed model answer", "marks": 10}},
        {{"question": "Question text", "answer": "Detailed model answer", "marks": 10}},
        {{"question": "Question text", "answer": "Detailed model answer", "marks": 10}},
        {{"question": "Question text", "answer": "Detailed model answer", "marks": 10}},
        {{"question": "Question text", "answer": "Detailed model answer", "marks": 10}}
      ]
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Handle potential markdown formatting in response
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        return json.loads(text)
    except Exception as e:
        print(f"Gemini analysis error: {e}")
        return {
            "summary": "Analysis failed. Please try again later.",
            "key_topics": [],
            "exam_questions": []
        }

async def answer_question(question: str, paper_text: str, chat_history: List[Dict[str, str]]) -> Generator:
    """
    Generator that yields Gemini chat responses as SSE chunks.
    """
    system_prompt = f"""
    You are StudyMind AI, an expert academic tutor. You help university students understand their exam papers.
    
    You have been given the full content of an exam paper. Answer the student's questions based on this paper.
    
    PAPER CONTENT:
    {paper_text[:15000]}
    
    GUIDELINES:
    - Answer specifically based on the paper content
    - For questions from the paper, provide detailed model answers with proper structure  
    - Use markdown formatting: **bold** for key terms, bullet points for lists
    - Be encouraging, clear, and educational
    - If asked to generate questions, number them clearly
    - Estimate marks allocation if paper shows marking scheme
    """
    
    # Build messages array from history
    messages = []
    # Add system context (Gemini doesn't have a direct 'system' role like OpenAI in simple API)
    # So we prepend it to the first message or use it as a preamble
    
    for msg in chat_history[-10:]:
        role = "user" if msg["role"] == "user" else "model"
        messages.append({"role": role, "parts": [msg["content"]]})
    
    # Prepend system prompt to the first user message if it exists, otherwise add it
    if not messages or messages[0]["role"] != "user":
        messages.insert(0, {"role": "user", "parts": [f"{system_prompt}\n\nStudent: {question}"]})
    else:
        # Prepend to the first message's content
        messages[0]["parts"][0] = f"{system_prompt}\n\n{messages[0]['parts'][0]}"
        messages.append({"role": "user", "parts": [question]})

    try:
        # Use streaming
        # Note: messages should be in format expected by start_chat
        chat = model.start_chat(history=messages[:-1])
        response = chat.send_message(messages[-1]["parts"][0], stream=True)
        
        for chunk in response:
            if chunk.text:
                # Yield as SSE format
                yield f"data: {json.dumps(chunk.text)}\n\n"
        
        yield "data: [DONE]\n\n"
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        yield f"data: {json.dumps(error_msg)}\n\n"
        yield "data: [DONE]\n\n"
