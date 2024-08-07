# ai71/main.py

from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging
import logging.config
import json
import redis.asyncio as redis
from .dialogue_management.manager import DialogueManager
from .api import AI71API, OpenAIAPI
from .database import (
    SessionLocal, init_db, Curriculum, User, UserProfile, Achievement,
    UserAchievement, UserEngagement, Environment, Recommendation
)
from .gamification.system import GamificationSystem
from .peer_matching.matcher import PeerMatcher
from .academica.environment_generator import Academica
from .models import (
    CurriculumData, CurriculumOptimizationInput, ChallengeRequest,
    UserProfileCreate, UserProfileResponse, AchievementCreate,
    UserAchievementResponse, UserEngagementResponse,
    RecommendationCreate, RecommendationResponse, User as UserModel,
    PeerMatchingRequest, EnvironmentGenerationRequest, ImageGenerationRequest,
    EnvironmentCreate, Environment as EnvironmentModel, AITutorRequest
)
from .recommender_system.recommender import ResourceRecommender
from .element_lab.element_gen import JSElementGenerator
import uuid





# Set up logging
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "default",
            "filename": "kodaworld.log",
            "maxBytes": 10000000,  # 10MB
            "backupCount": 5,
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "file"],
    },
}

logging.config.dictConfig(log_config)
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
openai_api = OpenAIAPI()
gamification_system = GamificationSystem()
peer_matcher = PeerMatcher()
academica = Academica()
resource_recommender = ResourceRecommender()
element_generator = JSElementGenerator()

