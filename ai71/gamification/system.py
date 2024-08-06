from ..api import OpenAIAPI
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import json
import logging
import asyncio

class Achievement(BaseModel):
    id: str
    name: str
    description: str
    criteria: str
    points: int
    badge_url: str

class Challenge(BaseModel):
    id: str
    title: str
    description: str
    difficulty: int = Field(..., ge=1, le=5)
    rewards: Dict[str, int]
    prerequisites: List[str]

class UserProgress(BaseModel):
    achievements: List[str]
    points: int
    level: int
    completed_challenges: List[str]

class GamificationSystem:
    def __init__(self):
        self.ai_api = OpenAIAPI()
        self.logger = self._setup_logger()
        self.achievement_cache: Dict[str, List[Achievement]] = {}
        self.challenge_cache: Dict[str, List[Challenge]] = {}

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    async def generate_achievement_system(self, curriculum: dict) -> List[Achievement]:
        try:
            curriculum_hash = hash(json.dumps(curriculum, sort_keys=True))
            if curriculum_hash in self.achievement_cache:
                self.logger.info("Using cached achievement system")
                return self.achievement_cache[curriculum_hash]

            system_message = """
            You are an AI expert in gamification for education. Your task is to create a comprehensive and engaging achievement system for a given curriculum. Focus on creating achievements that motivate students, track progress, and enhance the learning experience.
            """

            user_prompt = f"""
            Create a comprehensive achievement system for this curriculum:
            {json.dumps(curriculum, indent=2)}
            
            Generate a list of 15-20 achievements that cover the following aspects:
            1. Learning milestones tied to curriculum progress
            2. Skill mastery in specific areas
            3. Consistent engagement and participation
            4. Collaborative and social learning
            5. Creative problem-solving and critical thinking
            6. Personal growth and self-improvement

            For each achievement, provide:
            - A unique ID (e.g., "ACH_001")
            - A catchy, motivating name
            - A clear, concise description
            - Specific criteria for unlocking the achievement
            - Point value (between 10 and 1000)
            - A description of the badge icon (to be used as a placeholder URL)

            Return the list of achievements as a JSON array of objects, each following this structure:
            {{
                "id": "string",
                "name": "string",
                "description": "string",
                "criteria": "string",
                "points": integer,
                "badge_url": "string"
            }}
            """

            response = await self.ai_api.chat_completion([
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ])
            
            achievements = [Achievement(**ach) for ach in json.loads(response['choices'][0]['message']['content'])]
            self.achievement_cache[curriculum_hash] = achievements
            self.logger.info("Generated new achievement system")
            return achievements
        except Exception as e:
            self.logger.error(f"Error in generate_achievement_system: {str(e)}")
            raise

    async def update_student_achievements(self, student_id: str, progress: UserProgress, achievements: List[Achievement]) -> Dict[str, List[str]]:
        try:
            system_message = """
            You are an AI expert in analyzing educational achievements. Your task is to determine which new achievements a student has unlocked based on their current progress and the available achievements.
            """

            user_prompt = f"""
            Given this student's progress:
            {json.dumps(progress.dict(), indent=2)}
            
            And these available achievements:
            {json.dumps([ach.dict() for ach in achievements], indent=2)}
            
            Determine which new achievements the student has unlocked and which they are making progress towards.
            Return a JSON object with two lists:
            1. "unlocked": IDs of new achievements that the student has just unlocked
            2. "in_progress": IDs of achievements the student is making progress towards, sorted by how close they are to unlocking (closest first)

            Ensure your response is a valid JSON object and only includes achievement IDs that exist in the provided list.
            """

            response = await self.ai_api.chat_completion([
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ])
            
            updates = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Updated achievements for student {student_id}")
            return updates
        except Exception as e:
            self.logger.error(f"Error in update_student_achievements: {str(e)}")
            raise

    async def generate_personalized_challenges(self, student_id: str, progress: UserProgress, achievements: List[Achievement]) -> List[Challenge]:
        try:
            system_message = """
            You are an AI expert in creating educational challenges. Your task is to generate personalized, engaging challenges for a student based on their current progress and available achievements.
            """

            user_prompt = f"""
            Based on this student's progress:
            {json.dumps(progress.dict(), indent=2)}
            
            And these available achievements:
            {json.dumps([ach.dict() for ach in achievements], indent=2)}
            
            Generate 3 personalized challenges for the student that are:
            1. Challenging but achievable given their current progress
            2. Aligned with their learning goals and current level
            3. Designed to help unlock new achievements or make progress towards them

            For each challenge, provide:
            - A unique ID (e.g., "CHL_001")
            - A catchy, motivating title
            - A clear, concise description of what the student needs to do
            - A difficulty level (integer from 1-5)
            - Rewards (points and/or progress towards specific achievements)
            - Prerequisites (achievement IDs or level requirements)

            Return the challenges as a JSON array of objects, each following this structure:
            {{
                "id": "string",
                "title": "string",
                "description": "string",
                "difficulty": integer,
                "rewards": {{ "points": integer, "achievements": ["string"] }},
                "prerequisites": ["string"]
            }}
            """

            response = await self.ai_api.chat_completion([
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ])
            
            challenges = [Challenge(**chl) for chl in json.loads(response['choices'][0]['message']['content'])]
            self.logger.info(f"Generated personalized challenges for student {student_id}")
            return challenges
        except Exception as e:
            self.logger.error(f"Error in generate_personalized_challenges: {str(e)}")
            raise

    async def calculate_engagement_score(self, student_id: str, activity_log: List[Dict], progress: UserProgress) -> float:
        try:
            system_message = """
            You are an AI expert in analyzing student engagement in educational platforms. Your task is to calculate an engagement score based on a student's activity log and overall progress.
            """

            user_prompt = f"""
            Given this student's activity log:
            {json.dumps(activity_log, indent=2)}
            
            And their overall progress:
            {json.dumps(progress.dict(), indent=2)}
            
            Calculate an engagement score from 0 to 100 based on:
            1. Frequency and consistency of logins
            2. Time spent on learning activities
            3. Diversity of topics explored
            4. Completion rate of started activities and challenges
            5. Participation in social or collaborative activities
            6. Progress towards achievements and leveling up
            7. Responsiveness to personalized challenges

            Provide your reasoning for the score, breaking it down into the categories mentioned above.
            Then, return the final engagement score as a single float value between 0 and 100.

            Your response should be in this format:
            {{
                "reasoning": {{
                    "login_frequency": {{ "score": float, "explanation": "string" }},
                    "time_spent": {{ "score": float, "explanation": "string" }},
                    "topic_diversity": {{ "score": float, "explanation": "string" }},
                    "completion_rate": {{ "score": float, "explanation": "string" }},
                    "social_participation": {{ "score": float, "explanation": "string" }},
                    "achievement_progress": {{ "score": float, "explanation": "string" }},
                    "challenge_responsiveness": {{ "score": float, "explanation": "string" }}
                }},
                "final_score": float
            }}
            """

            response = await self.ai_api.chat_completion([
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ])
            
            result = json.loads(response['choices'][0]['message']['content'])
            engagement_score = result['final_score']
            self.logger.info(f"Calculated engagement score for student {student_id}: {engagement_score}")
            return engagement_score
        except Exception as e:
            self.logger.error(f"Error in calculate_engagement_score: {str(e)}")
            raise

