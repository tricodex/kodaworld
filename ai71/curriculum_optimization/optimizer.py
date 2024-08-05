from sqlalchemy.orm import Session
from ..database import SessionLocal, Curriculum
import json
from typing import List, Dict
from ..ai71_api import AI71API
from ..database import SessionLocal, Curriculum, PerformanceData, LearningGoal

class CurriculumOptimizer:
    def __init__(self):
        self.ai_api = AI71API()
    def optimize_curriculum(self, current_curriculum: Dict, performance_data: Dict, learning_goals: List[str]) -> Dict:
        prompt = f"""
        You are an expert curriculum designer. Your task is to create a detailed curriculum based on the following information:

        Current Curriculum:
        {json.dumps(current_curriculum, indent=2)}

        Performance Data:
        {json.dumps(performance_data, indent=2)}

        Learning Goals:
        {json.dumps(learning_goals, indent=2)}

        Please create a curriculum that:
        1. Addresses identified skill gaps and areas of improvement
        2. Incorporates effective learning methods based on performance data
        3. Aligns closely with the specified learning goals
        4. Suggests optimal sequencing of topics and activities
        5. Recommends personalized learning paths for different learner profiles
        6. Includes good starter questions for each specific topic to facilitate learning

        The curriculum should be structured as follows:
        1. Overview
        2. Learning Objectives
        3. Chapters (each with sub-topics, key concepts, and starter questions)
        4. Assessment Methods
        5. Resources

        Ensure that all sections are properly indexed for easy navigation and reference.

        Return the curriculum as a detailed JSON object.
        """
        
        messages = [
            {"role": "system", "content": "You are an AI curriculum optimization expert."},
            {"role": "user", "content": prompt}
        ]
        
        response = self.ai_api.chat_completion(messages)
        
        try:
            optimized_curriculum = json.loads(response['choices'][0]['message']['content'])
            self.save_curriculum(optimized_curriculum)
            return optimized_curriculum
        except json.JSONDecodeError:
            raise ValueError("The AI response could not be parsed as JSON. Please try again.")

    def save_curriculum(self, curriculum: Dict, performance_data: Dict, learning_goals: List[str]):
        db: Session = SessionLocal()
        db_curriculum = Curriculum(curriculum=json.dumps(curriculum))
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
