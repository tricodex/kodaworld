# ai71/dialogue_management/manager.py

from ai71_api import AI71API
from typing import List, Dict, Optional, Any, Union
import logging
import json
from datetime import datetime
import asyncio
import aiohttp
from dataclasses import dataclass, asdict
import hashlib
from langchain.schema import HumanMessage, SystemMessage, AIMessage

@dataclass
class StudentProfile:
    student_id: str
    learning_style: str
    progress: Dict[str, float]
    last_interaction: datetime
    feedback_history: List[Dict[str, str]]

class DialogueManager:
    def __init__(self, db_connection: Optional[Any] = None):
        self.ai_api = AI71API()
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.db = db_connection  # Ensure db_connection has methods get_profile and update_profile
        self.cache: Dict[str, str] = {}  # Simple in-memory cache with type annotation

    async def process_user_input(self, user_input: str, student_id: str) -> str:
        try:
            self.logger.info(f"Processing input for student {student_id}: {user_input}")
            
            # Check cache first
            cache_key = hashlib.md5(f"{student_id}:{user_input}".encode()).hexdigest()
            if cache_key in self.cache:
                self.logger.info(f"Cache hit for student {student_id}")
                return self.cache[cache_key]

            # Get student profile
            profile = await self.get_student_profile(student_id)
            
            # Prepare context with student profile
            context = f"Student ID: {profile.student_id}, Learning Style: {profile.learning_style}, Progress: {json.dumps(profile.progress)}"
            
            # Generate response
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI tutor."},
                {"role": "user", "content": f"{context}\n\nUser: {user_input}"}
            ])
            
            # Update cache
            self.cache[cache_key] = response['choices'][0]['message']['content']
            
            # Update student profile
            await self.update_student_profile(student_id, {"last_interaction": datetime.now().isoformat()})
            
            self.logger.info(f"Generated response for student {student_id}")
            return response['choices'][0]['message']['content']
        except aiohttp.ClientError as e:
            self.logger.error(f"Network error processing input for student {student_id}: {str(e)}")
            return "I'm having trouble connecting to my knowledge base. Please try again in a moment."
        except json.JSONDecodeError as e:
            self.logger.error(f"JSON parsing error for student {student_id}: {str(e)}")
            return "I'm having trouble understanding the information. Let's try a different approach."
        except Exception as e:
            self.logger.error(f"Unexpected error processing input for student {student_id}: {str(e)}")
            return "I'm sorry, I'm having trouble processing your request right now. Please try again later."

    async def get_conversation_history(self, student_id: str) -> List[Dict[str, str]]:
        try:
            history = [{"role": m.type, "content": m.content} for m in self.ai_api.get_conversation_history()]
            self.logger.info(f"Retrieved conversation history for student {student_id}")
            return history
        except Exception as e:
            self.logger.error(f"Error retrieving conversation history for student {student_id}: {str(e)}")
            return []

    async def clear_history(self, student_id: str):
        try:
            self.ai_api.clear_memory()
            self.logger.info(f"Cleared conversation history for student {student_id}")
        except Exception as e:
            self.logger.error(f"Error clearing conversation history for student {student_id}: {str(e)}")

    async def collect_feedback(self, student_id: str, feedback: str):
        try:
            self.logger.info(f"Collected feedback from student {student_id}: {feedback}")
            profile = await self.get_student_profile(student_id)
            profile.feedback_history.append({
                "timestamp": datetime.now().isoformat(),
                "feedback": feedback
            })
            await self.update_student_profile(student_id, asdict(profile))
        except Exception as e:
            self.logger.error(f"Error collecting feedback from student {student_id}: {str(e)}")

    async def get_student_profile(self, student_id: str) -> StudentProfile:
        try:
            if self.db:
                profile_data = await self.db.get_profile(student_id)
            else:
                profile_data = {
                    "student_id": student_id,
                    "learning_style": "visual",
                    "progress": {},
                    "last_interaction": datetime.now().isoformat(),
                    "feedback_history": []
                }
            return StudentProfile(**profile_data)
        except Exception as e:
            self.logger.error(f"Error retrieving profile for student {student_id}: {str(e)}")
            return StudentProfile(student_id, "unknown", {}, datetime.now(), [])

    async def update_student_profile(self, student_id: str, update: Dict):
        try:
            self.logger.info(f"Updating profile for student {student_id}: {update}")
            if self.db:
                await self.db.update_profile(student_id, update)
        except Exception as e:
            self.logger.error(f"Error updating profile for student {student_id}: {str(e)}")
            

    async def analyze_learning_progress(self, student_id: str) -> Dict[str, Union[float, List[str]]]:
        try:
            profile = await self.get_student_profile(student_id)
            progress_summary = {
                "average_progress": sum(profile.progress.values()) / len(profile.progress) if profile.progress else 0,
                "strengths": [k for k, v in profile.progress.items() if v > 0.7],
                "areas_for_improvement": [k for k, v in profile.progress.items() if v < 0.3]
            }
            self.logger.info(f"Analyzed learning progress for student {student_id}")
            return progress_summary
        except Exception as e:
            self.logger.error(f"Error analyzing learning progress for student {student_id}: {str(e)}")
            return {"error": "Unable to analyze learning progress at this time."}

    async def recommend_next_steps(self, student_id: str) -> List[str]:
        try:
            profile = await self.get_student_profile(student_id)
            progress_summary = await self.analyze_learning_progress(student_id)
            
            prompt = f"""
            Based on this student profile:
            {json.dumps(asdict(profile))}
            
            And this progress summary:
            {json.dumps(progress_summary)}
            
            Recommend the top 3 next steps for the student's learning journey.
            Return the recommendations as a JSON array of strings.
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI education expert."},
                {"role": "user", "content": prompt}
            ])
            
            recommendations = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Generated learning recommendations for student {student_id}")
            return recommendations
        except Exception as e:
            self.logger.error(f"Error generating recommendations for student {student_id}: {str(e)}")
            return ["Continue with your current learning path.", "Review recent materials.", "Reach out to a tutor for personalized guidance."]

    async def handle_error(self, student_id: str, error_message: str) -> str:
        self.logger.error(f"Error for student {student_id}: {error_message}")
        await self.collect_feedback(student_id, f"Error occurred: {error_message}")
        return "I apologize, but I'm experiencing some technical difficulties. Please try again later or contact support if the problem persists."

# Usage example:
async def main():
    manager = DialogueManager()
    student_id = "12345"
    
    response = await manager.process_user_input("Can you explain photosynthesis?", student_id)
    print(f"AI: {response}")
    
    history = await manager.get_conversation_history(student_id)
    print(f"Conversation History: {history}")
    
    await manager.collect_feedback(student_id, "The explanation was clear and helpful!")
    
    progress = await manager.analyze_learning_progress(student_id)
    print(f"Learning Progress: {progress}")
    
    recommendations = await manager.recommend_next_steps(student_id)
    print(f"Recommendations: {recommendations}")

if __name__ == "__main__":
    asyncio.run(main())