# ai71/gamification/system.py

from ..ai71_api import AI71API
import json
import asyncio
import logging
from typing import Dict, List

class GamificationSystem:
    def __init__(self):
        self.ai_api = AI71API()
        self.logger = self._setup_logger()
        self.achievement_cache: Dict[str, Dict] = {}

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    async def generate_achievement_system(self, curriculum: dict) -> dict:
        try:
            curriculum_hash = hash(json.dumps(curriculum, sort_keys=True))
            if curriculum_hash in self.achievement_cache:
                self.logger.info("Using cached achievement system")
                return self.achievement_cache[curriculum_hash]

            prompt = f"""
            Create a comprehensive achievement system for this curriculum:
            {json.dumps(curriculum)}
            
            The achievement system should include:
            1. A set of badges or awards tied to learning milestones
            2. Progressive challenges that increase in difficulty
            3. Hidden achievements to encourage exploration
            4. Social achievements for collaborative work
            5. A points system that reflects both effort and mastery
            6. Levels or ranks that students can progress through
            7. Customizable avatars or profiles that reflect achievements
            8. Leaderboards for friendly competition
            9. Daily or weekly quests to encourage regular engagement
            10. A reward system for consistent learning streaks
            
            Return the achievement system as a detailed JSON object.
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in gamification for education."},
                {"role": "user", "content": prompt}
            ])
            
            achievement_system = json.loads(response['choices'][0]['message']['content'])
            self.achievement_cache[curriculum_hash] = achievement_system
            self.logger.info("Generated new achievement system")
            return achievement_system
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            return {"error": "Failed to generate achievement system"}
        except Exception as e:
            self.logger.error(f"Unexpected error in generate_achievement_system: {str(e)}")
            return {"error": "An unexpected error occurred"}

    async def update_student_achievements(self, student_id: str, progress: Dict[str, float], achievement_system: Dict) -> Dict[str, List[str]]:
        try:
            prompt = f"""
            Given this student's progress:
            {json.dumps(progress)}
            
            And this achievement system:
            {json.dumps(achievement_system)}
            
            Determine which new achievements the student has unlocked.
            Return a JSON object with two lists:
            1. "unlocked": New achievements that the student has just unlocked
            2. "progress": Achievements that the student is making progress towards, with their current progress
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in analyzing educational achievements."},
                {"role": "user", "content": prompt}
            ])
            
            updates = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Updated achievements for student {student_id}")
            return updates
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            return {"error": "Failed to update student achievements"}
        except Exception as e:
            self.logger.error(f"Unexpected error in update_student_achievements: {str(e)}")
            return {"error": "An unexpected error occurred"}

    async def generate_personalized_challenges(self, student_id: str, progress: Dict[str, float], achievement_system: Dict) -> List[Dict]:
        try:
            prompt = f"""
            Based on this student's progress:
            {json.dumps(progress)}
            
            And this achievement system:
            {json.dumps(achievement_system)}
            
            Generate 3 personalized challenges for the student that are:
            1. Challenging but achievable given their current progress
            2. Aligned with their learning goals
            3. Designed to unlock new achievements
            
            Return the challenges as a JSON array of objects, each with:
            - "title": A catchy title for the challenge
            - "description": A brief description of what the student needs to do
            - "difficulty": An integer from 1-5 representing the challenge difficulty
            - "rewards": What the student will earn for completing the challenge
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in creating educational challenges."},
                {"role": "user", "content": prompt}
            ])
            
            challenges = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Generated personalized challenges for student {student_id}")
            return challenges
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            return [{"error": "Failed to generate personalized challenges"}]
        except Exception as e:
            self.logger.error(f"Unexpected error in generate_personalized_challenges: {str(e)}")
            return [{"error": "An unexpected error occurred"}]

    async def calculate_engagement_score(self, student_id: str, activity_log: List[Dict]) -> float:
        try:
            prompt = f"""
            Given this student's activity log:
            {json.dumps(activity_log)}
            
            Calculate an engagement score from 0 to 100 based on:
            1. Frequency of logins
            2. Time spent on learning activities
            3. Diversity of topics explored
            4. Completion rate of started activities
            5. Participation in social or collaborative activities
            
            Return the engagement score as a single float value.
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in analyzing student engagement."},
                {"role": "user", "content": prompt}
            ])
            
            engagement_score = float(response['choices'][0]['message']['content'])
            self.logger.info(f"Calculated engagement score for student {student_id}: {engagement_score}")
            return engagement_score
        except ValueError as e:
            self.logger.error(f"Error converting engagement score to float: {str(e)}")
            return 0.0
        except Exception as e:
            self.logger.error(f"Unexpected error in calculate_engagement_score: {str(e)}")
            return 0.0

# Usage example:
async def main():
    gamification_system = GamificationSystem()
    
    # Example curriculum
    curriculum = {
        "subject": "Biology",
        "units": ["Cell Biology", "Genetics", "Ecology"],
        "difficulty": "Intermediate"
    }
    
    achievement_system = await gamification_system.generate_achievement_system(curriculum)
    print("Achievement System:", json.dumps(achievement_system, indent=2))
    
    # Example student progress
    student_id = "12345"
    progress = {
        "Cell Biology": 0.8,
        "Genetics": 0.5,
        "Ecology": 0.2
    }
    
    updates = await gamification_system.update_student_achievements(student_id, progress, achievement_system)
    print("Achievement Updates:", json.dumps(updates, indent=2))
    
    challenges = await gamification_system.generate_personalized_challenges(student_id, progress, achievement_system)
    print("Personalized Challenges:", json.dumps(challenges, indent=2))
    
    # Example activity log
    activity_log = [
        {"timestamp": "2024-03-01T10:00:00", "activity": "login"},
        {"timestamp": "2024-03-01T10:15:00", "activity": "start_lesson", "topic": "Cell Biology"},
        {"timestamp": "2024-03-01T11:00:00", "activity": "complete_lesson", "topic": "Cell Biology"},
        {"timestamp": "2024-03-02T14:00:00", "activity": "login"},
        {"timestamp": "2024-03-02T14:30:00", "activity": "start_quiz", "topic": "Genetics"}
    ]
    
    engagement_score = await gamification_system.calculate_engagement_score(student_id, activity_log)
    print(f"Engagement Score: {engagement_score}")

if __name__ == "__main__":
    asyncio.run(main())