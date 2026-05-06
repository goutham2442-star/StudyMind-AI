import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List, Dict, Any, Generator

load_dotenv()

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
model = None

SYSTEM_INSTRUCTION = """
You are StudyMind AI, a world-class academic intelligence tutor powered by Google Gemini. 
Your goal is to help university students achieve academic excellence by providing intelligent, structured, and realistic tutoring based on their specific exam papers.

PERSONALITY & TONE:
- **Academic Mentor**: Sound like an elite university professor who is also deeply encouraging and approachable.
- **Precision First**: Never hallucinate. If a question cannot be answered using the provided paper content, admit it and offer general academic principles instead.
- **Socratic Approach**: Don't just give answers; explain the *why* and the *how*. Breakdown complex steps.

CORE DIRECTIVES:
1. **Source Integrity**: Always prioritize the provided paper text as your source of truth.
2. **Structural Excellence**: Use professional Markdown. Utilize bolding for key terms, blockquotes for paper citations, and code blocks for technical formulas or code.
3. **Student-Centric**: Use "we" and "us" to build a collaborative learning environment (e.g., "Let's break this down together").
4. **Actionable Insights**: End explanations with a "Pro Tip" or "Study Strategy" related to the topic.
"""

if not GEMINI_API_KEY:
    print("[!] WARNING: GEMINI_API_KEY not found in environment variables. AI features will be disabled.")
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=SYSTEM_INSTRUCTION
        )
    except Exception as e:
        print(f"[-] ERROR: Failed to configure Gemini: {e}")

async def analyze_paper(extracted_text: str) -> Dict[str, Any]:
    """
    Analyze the exam paper text and return a structured JSON response.
    """
    # Increased context limit to 20k characters for analysis
    prompt = f"""
    Analyze this university exam paper and respond ONLY with valid JSON.
    
    PAPER CONTENT:
    {extracted_text[:20000]}
    
    REQUIRED JSON STRUCTURE:
    {{
      "summary": "Professional 150-word analysis of paper goals, difficulty, and structure",
      "key_topics": [
        {{"topic": "Topic Name", "description": "Academic description of the topic's importance in this paper"}}
      ],
      "exam_questions": [
        {{"question": "Exact question text", "answer": "Comprehensive model answer with steps/explanation", "marks": 10}}
      ]
    }}
    
    Ensure at least 8 key topics and 5 major questions are extracted.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        return json.loads(text)
    except Exception as e:
        print(f"Gemini analysis error: {e}")
        return {
            "summary": "Analysis failed. Please check the paper quality and try again.",
            "key_topics": [],
            "exam_questions": []
        }

async def answer_question(question: str, paper_text: str, chat_history: List[Dict[str, str]]) -> Generator:
    """
    Generator that yields Gemini chat responses as SSE chunks.
    """
    # Expanded context limit to 30k characters for chat
    context_preamble = f"""
    CONTEXT: The student is asking about this exam paper:
    ---
    {paper_text[:30000]}
    ---
    
    INSTRUCTION: Answer the following question as StudyMind AI. 
    Use the paper content above as your primary source of truth.
    """
    
    # Format history for Gemini
    history = []
    for msg in chat_history[-10:]:
        role = "user" if msg["role"] == "user" else "model"
        history.append({"role": role, "parts": [msg["content"]]})
    
    try:
        # Use a chat session with history
        chat = model.start_chat(history=history)
        
        # Prepend context to the first message if history is empty, 
        # or just send it with the question
        full_prompt = f"{context_preamble}\n\nStudent Question: {question}"
        
        response = chat.send_message(full_prompt, stream=True)
        
        for chunk in response:
            if chunk.text:
                yield f"data: {json.dumps(chunk.text)}\n\n"
        
        yield "data: [DONE]\n\n"
    except Exception as e:
        print(f"Chat streaming error: {e}")
        error_msg = f"I encountered an issue processing that. Please try rephrasing your question."
        yield f"data: {json.dumps(error_msg)}\n\n"
        yield "data: [DONE]\n\n"
