# ai71/models.py
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class User(BaseModel):
    id: str
    username: str
    email: str
    created_at: Optional[datetime] = None
    
# class AITutorRequest(BaseModel):
#     id: Optional[int] = None
#     username: Optional[str] = None
#     email: Optional[str] = None
#     message: str

# class AITutorRequest(BaseModel):
#     id: int
#     username: str
#     email: str
#     message: str

class AITutorRequest(BaseModel):
    id: str
    username: Optional[str] = None
    email: str
    message: str
    character: str
    systemPrompt: str

class UserProfileCreate(BaseModel):
    skills: Dict[str, float]
    learning_style: str
    interests: List[str]

class UserProfileResponse(UserProfileCreate):
    id: int
    user_id: int

class AchievementCreate(BaseModel):
    name: str
    description: str
    criteria: str
    points: int

class AchievementResponse(AchievementCreate):
    id: int

class UserAchievementResponse(BaseModel):
    id: int
    user_id: int
    achievement: AchievementResponse
    unlocked_at: datetime

class UserEngagementCreate(BaseModel):
    engagement_score: float

class UserEngagementResponse(UserEngagementCreate):
    id: int
    user_id: int
    timestamp: datetime

class RecommendationCreate(BaseModel):
    resource_title: str
    resource_url: str

class RecommendationResponse(RecommendationCreate):
    id: int
    user_id: int
    recommended_at: datetime

class CurriculumData(BaseModel):
    character: str
    subject: str
    units: List[str] = Field(min_items=1)
    difficulty: str = Field(pattern='^(Beginner|Intermediate|Advanced|beginner)$')

class PerformanceData(BaseModel):
    chapter: str
    score: float = Field(ge=0, le=1)
    
# class LearningGoal(BaseModel):
#     goal: str

class CurriculumOptimizationInput(BaseModel):
    current_curriculum: CurriculumData
    performance_data: List[PerformanceData]
    # learning_goals: List[LearningGoal] #List[str] = Field(min_items=1)

class UserProfile(BaseModel):
    id: int
    skills: Dict[str, float] = Field(...)  # Dict of skill names to proficiency levels (0-1)

class PeerMatchingRequest(BaseModel):
    users: List[UserProfile]
    group_size: int = Field(gt=0)

class EnvironmentGenerationRequest(BaseModel):
    topic: str
    complexity: str = Field(pattern='^(Beginner|Intermediate|Advanced)$')

class Environment(BaseModel):
    topic: str
    elements: List[str]
    complexity: str = Field(..., pattern='^(Beginner|Intermediate|Advanced)$')

class Challenge(BaseModel):
    description: str
    objectives: List[str]
    hints: List[str]
    solution: str
    
class ChallengeRequest(BaseModel):
    environment: Environment
    difficulty: str

class StudentInteractionRequest(BaseModel):
    environment: Environment
    interaction: str

class ChallengeGenerationRequest(BaseModel):
    environment: Environment
    difficulty: str = Field(pattern='^(Beginner|Intermediate|Advanced)$')
    
class ImageGenerationRequest(BaseModel):
    prompt: str
    size: str = Field(default="1024x1024", pattern="^(1024x1024)$")
    quality: str = Field(default="standard", pattern="^(standard)$")
    n: int = Field(default=1, gt=0, le=1)
    
class EnvironmentBase(BaseModel):
    topic: str
    complexity: str
    description: str
    elements: Dict[str, List[str]]

class EnvironmentCreate(EnvironmentBase):
    pass

class Environment(EnvironmentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # This replaces orm_mode=True in Pydantic v2