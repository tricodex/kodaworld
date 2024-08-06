# ai71/peer_matching/matcher.py

from ..api import OpenAIAPI
import json
import logging
from typing import List, Dict, Tuple
import asyncio
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    skills: Dict[str, float]
    learning_style: str
    interests: List[str]
    personality_traits: List[str]

class GroupActivity(BaseModel):
    title: str
    description: str
    duration: int
    learning_outcomes: List[str]
    required_resources: List[str]

class PeerMatcher:
    def __init__(self):
        self.ai_api = OpenAIAPI()
        self.logger = self._setup_logger()

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    async def find_optimal_matches(self, users: List[User], group_size: int) -> List[List[int]]:
        try:
            self.logger.info(f"Finding optimal matches for {len(users)} users in groups of {group_size}")
            prompt = f"""
            As an expert in educational psychology and group dynamics, your task is to create optimal study groups from the given user profiles.
            
            User Profiles:
            {json.dumps([user.dict() for user in users], indent=2)}
            
            Desired group size: {group_size}
            
            Instructions:
            1. Analyze each user's skills, learning style, interests, and personality traits.
            2. Create groups that maximize the following criteria:
               a) Skill complementarity: Balance high and low skill levels within each group.
               b) Learning style diversity: Mix different learning styles to promote varied approaches.
               c) Interest alignment: Group users with some shared interests to facilitate engagement.
               d) Personality balance: Combine different personality traits for dynamic interactions.
            3. Ensure each group has a mix of strengths that can support peer learning.
            4. Consider potential synergies between users' skills and interests.
            5. Aim for an overall balance of experience levels across all groups.

            Output:
            Return a JSON array of arrays, where each inner array represents a group and contains the user IDs of its members.
            Include a brief explanation for each group formation, highlighting the key factors that influenced your decision.

            Example output format:
            {{
                "groups": [
                    {{ "members": [0, 3, 5], "explanation": "This group balances..." }},
                    {{ "members": [1, 2, 4], "explanation": "These users complement each other by..." }}
                ]
            }}
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in educational psychology and group formation, specializing in creating optimal study groups."},
                {"role": "user", "content": prompt}
            ])
            
            result = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Successfully created {len(result['groups'])} study groups")
            return result['groups']
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            raise ValueError("Failed to parse AI response. Please try again.")
        except Exception as e:
            self.logger.error(f"Unexpected error in find_optimal_matches: {str(e)}")
            raise

    async def calculate_group_compatibility(self, group: List[User]) -> float:
        try:
            prompt = f"""
            As an expert in group dynamics and educational psychology, analyze the compatibility of the following group:

            Group Members:
            {json.dumps([user.dict() for user in group], indent=2)}

            Calculate a compatibility score from 0 to 1 based on:
            1. Skill complementarity: How well do the members' skills complement each other?
            2. Learning style synergy: How effectively can different learning styles in the group enhance overall learning?
            3. Interest overlap: To what extent do shared interests provide common ground for collaboration?
            4. Personality dynamics: How well do the personality traits combine for productive group work?
            5. Potential for peer learning: How likely are members to benefit from each other's strengths?

            Provide a detailed breakdown of your scoring, explaining the rationale for each factor.
            Then, provide a final overall compatibility score.

            Output format:
            {{
                "breakdown": {{
                    "skill_complementarity": {{ "score": float, "explanation": "string" }},
                    "learning_style_synergy": {{ "score": float, "explanation": "string" }},
                    "interest_overlap": {{ "score": float, "explanation": "string" }},
                    "personality_dynamics": {{ "score": float, "explanation": "string" }},
                    "peer_learning_potential": {{ "score": float, "explanation": "string" }}
                }},
                "overall_score": float,
                "summary": "A brief summary of the group's compatibility strengths and potential challenges."
            }}
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in analyzing group dynamics and compatibility in educational settings."},
                {"role": "user", "content": prompt}
            ])
            
            result = json.loads(response['choices'][0]['message']['content'])
            compatibility_score = result['overall_score']
            self.logger.info(f"Calculated compatibility score for group: {compatibility_score}")
            return result
        except Exception as e:
            self.logger.error(f"Unexpected error in calculate_group_compatibility: {str(e)}")
            return {"overall_score": 0.0, "summary": "Error calculating compatibility."}

    async def suggest_group_activities(self, group: List[User]) -> List[GroupActivity]:
        try:
            prompt = f"""
            As an expert in collaborative learning and educational activity design, create engaging group activities for the following users:

            Group Members:
            {json.dumps([user.dict() for user in group], indent=2)}

            Design 3 collaborative learning activities that:
            1. Align with the group's collective skills and interests
            2. Accommodate different learning styles present in the group
            3. Encourage participation and leverage each member's strengths
            4. Address areas where the group could collectively improve
            5. Promote peer learning and knowledge sharing
            6. Can be completed in 1-2 hours

            For each activity, provide:
            - A catchy and descriptive title
            - A clear and concise description of the activity
            - Estimated duration in minutes
            - Specific learning outcomes or skills to be gained
            - Required resources or materials

            Output format:
            [
                {{
                    "title": "string",
                    "description": "string",
                    "duration": int,
                    "learning_outcomes": ["string", "string", ...],
                    "required_resources": ["string", "string", ...]
                }},
                ...
            ]
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in designing collaborative learning activities for diverse student groups."},
                {"role": "user", "content": prompt}
            ])
            
            activities = [GroupActivity(**activity) for activity in json.loads(response['choices'][0]['message']['content'])]
            self.logger.info(f"Generated {len(activities)} group activities")
            return activities
        except Exception as e:
            self.logger.error(f"Unexpected error in suggest_group_activities: {str(e)}")
            return []

    async def generate_group_dynamics_visualization(self, group: List[User]) -> str:
        try:
            prompt = f"""
            Create a visual representation of the group dynamics for the following users:

            {json.dumps([user.dict() for user in group], indent=2)}

            The image should:
            1. Represent each user as a unique visual element (e.g., circle, icon)
            2. Use connecting lines or overlapping areas to show skill complementarity and interest overlap
            3. Use color coding to represent different learning styles
            4. Incorporate symbols or icons to represent key personality traits
            5. Visually indicate the potential for peer learning and collaboration

            The overall composition should give an intuitive understanding of the group's compatibility and potential interactions.
            """

            image_response = await self.ai_api.create_image(prompt=prompt, size="1024x1024", quality="standard")
            image_url = image_response['data'][0]['url']
            self.logger.info(f"Generated group dynamics visualization: {image_url}")
            return image_url
        except Exception as e:
            self.logger.error(f"Error generating group dynamics visualization: {str(e)}")
            return ""

    async def optimize_group_formation(self, users: List[User], group_size: int, iterations: int = 5) -> Tuple[List[List[int]], float]:
        best_groups = None
        best_score = -1
        
        for i in range(iterations):
            self.logger.info(f"Optimizing group formation: iteration {i+1}/{iterations}")
            groups = await self.find_optimal_matches(users, group_size)
            total_score = 0
            
            for group in groups:
                group_users = [users[member['members'][i]] for i in range(len(group['members']))]
                compatibility = await self.calculate_group_compatibility(group_users)
                total_score += compatibility['overall_score']
            
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
        User(id=0, name="Alice", skills={"math": 0.8, "programming": 0.6}, learning_style="visual", interests=["AI", "data science"], personality_traits=["creative", "analytical"]),
        User(id=1, name="Bob", skills={"math": 0.6, "programming": 0.9}, learning_style="kinesthetic", interests=["web development", "game design"], personality_traits=["outgoing", "practical"]),
        User(id=2, name="Charlie", skills={"math": 0.7, "programming": 0.7}, learning_style="auditory", interests=["cybersecurity", "networking"], personality_traits=["detail-oriented", "curious"]),
        User(id=3, name="Diana", skills={"math": 0.9, "programming": 0.5}, learning_style="visual", interests=["machine learning", "statistics"], personality_traits=["organized", "logical"]),
        User(id=4, name="Eve", skills={"math": 0.5, "programming": 0.8}, learning_style="kinesthetic", interests=["mobile app development", "UI/UX"], personality_traits=["creative", "empathetic"]),
        User(id=5, name="Frank", skills={"math": 0.7, "programming": 0.7}, learning_style="auditory", interests=["database systems", "cloud computing"], personality_traits=["analytical", "team-player"]),
    ]
    
    group_size = 3
    
    optimal_groups, average_compatibility = await matcher.optimize_group_formation(users, group_size)
    print(f"Optimal Groups: {json.dumps(optimal_groups, indent=2)}")
    print(f"Average Compatibility Score: {average_compatibility}")
    
    # Example of suggesting activities and generating visualization for the first group
    if optimal_groups:
        first_group = [users[i] for i in optimal_groups[0]['members']]
        activities = await matcher.suggest_group_activities(first_group)
        print("Suggested Group Activities:")
        print(json.dumps([activity.dict() for activity in activities], indent=2))
        
        visualization_url = await matcher.generate_group_dynamics_visualization(first_group)
        print(f"Group Dynamics Visualization URL: {visualization_url}")

if __name__ == "__main__":
    asyncio.run(main())