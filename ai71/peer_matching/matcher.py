# ai71/peer_matching/matcher.py

from ..ai71_api import AI71API
import json
import logging
from typing import List, Dict, Tuple
import asyncio

class PeerMatcher:
    def __init__(self):
        self.ai_api = AI71API()
        self.logger = self._setup_logger()

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    async def find_optimal_matches(self, users: List[Dict], group_size: int) -> List[List[int]]:
        try:
            self.logger.info(f"Finding optimal matches for {len(users)} users in groups of {group_size}")
            prompt = f"""
            Given these user profiles:
            {json.dumps(users)}
            And a desired group size of {group_size},
            
            Create optimal study groups that:
            1. Balance skill levels within each group
            2. Consider complementary strengths and weaknesses
            3. Account for learning style compatibility
            4. Maximize potential for peer learning and support
            5. Consider any specified preferences or constraints
            
            Return the groups as a JSON array of arrays, where each inner array represents a group and contains the indices of the users in that group.
            """
            
            messages = [
                {"role": "system", "content": "You are an AI expert in forming optimal study groups."},
                {"role": "user", "content": prompt}
            ]
            
            response = await self.ai_api.chat_completion(messages)
            
            groups = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Successfully created {len(groups)} study groups")
            return groups
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            raise ValueError("The AI response could not be parsed as JSON. Please try again.")
        except Exception as e:
            self.logger.error(f"Unexpected error in find_optimal_matches: {str(e)}")
            raise

    async def calculate_group_compatibility(self, group: List[Dict]) -> float:
        try:
            prompt = f"""
            Given this group of users:
            {json.dumps(group)}
            
            Calculate a compatibility score from 0 to 1 based on:
            1. Similarity in skill levels
            2. Complementary strengths and weaknesses
            3. Learning style compatibility
            4. Shared interests or goals
            5. Previous collaboration history (if available)
            
            Return the compatibility score as a single float value.
            """
            
            messages = [
                {"role": "system", "content": "You are an AI expert in analyzing group dynamics and compatibility."},
                {"role": "user", "content": prompt}
            ]
            
            response = await self.ai_api.chat_completion(messages)
            
            compatibility_score = float(response['choices'][0]['message']['content'])
            self.logger.info(f"Calculated compatibility score for group: {compatibility_score}")
            return compatibility_score
        except ValueError as e:
            self.logger.error(f"Error converting compatibility score to float: {str(e)}")
            return 0.0
        except Exception as e:
            self.logger.error(f"Unexpected error in calculate_group_compatibility: {str(e)}")
            return 0.0

    async def suggest_group_activities(self, group: List[Dict]) -> List[Dict]:
        try:
            prompt = f"""
            Based on this group of users:
            {json.dumps(group)}
            
            Suggest 3 collaborative learning activities that:
            1. Align with the group's shared learning goals
            2. Leverage the diverse strengths of group members
            3. Address common areas for improvement
            4. Encourage active participation from all members
            5. Can be completed in a reasonable timeframe (e.g., 1-2 hours)
            
            Return the activities as a JSON array of objects, each with:
            - "title": A descriptive title for the activity
            - "description": A brief explanation of the activity
            - "duration": Estimated time to complete (in minutes)
            - "learning_outcomes": Expected benefits or skills gained
            """
            
            messages = [
                {"role": "system", "content": "You are an AI expert in designing collaborative learning activities."},
                {"role": "user", "content": prompt}
            ]
            
            response = await self.ai_api.chat_completion(messages)
            
            activities = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Generated {len(activities)} group activities")
            return activities
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            return [{"error": "Failed to generate group activities"}]
        except Exception as e:
            self.logger.error(f"Unexpected error in suggest_group_activities: {str(e)}")
            return [{"error": "An unexpected error occurred"}]

    async def optimize_group_formation(self, users: List[Dict], group_size: int, iterations: int = 5) -> Tuple[List[List[int]], float]:
        best_groups = None
        best_score = -1
        
        for i in range(iterations):
            self.logger.info(f"Optimizing group formation: iteration {i+1}/{iterations}")
            groups = await self.find_optimal_matches(users, group_size)
            total_score = 0
            
            for group in groups:
                group_users = [users[i] for i in group]
                compatibility = await self.calculate_group_compatibility(group_users)
                total_score += compatibility
            
            average_score = total_score / len(groups)
            
            if average_score > best_score:
                best_score = average_score
                best_groups = groups
        
        self.logger.info(f"Completed group optimization. Best average compatibility: {best_score}")
        return best_groups, best_score

# Usage example:
async def main():
    matcher = PeerMatcher()
    
    # Example user profiles
    users = [
        {"id": 0, "name": "Alice", "skills": {"math": 0.8, "programming": 0.6}, "learning_style": "visual"},
        {"id": 1, "name": "Bob", "skills": {"math": 0.6, "programming": 0.9}, "learning_style": "kinesthetic"},
        {"id": 2, "name": "Charlie", "skills": {"math": 0.7, "programming": 0.7}, "learning_style": "auditory"},
        {"id": 3, "name": "Diana", "skills": {"math": 0.9, "programming": 0.5}, "learning_style": "visual"},
        {"id": 4, "name": "Eve", "skills": {"math": 0.5, "programming": 0.8}, "learning_style": "kinesthetic"},
        {"id": 5, "name": "Frank", "skills": {"math": 0.7, "programming": 0.7}, "learning_style": "auditory"},
    ]
    
    group_size = 3
    
    optimal_groups, average_compatibility = await matcher.optimize_group_formation(users, group_size)
    print(f"Optimal Groups: {optimal_groups}")
    print(f"Average Compatibility Score: {average_compatibility}")
    
    # Example of suggesting activities for the first group
    if optimal_groups:
        first_group = [users[i] for i in optimal_groups[0]]
        activities = await matcher.suggest_group_activities(first_group)
        print("Suggested Group Activities:")
        print(json.dumps(activities, indent=2))

if __name__ == "__main__":
    asyncio.run(main())