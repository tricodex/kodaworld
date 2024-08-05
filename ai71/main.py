# ai71/main.py

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from .dialogue_management.manager import DialogueManager
from .ai71_api import AI71API
from .database import SessionLocal, init_db, Curriculum
from .gamification.system import GamificationSystem
from .peer_matching.matcher import PeerMatcher
from .academica.environment_generator import Academica
import logging
import json

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

# Initialize components
dialogue_manager = DialogueManager()
ai71_api = AI71API()
gamification_system = GamificationSystem()
peer_matcher = PeerMatcher()
academica = Academica()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the database
init_db()

# Define Pydantic models for request bodies
class UserInput(BaseModel):
    message: str
    studentId: str
    systemPrompt: Optional[str] = None
    character: Optional[str] = None

class CurriculumOptimizationRequest(BaseModel):
    currentCurriculum: Dict
    performanceData: Dict
    learningGoals: List[str]

class PeerMatchingRequest(BaseModel):
    users: List[Dict]
    groupSize: int

class EnvironmentGenerationRequest(BaseModel):
    topic: str
    complexity: str

class StudentInteractionRequest(BaseModel):
    environment: Dict
    interaction: str

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the KodaWorld API"}

@app.post("/api/ai-tutor")
async def ai_tutor(request: UserInput):
    try:
        history = await dialogue_manager.get_conversation_history(request.studentId)
        
        context = [
            {"role": "system", "content": request.systemPrompt or "You are an AI tutor specialized in helping students learn various subjects. Provide detailed and helpful responses."},
            *[{"role": "user" if msg["role"] == "user" else "assistant", "content": msg["content"]} for msg in history],
            {"role": "user", "content": request.message}
        ]
        
        ai_response = await ai71_api.generate_with_memory(request.message, model="falcon-180b", messages=context)
        
        character_response = await dialogue_manager.process_ai_response(ai_response, request.studentId, request.character or "ai-tutor")
        await dialogue_manager.process_user_input(request.message, request.studentId, request.character or "ai-tutor")
        
        return {"response": character_response}
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
async def optimize_curriculum(request: CurriculumOptimizationRequest, db: Session = Depends(get_db)):
    optimized = await dialogue_manager.optimize_curriculum(
        "student_01",  # You might want to pass student_id in the request
        request.currentCurriculum,
        request.performanceData,
        request.learningGoals
    )
    
    db_curriculum = Curriculum(curriculum=json.dumps(optimized))
    db.add(db_curriculum)
    db.commit()
    db.refresh(db_curriculum)

    return {"optimizedCurriculum": optimized}

@app.get("/api/curriculum/{curriculum_id}")
async def get_curriculum(curriculum_id: str, db: Session = Depends(get_db)):
    if curriculum_id == 'latest':
        curriculum = db.query(Curriculum).order_by(Curriculum.id.desc()).first()
    else:
        curriculum = db.query(Curriculum).filter(Curriculum.id == curriculum_id).first()
    
    if not curriculum:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    
    return {"curriculum": json.loads(curriculum.curriculum)}

@app.post("/api/generate-achievements")
async def generate_achievements(curriculum: Dict):
    achievement_system = await gamification_system.generate_achievement_system(curriculum)
    return {"achievementSystem": achievement_system}

@app.post("/api/update-achievements/{student_id}")
async def update_achievements(student_id: str, progress: Dict[str, float], achievement_system: Dict):
    updates = await gamification_system.update_student_achievements(student_id, progress, achievement_system)
    return {"achievementUpdates": updates}

@app.post("/api/generate-challenges/{student_id}")
async def generate_challenges(student_id: str, progress: Dict[str, float], achievement_system: Dict):
    challenges = await gamification_system.generate_personalized_challenges(student_id, progress, achievement_system)
    return {"challenges": challenges}

@app.post("/api/calculate-engagement/{student_id}")
async def calculate_engagement(student_id: str, activity_log: List[Dict]):
    engagement_score = await gamification_system.calculate_engagement_score(student_id, activity_log)
    return {"engagementScore": engagement_score}

@app.post("/api/match-peers")
async def match_peers(request: PeerMatchingRequest):
    matches = await peer_matcher.find_optimal_matches(request.users, request.groupSize)
    return {"matches": matches}

@app.post("/api/generate-environment")
async def generate_environment(request: EnvironmentGenerationRequest):
    environment = await academica.generate_environment(request.topic, request.complexity)
    return {"environment": environment}

@app.post("/api/process-interaction")
async def process_interaction(request: StudentInteractionRequest):
    result = await academica.process_student_interaction(request.environment, request.interaction)
    return {"interactionResult": result}

@app.post("/api/generate-challenge")
async def generate_challenge(environment: Dict, difficulty: str):
    challenge = await academica.generate_challenge(environment, difficulty)
    return {"challenge": challenge}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)