# Initialize rate limiting
@app.on_event("startup")
async def startup():
    redis_url = "redis://localhost:6379"
    r = await redis.from_url(redis_url, encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(r)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the database
init_db()

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the KodaWorld API"}

# @app.post("/api/ai-tutor")
# async def ai_tutor(request: AITutorRequest, db: Session = Depends(get_db)):
#     try:
#         user = None
#         if request.id:
#             user = db.query(User).filter(User.id == request.id).first()
        
#         if not user and request.email:
#             user = db.query(User).filter(User.email == request.email).first()
        
#         if not user:
#             # Create a temporary user or handle this case as needed
#             user_id = "temp_" + str(uuid.uuid4())
#         else:
#             user_id = str(user.id)

#         history = await dialogue_manager.get_conversation_history(user_id, request.username or "ai-tutor", db)
        
#         context = [
#             {"role": "system", "content": "You are an AI tutor specialized in helping students learn various subjects. Provide detailed and helpful responses."},
#             *[{"role": "user" if msg.is_user else "assistant", "content": msg.content} for msg in history],
#             {"role": "user", "content": request.message}
#         ]
        
#         ai_response = await ai71_api.generate_with_memory(request.message, model="falcon-180b", messages=context)
        
#         character_response = await dialogue_manager.process_ai_response(ai_response, user_id, request.username or "ai-tutor", db)
#         await dialogue_manager.process_user_input(request.message, user_id, request.username or "ai-tutor", db)
        
#         return {"response": character_response}
#     except Exception as e:
#         logger.error(f"Error in AI tutor: {str(e)}")
#         raise HTTPException(status_code=500, detail="An error occurred while processing your request")

@app.post("/api/ai-tutor")
async def ai_tutor(request: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    try:
        logger.info(f"Received AI tutor request: {request}")
        user = db.query(User).filter(User.id == request['id']).first()
        if not user:
            logger.warning(f"User not found: {request['id']}")
            raise HTTPException(status_code=404, detail="User not found")

        response = await ai71_api.generate_with_memory(request['message'], model="falcon-180b", messages=[])
        logger.info(f"Generated response: {response}")
        
        character_response = await dialogue_manager.process_ai_response(response, str(request['id']), request['username'])
        await dialogue_manager.process_user_input(request['message'], str(request['id']), request['username'])
        
        return {"response": character_response}
    except Exception as e:
        logger.error(f"Error in AI tutor: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred while processing your request: {str(e)}")

@app.get("/api/conversation-history/{student_id}/{character}")
async def get_conversation_history(student_id: str, character: str, db: Session = Depends(get_db)):
    history = await dialogue_manager.get_conversation_history(student_id, character)
    return {"history": history}

@app.post("/api/clear-history/{student_id}/{character}")
async def clear_conversation_history(student_id: str, character: str, db: Session = Depends(get_db)):
    await dialogue_manager.clear_history(student_id, character, db)
    await ai71_api.clear_memory()
    return {"message": "Conversation history cleared successfully"}

@app.post("/api/collect-feedback/{student_id}")
async def collect_student_feedback(student_id: str, feedback: str = Body(...), db: Session = Depends(get_db)):
    await dialogue_manager.collect_feedback(student_id, feedback, db)
    return {"message": "Feedback collected successfully"}

@app.get("/api/learning-progress/{student_id}")
async def get_learning_progress(student_id: str, db: Session = Depends(get_db)):
    progress = await dialogue_manager.analyze_learning_progress(student_id, db)
    return {"progress": progress}

@app.get("/api/next-steps/{student_id}")
async def get_next_steps(student_id: str, db: Session = Depends(get_db)):
    next_steps = await dialogue_manager.recommend_next_steps(student_id, db)
    return {"nextSteps": next_steps}

@app.post("/api/optimize-curriculum")
async def optimize_curriculum(request: CurriculumOptimizationInput, db: Session = Depends(get_db)):
    optimized = await dialogue_manager.optimize_curriculum(
        request.current_curriculum,
        request.performance_data,
        request.learning_goals,
        db
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
async def generate_achievements(curriculum: CurriculumData, db: Session = Depends(get_db)):
    achievement_system = await gamification_system.generate_achievement_system(curriculum.dict(), db)
    return {"achievementSystem": achievement_system}

@app.post("/api/update-achievements/{student_id}")
async def update_achievements(student_id: str, progress: Dict[str, float], db: Session = Depends(get_db)):
    updates = await gamification_system.update_student_achievements(student_id, progress, db)
    return {"achievementUpdates": updates}

@app.post("/api/generate-challenges/{student_id}")
async def generate_challenges(student_id: str, db: Session = Depends(get_db)):
    challenges = await gamification_system.generate_personalized_challenges(student_id, db)
    return {"challenges": challenges}

@app.post("/api/calculate-engagement/{student_id}")
async def calculate_engagement(student_id: str, activity_log: List[Dict], db: Session = Depends(get_db)):
    engagement_score = await gamification_system.calculate_engagement_score(student_id, activity_log, db)
    return {"engagementScore": engagement_score}

@app.post("/api/match-peers")
async def match_peers(request: PeerMatchingRequest, db: Session = Depends(get_db)):
    matches = await peer_matcher.find_optimal_matches(request.users, request.group_size, db)
    return {"matches": matches}

@app.post("/api/generate-environment")
async def generate_environment(request: EnvironmentGenerationRequest, db: Session = Depends(get_db)):
    environment = await academica.generate_environment(request.topic, request.complexity, db)
    return {"environment": environment}

@app.post("/api/generate-challenge")
async def generate_challenge(request: ChallengeRequest, db: Session = Depends(get_db)):
    try:
        challenge = await academica.generate_challenge(request.environment, request.difficulty, db)
        return {"challenge": challenge}
    except Exception as e:
        logger.error(f"Error generating challenge: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate challenge")

@app.post("/api/generate-image")
async def generate_image(request: ImageGenerationRequest):
    try:
        response = await openai_api.create_image(
            prompt=request.prompt,
            size=request.size,
            quality=request.quality,
            n=request.n
        )
        return response
    except Exception as e:
        logger.error(f"Error in image generation: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the image")

@app.post("/api/generate-environment-with-image")
async def generate_environment_with_image(request: EnvironmentGenerationRequest, db: Session = Depends(get_db)):
    try:
        environment = await academica.generate_environment(request.topic, request.complexity, db)
        
        image_prompt = f"An educational environment for {request.topic} at {request.complexity} level: {environment.description}"
        image_response = await openai_api.create_image(prompt=image_prompt)
        
        environment.image_url = image_response['data'][0]['url']
        db.add(environment)
        db.commit()
        return {"environment": environment}
    except Exception as e:
        logger.error(f"Error generating environment with image: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate environment with image")

@app.post("/api/generate-achievement-badge")
async def generate_achievement_badge(achievement: AchievementCreate, db: Session = Depends(get_db)):
    try:
        badge_prompt = f"An achievement badge for '{achievement.name}': {achievement.description}"
        badge_response = await openai_api.create_image(
            prompt=badge_prompt,
            size="1024x1024",
            quality="standard"
        )
        achievement_db = Achievement(**achievement.dict(), badge_url=badge_response['data'][0]['url'])
        db.add(achievement_db)
        db.commit()
        return {"badge_url": badge_response['data'][0]['url']}
    except Exception as e:
        logger.error(f"Error generating achievement badge: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate achievement badge")
    
@app.post("/api/recommend-resources")
async def api_recommend_resources(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not user_profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    recommendations = await resource_recommender.recommend_resources(user, user_profile, db)
    return {"resources": recommendations}

@app.post("/api/generate-element")
async def generate_element(element_type: str, params: Dict[str, Any]):
    if element_type == "button":
        return await element_generator.generate_button(**params)
    elif element_type == "card":
        return await element_generator.generate_card(**params)
    elif element_type == "modal":
        return await element_generator.generate_modal(**params)
    else:
        raise HTTPException(status_code=400, detail="Unsupported element type")

@app.post("/api/user")
async def create_user(user: UserModel, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/user/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/user-profile")
async def create_user_profile(profile: UserProfileCreate, db: Session = Depends(get_db)):
    db_profile = UserProfile(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return UserProfileResponse.from_orm(db_profile)

@app.get("/api/user-profile/{user_id}")
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    return UserProfileResponse.from_orm(profile)

@app.post("/api/user-engagement")
@app.get("/api/user-engagement/{user_id}")
async def get_user_engagement(user_id: int, db: Session = Depends(get_db)):
    engagements = db.query(UserEngagement).filter(UserEngagement.user_id == user_id).all()
    return [UserEngagementResponse.from_orm(engagement) for engagement in engagements]

@app.post("/api/user-achievement")
async def create_user_achievement(achievement: UserAchievementResponse, db: Session = Depends(get_db)):
    db_achievement = UserAchievement(**achievement.dict())
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return UserAchievementResponse.from_orm(db_achievement)

@app.get("/api/user-achievement/{user_id}")
async def get_user_achievements(user_id: int, db: Session = Depends(get_db)):
    achievements = db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    return [UserAchievementResponse.from_orm(achievement) for achievement in achievements]

@app.post("/api/recommendation")
async def create_recommendation(recommendation: RecommendationCreate, db: Session = Depends(get_db)):
    db_recommendation = Recommendation(**recommendation.dict())
    db.add(db_recommendation)
    db.commit()
    db.refresh(db_recommendation)
    return RecommendationResponse.from_orm(db_recommendation)

@app.get("/api/recommendation/{user_id}")
async def get_user_recommendations(user_id: int, db: Session = Depends(get_db)):
    recommendations = db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
    return [RecommendationResponse.from_orm(recommendation) for recommendation in recommendations]


@app.post("/api/environment", response_model=EnvironmentModel)
async def create_environment(environment: EnvironmentCreate, db: Session = Depends(get_db)):
    db_environment = Environment(**environment.dict())
    db.add(db_environment)
    db.commit()
    db.refresh(db_environment)
    return EnvironmentModel.from_orm(db_environment)

@app.get("/api/environment/{environment_id}")
async def get_environment(environment_id: int, db: Session = Depends(get_db)):
    environment = db.query(Environment).filter(Environment.id == environment_id).first()
    if not environment:
        raise HTTPException(status_code=404, detail="Environment not found")
    return environment

@app.put("/api/user/{user_id}")
async def update_user(user_id: int, user_update: UserModel, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/user/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.put("/api/user-profile/{user_id}")
async def update_user_profile(user_id: int, profile_update: UserProfileCreate, db: Session = Depends(get_db)):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    for key, value in profile_update.dict(exclude_unset=True).items():
        setattr(db_profile, key, value)
    
    db.commit()
    db.refresh(db_profile)
    return UserProfileResponse.from_orm(db_profile)

@app.delete("/api/user-profile/{user_id}")
async def delete_user_profile(user_id: int, db: Session = Depends(get_db)):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    db.delete(db_profile)
    db.commit()
    return {"message": "User profile deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)