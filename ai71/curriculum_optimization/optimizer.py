# ai71/curriculum_optimization/optimizer.py

from ..ai71_api import AI71API
import json
from typing import Dict, List

class CurriculumOptimizer:
    def __init__(self):
        self.ai_api = AI71API()

    def optimize_curriculum(self, current_curriculum: Dict, performance_data: Dict, learning_goals: List[str]) -> Dict:
        prompt = f"""
        Optimize this curriculum:
        {json.dumps(current_curriculum)}
        Based on this performance data:
        {json.dumps(performance_data)}
        And these learning goals:
        {json.dumps(learning_goals)}
        
        Provide an optimized curriculum that:
        1. Addresses identified skill gaps and areas of improvement
        2. Incorporates more effective learning methods based on performance data
        3. Aligns closely with the specified learning goals
        4. Suggests optimal sequencing of topics and activities
        5. Recommends personalized learning paths for different learner profiles
        
        Return the optimized curriculum as a JSON object.
        """
        
        messages = [
            {"role": "system", "content": "You are an AI curriculum optimization expert."},
            {"role": "user", "content": prompt}
        ]
        
        response = self.ai_api.chat_completion(messages)
        
        try:
            return json.loads(response['choices'][0]['message']['content'])
        except json.JSONDecodeError:
            raise ValueError("The AI response could not be parsed as JSON. Please try again.")