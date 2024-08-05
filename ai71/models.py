from pydantic import BaseModel, Field
from typing import List, Dict

class CurriculumData(BaseModel):
    subject: str
    units: List[str] = Field(min_items=1)
    difficulty: str = Field(pattern='^(Beginner|Intermediate|Advanced)$')

class PerformanceData(BaseModel):
    chapter: str
    score: float = Field(ge=0, le=1)

class CurriculumOptimizationInput(BaseModel):
    current_curriculum: CurriculumData
    performance_data: List[PerformanceData]
    learning_goals: List[str] = Field(min_items=1)

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