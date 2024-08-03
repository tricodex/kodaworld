# ai71/scientific_simulation/simulator.py

from ..ai71_api import AI71API
import json

class ScientificSimulator:
    def __init__(self):
        self.ai_api = AI71API()

    def generate_simulation(self, topic: str, complexity: str) -> dict:
        prompt = f"""
        Create a scientific simulation for the topic: {topic}
        At complexity level: {complexity}
        
        The simulation should include:
        1. A brief description of the scientific concept
        2. Parameters that can be adjusted
        3. Expected outcomes based on parameter changes
        4. Potential real-world applications
        5. Suggestions for further exploration
        
        Return the simulation details as a JSON object.
        """
        
        response = self.ai_api.chat_completion([
            {"role": "system", "content": "You are an AI expert in creating educational scientific simulations."},
            {"role": "user", "content": prompt}
        ])
        
        return json.loads(response['choices'][0]['message']['content'])