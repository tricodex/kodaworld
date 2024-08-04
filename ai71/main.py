from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from .dialogue_management.manager import DialogueManager
from .ai71_api import AI71API
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your Next.js app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DialogueManager and AI71API
dialogue_manager = DialogueManager()
ai71_api = AI71API()

# Define Pydantic models for request bodies
class UserInput(BaseModel):
    message: str
    studentId: str

class CurriculumOptimizationRequest(BaseModel):
    currentCurriculum: Dict
    performanceData: Dict
    learningGoals: List[str]
    
@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the AI71 API"}

@app.post("/api/ai-tutor")
async def ai_tutor(request: UserInput):
    try:
        # Get conversation history
        history = await dialogue_manager.get_conversation_history(request.studentId)
        
        # Prepare context for AI
        context = [
            {"role": "system", "content": "You are an AI tutor specialized in helping students learn various subjects. Provide detailed and helpful responses."},
            *[{"role": "user" if msg["role"] == "user" else "assistant", "content": msg["content"]} for msg in history],
            {"role": "user", "content": request.message}
        ]
        
        # Generate AI response
        ai_response = ai71_api.generate_with_memory(request.message, model="falcon-180b", messages=context)
        
        # Save the interaction
        await dialogue_manager.process_user_input(request.message, request.studentId)
        await dialogue_manager.process_ai_response(ai_response, request.studentId)
        
        return {"response": ai_response}
    except Exception as e:
        logger.error(f"Error in AI tutor: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request")

@app.get("/api/conversation-history/{student_id}")
async def get_conversation_history(student_id: str):
    history = await dialogue_manager.get_conversation_history(student_id)
    return {"history": history}

@app.post("/api/clear-history/{student_id}")
async def clear_conversation_history(student_id: str):
    await dialogue_manager.clear_history(student_id)
    ai71_api.clear_memory()
    return {"message": "Conversation history cleared successfully"}

@app.post("/api/collect-feedback/{student_id}")
async def collect_student_feedback(student_id: str, feedback: str):
    await dialogue_manager.collect_feedback(student_id, feedback)
    return {"message": "Feedback collected successfully"}

@app.get("/api/learning-progress/{student_id}")
async def get_learning_progress(student_id: str):
    progress = await dialogue_manager.analyze_learning_progress(student_id)
    return {"progress": progress}

@app.get("/api/next-steps/{student_id}")
async def get_next_steps(student_id: str):
    next_steps = await dialogue_manager.recommend_next_steps(student_id)
    return {"nextSteps": next_steps}

@app.post("/api/optimize-curriculum")
async def optimize_curriculum(request: CurriculumOptimizationRequest):
    optimized = await dialogue_manager.optimize_curriculum(
        request.currentCurriculum,
        request.performanceData,
        request.learningGoals
    )
    return {"optimizedCurriculum": optimized}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)