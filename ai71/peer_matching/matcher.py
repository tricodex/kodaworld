# ai71/peer_matching/matcher.py

from ..ai71_api import AI71API
import json
from typing import List, Dict

class PeerMatcher:
    def __init__(self):
        self.ai_api = AI71API()

    def find_optimal_matches(self, users: List[Dict], group_size: int) -> List[List[int]]:
        prompt = f"""
        Given these user profiles:
        {json.dumps(users)}
        And a desired group size of {group_size},
        
        Create optimal study groups that:
        1. Balance skill levels within each group
        2. Consider complementary strengths and weaknesses
        3. Account for learning style compatibility
        4. Maximize potential for peer learning and support
        
        Return the groups as a JSON array of arrays, where each inner array represents a group and contains the indices of the users in that group.
        """
        
        messages = [
            {"role": "system", "content": "You are an AI expert in forming optimal study groups."},
            {"role": "user", "content": prompt}
        ]
        
        response = self.ai_api.chat_completion(messages)
        
        try:
            return json.loads(response['choices'][0]['message']['content'])
        except json.JSONDecodeError:
            raise ValueError("The AI response could not be parsed as JSON. Please try again.")