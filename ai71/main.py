# main.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from .dialogue_management.manager import DialogueManager
from .curriculum_optimization.optimizer import CurriculumOptimizer
from .gamification.system import GamificationSystem
from .peer_matching.matcher import PeerMatcher
from .scientific_simulation.simulator import ScientificSimulator
from .ai71_api import AI71API
import os

app = FastAPI(title="KodaWorld API", description="Backend API for KodaWorld educational platform")

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize components
dialogue_manager = DialogueManager()
curriculum_optimizer = CurriculumOptimizer()
gamification_system = GamificationSystem()
peer_matcher = PeerMatcher()
scientific_simulator = ScientificSimulator()
ai71_api = AI71API()

# Dependency to get AI71API instance
def get_ai71_api():
    return ai71_api

# Pydantic models for request bodies
class TutorRequest(BaseModel):
    message: str
    studentId: str

class CurriculumOptimizationRequest(BaseModel):
    currentCurriculum: Dict
    performanceData: Dict
    learningGoals: List[str]

class AchievementSystemRequest(BaseModel):
    curriculum: Dict

class PeerMatchingRequest(BaseModel):
    users: List[Dict]
    groupSize: int

class SimulationRequest(BaseModel):
    topic: str
    complexity: str

@app.post("/api/ai-tutor")
async def ai_tutor(request: TutorRequest):
    try:
        response = await dialogue_manager.process_user_input(request.message, request.studentId)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/optimize-curriculum")
async def optimize_curriculum(request: CurriculumOptimizationRequest):
    try:
        optimized = await curriculum_optimizer.optimize_curriculum(
            request.currentCurriculum,
            request.performanceData,
            request.learningGoals
        )
        return {"optimizedCurriculum": optimized}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-achievement-system")
async def generate_achievement_system(request: AchievementSystemRequest):
    try:
        achievement_system = await gamification_system.generate_achievement_system(request.curriculum)
        return {"achievementSystem": achievement_system}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/match-peers")
async def match_peers(request: PeerMatchingRequest):
    try:
        matches = await peer_matcher.find_optimal_matches(request.users, request.groupSize)
        return {"peerMatches": matches}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-simulation")
async def generate_simulation(request: SimulationRequest):
    try:
        simulation = await scientific_simulator.generate_simulation(request.topic, request.complexity)
        return {"simulation": simulation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/conversation-history/{student_id}")
async def get_conversation_history(student_id: str):
    try:
        history = await dialogue_manager.get_conversation_history(student_id)
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/clear-history/{student_id}")
async def clear_conversation_history(student_id: str):
    try:
        await dialogue_manager.clear_history(student_id)
        return {"message": "Conversation history cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/collect-feedback/{student_id}")
async def collect_student_feedback(student_id: str, feedback: str):
    try:
        await dialogue_manager.collect_feedback(student_id, feedback)
        return {"message": "Feedback collected successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/learning-progress/{student_id}")
async def get_learning_progress(student_id: str):
    try:
        progress = await dialogue_manager.analyze_learning_progress(student_id)
        return {"progress": progress}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/next-steps/{student_id}")
async def get_next_steps(student_id: str):
    try:
        next_steps = await dialogue_manager.recommend_next_steps(student_id)
        return {"nextSteps": next_steps}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)