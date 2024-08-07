from sqlalchemy.orm import Session
from ..database import SessionLocal, Curriculum
import json
from typing import List, Dict
from ..api import OpenAIAPI
from ..database import PerformanceData, LearningGoal

class CurriculumGenerator:
    def __init__(self):
        self.ai_api = OpenAIAPI()

    def optimize_curriculum(self, character: str, subject: str, difficulty: str, chapters: List[str], performance_data: Dict[str, float], learning_goals: List[str]) -> Dict:
        system_message = """
        You are an expert curriculum designer. Your task is to generate a structured curriculum based on the provided information.
        Always return your response in the following JSON format, ensuring all fields are filled:

        {
            "overview": "A concise summary of the curriculum",
            "learning_objectives": ["List of specific, measurable learning objectives"],
            "chapters": [
                {
                    "title": "Chapter title",
                    "sub_topics": ["List of sub-topics covered in this chapter"],
                    "key_concepts": ["List of key concepts to be learned"],
                    "starter_questions": ["List of thought-provoking questions to introduce the chapter"],
                    "activities": ["List of engaging learning activities"],
                    "resources": ["List of recommended resources for this chapter"]
                }
            ],
            "assessment_methods": ["List of varied assessment methods"],
            "personalized_paths": [
                {
                    "learner_profile": "Description of learner type",
                    "recommended_approach": "Tailored learning approach"
                }
            ],
            "overall_resources": ["List of general resources for the entire curriculum"]
        }

        Ensure your response is a valid JSON object that can be parsed and stored in a database.
        """

        user_prompt = f"""
        Generate a detailed curriculum based on the following information:

        Character: {character}
        Subject: {subject}
        Difficulty: {difficulty}
        Chapters: {json.dumps(chapters)}
        Performance Data: {json.dumps(performance_data)}
        Learning Goals: {json.dumps(learning_goals)}

        Your curriculum should:
        1. Address identified skill gaps and areas of improvement based on the performance data
        2. Incorporate effective learning methods suitable for the specified character and difficulty level
        3. Align closely with the specified learning goals
        4. Suggest optimal sequencing of topics and activities across the given chapters
        5. Recommend personalized learning paths for at least three different learner profiles
        6. Include engaging starter questions for each chapter to facilitate learning

        Ensure that all sections in the JSON structure are properly filled out, providing comprehensive and relevant content for each field.
        """

        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ]

        response = self.ai_api.chat_completion(messages, model="gpt-4o-mini")
        
        try:
            curriculum_json = json.loads(response.choices[0].message.content)
            self.save_curriculum(curriculum_json, character, subject, difficulty, performance_data, learning_goals)
            return curriculum_json
        except json.JSONDecodeError as e:
            print(f"Error parsing AI response: {e}")
            return {}

    def save_curriculum(self, curriculum: Dict, character: str, subject: str, difficulty: str, performance_data: Dict[str, float], learning_goals: List[str]):
        db: Session = SessionLocal()
        db_curriculum = Curriculum(
            curriculum=json.dumps(curriculum),
            character=character,
            subject=subject,
            difficulty=difficulty
        )
        db.add(db_curriculum)
        db.flush()  # This assigns an id to db_curriculum

        for chapter, score in performance_data.items():
            db_performance = PerformanceData(curriculum_id=db_curriculum.id, chapter=chapter, score=score)
            db.add(db_performance)

        for goal in learning_goals:
            db_goal = LearningGoal(curriculum_id=db_curriculum.id, goal=goal)
            db.add(db_goal)

        db.commit()
        db.refresh(db_curriculum)

    def generate_curriculum_stream(self, character: str, subject: str, difficulty: str, chapters: List[str], performance_data: Dict[str, float], learning_goals: List[str]):
        system_message = """
        You are an expert curriculum designer. Your task is to generate a structured curriculum based on the provided information.
        Always return your response in the following JSON format, ensuring all fields are filled:

        {
            "overview": "A concise summary of the curriculum",
            "learning_objectives": ["List of specific, measurable learning objectives"],
            "chapters": [
                {
                    "title": "Chapter title",
                    "sub_topics": ["List of sub-topics covered in this chapter"],
                    "key_concepts": ["List of key concepts to be learned"],
                    "starter_questions": ["List of thought-provoking questions to introduce the chapter"],
                    "activities": ["List of engaging learning activities"],
                    "resources": ["List of recommended resources for this chapter"]
                }
            ],
            "assessment_methods": ["List of varied assessment methods"],
            "personalized_paths": [
                {
                    "learner_profile": "Description of learner type",
                    "recommended_approach": "Tailored learning approach"
                }
            ],
            "overall_resources": ["List of general resources for the entire curriculum"]
        }

        Ensure your response is a valid JSON object that can be parsed and stored in a database.
        """

        user_prompt = f"""
        Generate a detailed curriculum based on the following information:

        Character: {character}
        Subject: {subject}
        Difficulty: {difficulty}
        Chapters: {json.dumps(chapters)}
        Performance Data: {json.dumps(performance_data)}
        Learning Goals: {json.dumps(learning_goals)}

        Your curriculum should:
        1. Address identified skill gaps and areas of improvement based on the performance data
        2. Incorporate effective learning methods suitable for the specified character and difficulty level
        3. Align closely with the specified learning goals
        4. Suggest optimal sequencing of topics and activities across the given chapters
        5. Recommend personalized learning paths for at least three different learner profiles
        6. Include engaging starter questions for each chapter to facilitate learning

        Ensure that all sections in the JSON structure are properly filled out, providing comprehensive and relevant content for each field.
        """

        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ]

        stream = self.ai_api.stream_chat_completion(messages, model="gpt-4o-mini")
        
        full_response = ""
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_response += content
                yield content

        try:
            curriculum_json = json.loads(full_response)
            self.save_curriculum(curriculum_json, character, subject, difficulty, performance_data, learning_goals)
        except json.JSONDecodeError as e:
            print(f"Error parsing AI response: {e}")