# Usage example
async def main():
    gs = GamificationSystem()
    
    # Sample curriculum
    curriculum = {
        "subject": "Computer Science",
        "modules": ["Programming Basics", "Data Structures", "Algorithms"],
        "difficulty": "Intermediate"
    }
    
    try:
        # Generate achievement system
        achievements = await gs.generate_achievement_system(curriculum)
        print("Generated Achievements:")
        for ach in achievements:
            print(f"- {ach.name}: {ach.description}")

        # Sample user progress
        progress = UserProgress(
            achievements=["ACH_001", "ACH_002"],
            points=150,
            level=2,
            completed_challenges=["CHL_001"]
        )

        # Update student achievements
        updates = await gs.update_student_achievements("student123", progress, achievements)
        print("\nAchievement Updates:", updates)

        # Generate personalized challenges
        challenges = await gs.generate_personalized_challenges("student123", progress, achievements)
        print("\nPersonalized Challenges:")
        for chl in challenges:
            print(f"- {chl.title}: {chl.description}")

        # Calculate engagement score
        activity_log = [
            {"timestamp": "2023-05-01T10:00:00Z", "action": "login"},
            {"timestamp": "2023-05-01T10:30:00Z", "action": "complete_lesson", "lesson_id": "L001"},
            {"timestamp": "2023-05-02T14:00:00Z", "action": "start_challenge", "challenge_id": "CHL_002"}
        ]
        engagement_score = await gs.calculate_engagement_score("student123", activity_log, progress)
        print(f"\nEngagement Score: {engagement_score}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())