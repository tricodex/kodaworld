# ai71/gamification/system.py

from ..ai71_api import AI71API
import json

class GamificationSystem:
    def __init__(self):
        self.ai_api = AI71API()

    def generate_achievement_system(self, curriculum: dict) -> dict:
        prompt = f"""
        Create an achievement system for this curriculum:
        {json.dumps(curriculum)}
        
        The achievement system should include:
        1. A set of badges or awards tied to learning milestones
        2. Progressive challenges that increase in difficulty
        3. Hidden achievements to encourage exploration
        4. Social achievements for collaborative work
        5. A points system that reflects both effort and mastery
        
        Return the achievement system as a JSON object.
        """
        
        response = self.ai_api.chat_completion([
            {"role": "system", "content": "You are an AI expert in gamification for education."},
            {"role": "user", "content": prompt}
        ])
        
        return json.loads(response['choices'][0]['message']['content'])