# ai71/academica/environment_generator.py

from ..ai71_api import AI71API
import json
import logging
from typing import Dict, Any, List

class Academica:
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

    async def generate_environment(self, topic: str, complexity: str) -> Dict[str, Any]:
        try:
            self.logger.info(f"Generating environment for topic: {topic} at complexity: {complexity}")
            prompt = f"""
            Create an interactive educational environment for the topic: {topic}
            At complexity level: {complexity}
            
            The environment should include:
            1. A brief description of the main concept
            2. Interactive elements that students can engage with
            3. Potential scenarios or problems to solve
            4. Visual or auditory components to enhance learning
            5. Suggestions for group activities or discussions
            
            Return the environment details as a JSON object.
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in creating engaging educational environments."},
                {"role": "user", "content": prompt}
            ])
            
            environment = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Successfully generated environment for {topic}")
            return environment
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            return {"error": "Failed to generate environment"}
        except Exception as e:
            self.logger.error(f"Unexpected error in generate_environment: {str(e)}")
            return {"error": "An unexpected error occurred"}

    async def process_student_interaction(self, environment: Dict[str, Any], interaction: str) -> Dict[str, Any]:
        try:
            self.logger.info(f"Processing student interaction: {interaction}")
            prompt = f"""
            Given this educational environment:
            {json.dumps(environment)}
            
            Process the following student interaction:
            {interaction}
            
            Provide a response that:
            1. Acknowledges the student's action
            2. Gives appropriate feedback
            3. Suggests the next step or provides additional information
            4. Maintains engagement and encourages further exploration
            
            Return the response as a JSON object.
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI guide in an interactive educational environment."},
                {"role": "user", "content": prompt}
            ])
            
            interaction_result = json.loads(response['choices'][0]['message']['content'])
            self.logger.info("Successfully processed student interaction")
            return interaction_result
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            return {"error": "Failed to process student interaction"}
        except Exception as e:
            self.logger.error(f"Unexpected error in process_student_interaction: {str(e)}")
            return {"error": "An unexpected error occurred"}

    async def generate_challenge(self, environment: Dict[str, Any], difficulty: str) -> Dict[str, Any]:
        try:
            self.logger.info(f"Generating challenge at {difficulty} difficulty")
            prompt = f"""
            Based on this educational environment:
            {json.dumps(environment)}
            
            Generate a challenge at {difficulty} difficulty level.
            The challenge should:
            1. Be related to the main concept of the environment
            2. Require application of knowledge gained from the environment
            3. Be engaging and interactive
            4. Have clear objectives and success criteria
            
            Return the challenge as a JSON object with:
            - "description": A brief description of the challenge
            - "objectives": List of specific goals to achieve
            - "hints": Optional hints that can be provided to the student
            - "solution": The correct approach or answer to the challenge
            """
            
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": "You are an AI expert in creating educational challenges."},
                {"role": "user", "content": prompt}
            ])
            
            challenge = json.loads(response['choices'][0]['message']['content'])
            self.logger.info(f"Successfully generated challenge")
            return challenge
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            return {"error": "Failed to generate challenge"}
        except Exception as e:
            self.logger.error(f"Unexpected error in generate_challenge: {str(e)}")
            return {"error": "An unexpected error occurred"}

# Usage example:
async def main():
    academica = Academica()
    
    # Generate an environment
    environment = await academica.generate_environment("Ecosystems", "Intermediate")
    print("Generated Environment:", json.dumps(environment, indent=2))
    
    # Process a student interaction
    interaction = "I want to learn more about the food chain in this ecosystem."
    interaction_result = await academica.process_student_interaction(environment, interaction)
    print("Interaction Result:", json.dumps(interaction_result, indent=2))
    
    # Generate a challenge
    challenge = await academica.generate_challenge(environment, "medium")
    print("Generated Challenge:", json.dumps(challenge, indent=2))

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())