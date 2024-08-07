# ai71/dialogue_management/manager.py
import logging
from typing import List, Dict, Any
from datetime import datetime
import random
from sqlalchemy.orm import Session
import json
from ..models import CurriculumData, PerformanceData #, LearningGoal



class DialogueManager:
    def __init__(self):
        self.logger = self._setup_logger()
        self.conversations: Dict[str, Dict[str, List[Dict[str, str]]]] = {}
        self.character_personas = {
            "wake": {
                "name": "Wake",
                "description": "the Witty",
                "traits": ["enthusiastic", "knowledgeable about music", "encouraging"],
                "topics": ["music theory", "instruments", "composers", "musical history"],
                "catchphrases": ["Let's dive into the ocean of music!", "That sounds harmonious!"]
            },
            "levo": {
                "name": "Levo",
                "description": "the Curious",
                "traits": ["analytical", "patient", "curious"],
                "topics": ["science", "math", "programming", "problem-solving"],
                "catchphrases": ["Let's experiment with that idea!", "Fascinating hypothesis!"]
            },
            "mina": {
                "name": "Mina",
                "description": "the Traveler",
                "traits": ["adventurous", "curious", "friendly"],
                "topics": ["geography", "cultures", "space", "travel"],
                "catchphrases": ["Let's embark on a new adventure!", "The world is full of wonders!"]
            },
            "ella": {
                "name": "Ella",
                "description": "the Nostalgic",
                "traits": ["wise", "thoughtful", "insightful"],
                "topics": ["history", "historical figures", "historical impact"],
                "catchphrases": ["History has much to teach us!", "Let's journey through time!"]
            },
            "ai-tutor": {
                "name": "Koda",
                "description": "the AI Tutor",
                "traits": ["adaptable", "encouraging", "patient"],
                "topics": ["various subjects", "learning strategies", "study skills"],
                "catchphrases": ["Learning is an adventure!", "Every question is a step towards knowledge!"]
            }
        }

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger
    
    # def _generate_character_response(self, character: str, content: str) -> str:
    #     persona = self.character_personas.get(character, self.character_personas["ai-tutor"])
    #     response = f"{persona['name']} the {persona['description']} says: {content}"
    #     if random.random() < 0.3:  # 30% chance to add a catchphrase
    #         response += f" {random.choice(persona['catchphrases'])}"
    #     return response
    
    def _generate_character_response(self, character: str, content: str) -> str:
        persona = self.character_personas.get(character, self.character_personas["ai-tutor"])
        response = f"{content}" # Removed persona['name'] and persona['description']
        if random.random() < 0.1:  # 10% chance to add a catchphrase
            response += f" {random.choice(persona['catchphrases'])}"
        return response


    async def process_ai_response(self, response: str, student_id: str, character: str):
        character_response = self._generate_character_response(character, response)
        self.conversations.setdefault(student_id, {}).setdefault(character, []).append({
            "role": "assistant",
            "content": character_response,
            "timestamp": datetime.now().isoformat(),
            "character": character
        })
        return character_response

    # async def get_conversation_history(self, student_id: str, character: str) -> List[Dict[str, str]]:
    async def get_conversation_history(self, student_id: str, character: str):

        try:
            history = self.conversations.get(student_id, {}).get(character, [])
            self.logger.info(f"Retrieved conversation history for student {student_id} with character {character}")
            return history
        except Exception as e:
            self.logger.error(f"Error retrieving conversation history for student {student_id} with character {character}: {str(e)}")
            return []

    async def clear_history(self, student_id: str, character: str):
        try:
            if student_id in self.conversations and character in self.conversations[student_id]:
                self.conversations[student_id][character] = []
            self.logger.info(f"Cleared conversation history for student {student_id} with character {character}")
        except Exception as e:
            self.logger.error(f"Error clearing conversation history for student {student_id} with character {character}: {str(e)}")

    async def collect_feedback(self, student_id: str, feedback: str):
        try:
            self.logger.info(f"Collected feedback from student {student_id}: {feedback}")
            for character in self.conversations.get(student_id, {}):
                self.conversations[student_id][character].append({
                    "role": "feedback",
                    "content": feedback,
                    "timestamp": datetime.now().isoformat()
                })
        except Exception as e:
            self.logger.error(f"Error collecting feedback from student {student_id}: {str(e)}")

    async def analyze_learning_progress(self, student_id: str, db: Session) -> Dict[str, Any]:
        try:
            # Your existing code here, but make sure to use the db parameter if needed
            all_interactions = [
                msg 
                for character_history in self.conversations.get(student_id, {}).values() 
                for msg in character_history
            ]
            interaction_count = len(all_interactions)
            topic_coverage = len(set(msg["character"] for msg in all_interactions if msg["role"] == "assistant"))
            progress = min((interaction_count / 50) * 0.5 + (topic_coverage / len(self.character_personas)) * 0.5, 1.0)
            self.logger.info(f"Analyzed learning progress for student {student_id}")
            return {"progress": progress, "interaction_count": interaction_count, "topic_coverage": topic_coverage}
        except Exception as e:
            self.logger.error(f"Error analyzing learning progress for student {student_id}: {str(e)}")
            return {"progress": 0.0, "interaction_count": 0, "topic_coverage": 0}

    async def recommend_next_steps(self, student_id: str, db: Session) -> List[str]:
        try:
            # Your existing code here, but make sure to use the db parameter if needed
            progress_data = await self.analyze_learning_progress(student_id, db)
            progress = progress_data["progress"]
            recommendations = []
            if progress < 0.3:
                recommendations = [
                    "Continue exploring topics with different KodaWorld characters",
                    "Try out some of the interactive games and activities",
                    "Don't hesitate to ask questions about topics you find interesting"
                ]
            elif progress < 0.7:
                recommendations = [
                    "Dive deeper into topics you've shown interest in",
                    "Challenge yourself with more advanced questions",
                    "Try to make connections between different subjects you've learned about"
                ]
            else:
                recommendations = [
                    "Explore advanced topics in your favorite subjects",
                    "Try teaching what you've learned to others",
                    "Work on a project that combines multiple areas of knowledge"
                ]
            self.logger.info(f"Generated recommendations for student {student_id}")
            return recommendations
        except Exception as e:
            self.logger.error(f"Error generating recommendations for student {student_id}: {str(e)}")
            return ["Continue with your current learning path"]

    async def process_user_input(self, user_input: str, student_id: str, character: str) -> str:
        try:
            self.logger.info(f"Processing input for student {student_id} with character {character}: {user_input}")
            self.conversations.setdefault(student_id, {}).setdefault(character, []).append({
                "role": "user",
                "content": user_input,
                "timestamp": datetime.now().isoformat()
            })
            # This is a placeholder. In a real implementation, you would call your AI model here.
            ai_response = f"Thank you for your question about {user_input}. Let's explore this topic together!"
            character_response = await self.process_ai_response(ai_response, student_id, character)
            return character_response
        except Exception as e:
            self.logger.error(f"Error processing input for student {student_id}: {str(e)}")
            return "I'm sorry, but I encountered an error. Please try again later."

    async def optimize_curriculum(self, current_curriculum: Dict, performance_data: List[Dict], db: Session) -> Dict: #learning_goals: List[str]
        try:
            self.logger.info(f"Optimizing curriculum with current_curriculum={current_curriculum}, performance_data={performance_data}") #, learning_goals={learning_goals}")

            # Simplified optimization logic
            optimized_curriculum = current_curriculum.copy()
            avg_performance = sum(pd['score'] for pd in performance_data) / len(performance_data) if performance_data else 0

            if avg_performance < 0.3:
                optimized_curriculum["difficulty"] = "beginner"
            elif avg_performance < 0.7:
                optimized_curriculum["difficulty"] = "intermediate"
            else:
                optimized_curriculum["difficulty"] = "advanced"

            # Add more topics based on learning goals
            optimized_curriculum["topics"] = list(set(current_curriculum.get("topics", []) )) #+ learning_goals

            # Save the optimized curriculum to the database
            db_curriculum = CurriculumData(
                curriculum=json.dumps(optimized_curriculum),
                character=current_curriculum["character"],
                subject=current_curriculum["subject"],
                difficulty=optimized_curriculum["difficulty"]
            )
            db.add(db_curriculum)
            db.flush()  # This assigns an id to db_curriculum

            self.logger.info(f"Saved curriculum with ID {db_curriculum.id}")

            for pd in performance_data:
                db_performance = PerformanceData(curriculum_id=db_curriculum.id, chapter=pd['chapter'], score=pd['score'])
                db.add(db_performance)
                self.logger.info(f"Saved performance data for chapter {pd['chapter']}")

            # for goal in learning_goals:
            #     db_goal = LearningGoal(curriculum_id=db_curriculum.id, goal=goal)
            #     db.add(db_goal)
            #     self.logger.info(f"Saved learning goal {goal}")

            db.commit()
            db.refresh(db_curriculum)

            return {
                "optimized_curriculum": optimized_curriculum,
                "performance_data": performance_data,
                # "learning_goals": learning_goals,
            }
        except Exception as e:
            self.logger.error(f"Error optimizing curriculum: {str(e)}")
            return {"error": "Unable to optimize curriculum at this time."}