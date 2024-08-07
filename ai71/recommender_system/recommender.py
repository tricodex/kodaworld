import aiohttp
from typing import List, Dict
from pydantic import BaseModel
from ..api import OpenAIAPI
import json
import logging
from urllib.parse import quote_plus
from fastapi import HTTPException


class User(BaseModel):
    id: str
    learning_style: str
    current_focus: str
    skill_level: str

class Resource(BaseModel):
    title: str
    url: str
    description: str
    type: str
    suitability_score: float

class ResourceRecommender:
    def __init__(self):
        self.openai_api = OpenAIAPI()
        self.logger = self._setup_logger()

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    async def search_duckduckgo(self, query: str, num_results: int = 10) -> List[Dict]:
        encoded_query = quote_plus(query)
        url = f"https://api.duckduckgo.com/?q={encoded_query}&format=json&pretty=1"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get('Results', [])[:num_results]
                else:
                    self.logger.error(f"DuckDuckGo API request failed with status {response.status}")
                    return []

    async def filter_and_enhance_resources(self, user: User, raw_resources: List[Dict]) -> List[Resource]:
        system_prompt = """
        You are an AI expert in educational resource curation, specializing in finding and recommending 
        the most suitable learning materials for students. Your task is to analyze, filter, and enhance 
        resource descriptions to match a student's learning style, current focus, and skill level.
        """

        user_prompt = f"""
        Given the following user profile:
        - Learning style: {user.learning_style}
        - Current focus: {user.current_focus}
        - Skill level: {user.skill_level}

        And this list of potential learning resources:
        {json.dumps(raw_resources, indent=2)}

        Please perform the following tasks:
        1. Filter out any resources that are not suitable for the student's skill level or might contain inappropriate content.
        2. For each remaining resource, provide:
           - An enhanced title that accurately reflects the content
           - A concise yet informative description tailored to the student's learning style
           - The type of resource (e.g., article, video, interactive tutorial, course)
           - A suitability score from 0 to 1, where 1 is perfectly suited to the student's needs

        3. Rank the resources based on their relevance to the student's current focus and learning style.

        Return the results as a JSON array of objects with the following structure:
        [
            {{
                "title": "Enhanced resource title",
                "url": "Original resource URL",
                "description": "Tailored description for the student",
                "type": "Resource type",
                "suitability_score": float
            }}
        ]

        Ensure all descriptions are engaging, informative, and appropriate for the student's learning style.
        """

        response = await self.openai_api.chat_completion([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ])

        try:
            enhanced_resources = json.loads(response['choices'][0]['message']['content'])
            return [Resource(**resource) for resource in enhanced_resources]
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding OpenAI response: {e}")
            return []

    async def recommend_resources(self, user: User) -> List[Resource]:
        search_query = f"{user.current_focus} {user.skill_level} learning resources"
        raw_resources = await self.search_duckduckgo(search_query)
        
        if not raw_resources:
            self.logger.warning("No resources found from DuckDuckGo search")
            return []

        enhanced_resources = await self.filter_and_enhance_resources(user, raw_resources)
        
        # Sort resources by suitability score in descending order
        enhanced_resources.sort(key=lambda x: x.suitability_score, reverse=True)
        
        return enhanced_resources[:5]  # Return top 5 resources

async def recommend_resources_endpoint(user_id: str, learning_style: str, current_focus: str, skill_level: str):
    recommender = ResourceRecommender()
    user = User(id=user_id, learning_style=learning_style, current_focus=current_focus, skill_level=skill_level)
    
    try:
        recommended_resources = await recommender.recommend_resources(user)
        return {"resources": [resource.dict() for resource in recommended_resources]}
    except Exception as e:
        recommender.logger.error(f"Error in resource recommendation: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while recommending resources")


