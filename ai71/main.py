# main.py
from fastapi import FastAPI
from dialogue_management.manager import DialogueManager
from curriculum_optimization.optimizer import CurriculumOptimizer

app = FastAPI()
dialogue_manager = DialogueManager()
curriculum_optimizer = CurriculumOptimizer()

@app.post("/api/ai-tutor")
async def ai_tutor(request: dict):
    response = dialogue_manager.process_user_input(request['message'], request['studentId'])
    return {"response": response}

@app.post("/api/optimize-curriculum")
async def optimize_curriculum(request: dict):
    optimized = curriculum_optimizer.optimize_curriculum(
        request['currentCurriculum'],
        request['performanceData'],
        request['learningGoals']
    )
    return {"optimizedCurriculum": optimized}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 