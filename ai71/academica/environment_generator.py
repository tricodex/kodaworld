from typing import Dict, Any, List
from pydantic import BaseModel
from ..api import OpenAIAPI  
import json
import logging

class InteractiveElement(BaseModel):
    type: str
    description: str
    interaction_method: str

class Scenario(BaseModel):
    description: str
    objectives: List[str]
    challenges: List[str]

class VisualComponent(BaseModel):
    type: str
    description: str
    url: str

class AuditoryComponent(BaseModel):
    type: str
    description: str
    url: str

class GroupActivity(BaseModel):
    title: str
    description: str
    duration: str
    materials: List[str]

class Environment(BaseModel):
    topic: str
    complexity: str
    description: str
    elements: List[InteractiveElement]
    scenarios: List[Scenario]
    visual_components: List[VisualComponent]
    auditory_components: List[AuditoryComponent]
    group_activities: List[GroupActivity]

class Challenge(BaseModel):
    description: str
    objectives: List[str]
    difficulty: str
    hints: List[str]
    solution: str

class StudentInteraction(BaseModel):
    input: str
    acknowledgment: str
    feedback: str
    next_step: str
    encouragement: str

class Academica:
    def __init__(self):
        self.ai_api = OpenAIAPI()  # Using the custom OpenAIAPI class
        self.logger = self._setup_logger()

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def _generate_content(self, system_message: str, user_prompt: str) -> Dict[str, Any]:
        try:
            response = self.ai_api.chat_completion(
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_prompt}
                ],
                model="gpt-4o-mini"
            )
            return json.loads(response['choices'][0]['message']['content'])
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            raise ValueError("Failed to generate content: Invalid JSON response")
        except Exception as e:
            self.logger.error(f"Unexpected error in content generation: {str(e)}")
            raise

    def generate_environment(self, topic: str, complexity: str) -> Environment:
        system_message = """
        You are an AI expert in creating immersive and engaging educational environments. Your task is to design a rich, interactive learning space that captivates students and facilitates deep understanding of the given topic. Focus on creating a multisensory experience that caters to various learning styles and encourages active participation.
        """

        user_prompt = f"""
        Create an exceptionally detailed and interactive educational environment for the topic: {topic}
        At complexity level: {complexity}
        
        Provide a JSON object with the following structure:
        {{
            "topic": "{topic}",
            "complexity": "{complexity}",
            "description": "A vivid, engaging description of the learning environment",
            "elements": [
                {{
                    "type": "Type of interactive element",
                    "description": "Detailed description of the element",
                    "interaction_method": "How students interact with this element"
                }}
            ],
            "scenarios": [
                {{
                    "description": "A compelling scenario or problem to solve",
                    "objectives": ["List", "of", "learning", "objectives"],
                    "challenges": ["Specific", "challenges", "within", "the", "scenario"]
                }}
            ],
            "visual_components": [
                {{
                    "type": "Type of visual (e.g., 3D model, animation, infographic)",
                    "description": "Description of the visual component",
                    "url": "Placeholder URL for the visual resource"
                }}
            ],
            "auditory_components": [
                {{
                    "type": "Type of audio (e.g., narration, ambient sound, music)",
                    "description": "Description of the auditory component",
                    "url": "Placeholder URL for the audio resource"
                }}
            ],
            "group_activities": [
                {{
                    "title": "Title of the group activity",
                    "description": "Detailed description of the activity",
                    "duration": "Estimated duration",
                    "materials": ["List", "of", "required", "materials"]
                }}
            ]
        }}
        
        Ensure each component is richly detailed and designed to maximize student engagement and learning outcomes.
        """

        environment_data = self._generate_content(system_message, user_prompt)
        return Environment(**environment_data)

    def process_student_interaction(self, environment: Environment, interaction: str) -> StudentInteraction:
        system_message = """
        You are an AI-powered educational guide, expertly designed to facilitate student learning in interactive environments. Your responses should be encouraging, insightful, and tailored to the student's actions and the learning context. Aim to deepen understanding, promote critical thinking, and maintain high engagement.
        """

        user_prompt = f"""
        Given this educational environment:
        {json.dumps(environment.dict(), indent=2)}
        
        Process the following student interaction:
        {interaction}
        
        Provide a JSON response with the following structure:
        {{
            "input": "{interaction}",
            "acknowledgment": "A personalized acknowledgment of the student's action",
            "feedback": "Detailed, constructive feedback that relates to the learning objectives",
            "next_step": "A thought-provoking suggestion for the next step in their learning journey",
            "encouragement": "An motivational message to inspire continued exploration and learning"
        }}
        
        Ensure your response is tailored to the specific elements and scenarios of the given environment.
        """

        interaction_data = self._generate_content(system_message, user_prompt)
        return StudentInteraction(**interaction_data)

    def generate_challenge(self, environment: Environment, difficulty: str) -> Challenge:
        system_message = """
        You are an AI specialist in crafting educational challenges that push the boundaries of student understanding. Your challenges should be thought-provoking, relevant to the learning environment, and calibrated to the specified difficulty level. Design challenges that require critical thinking, creativity, and application of knowledge.
        """

        user_prompt = f"""
        Based on this educational environment:
        {json.dumps(environment.dict(), indent=2)}
        
        Generate an engaging challenge at {difficulty} difficulty level.
        
        Provide a JSON object with the following structure:
        {{
            "description": "A compelling description of the challenge that hooks the student's interest",
            "objectives": ["List", "of", "specific", "learning", "objectives", "for", "this", "challenge"],
            "difficulty": "{difficulty}",
            "hints": ["Carefully", "crafted", "hints", "that", "guide", "without", "giving", "away", "the", "solution"],
            "solution": "A detailed explanation of the optimal approach or answer to the challenge"
        }}
        
        Ensure the challenge is deeply integrated with the environment's theme and components, providing a seamless and immersive learning experience.
        """

        challenge_data = self._generate_content(system_message, user_prompt)
        return Challenge(**challenge_data)

# Usage example:
def main():
    academica = Academica()
    
    try:
        # Generate an environment
        environment = academica.generate_environment("Quantum Computing", "Advanced")
        print("Generated Environment:", json.dumps(environment.dict(), indent=2))
        
        # Process a student interaction
        interaction = "I'm curious about how quantum entanglement affects computation speed."
        interaction_result = academica.process_student_interaction(environment, interaction)
        print("Interaction Result:", json.dumps(interaction_result.dict(), indent=2))
        
        # Generate a challenge
        challenge = academica.generate_challenge(environment, "Expert")
        print("Generated Challenge:", json.dumps(challenge.dict(), indent=2))
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
