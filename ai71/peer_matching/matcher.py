# ai71/peer_matching/matcher.py

"""
KodaWorld PeerMatcher Module

This module provides functionality to optimally form peer groups based on user profiles. It calculates compatibility between users
and uses probabilistic methods to form groups that maximize overall compatibility. 

Classes:
    User: A Pydantic model representing a user's profile.
    PeerMatcher: A class for finding optimal peer matches, evaluating group compatibility, and forming groups.

Compatibility Metrics:
    - Skill Complementarity: Measures how well users' skills complement each other.
    - Learning Style Diversity: Ensures a mix of different learning styles within each group.
    - Interest Overlap: Measures the overlap in interests among group members.
    - Personality Dynamics: Assesses the balance of personality traits within the group.

Methods:
    - calculate_skill_complementarity: Calculates the complementarity of skills between two users.
    - calculate_learning_style_diversity: Calculates the diversity of learning styles between two users.
    - calculate_interest_overlap: Calculates the overlap in interests between two users.
    - calculate_personality_dynamics: Calculates the balance of personality traits between two users.
    - calculate_pair_compatibility: Calculates an overall compatibility score for a pair of users.
    - generate_initial_groups: Generates initial random groups.
    - evaluate_group: Evaluates the overall compatibility of a group.
    - monte_carlo_group_formation: Uses a Monte Carlo simulation to form groups and optimize compatibility.

Usage Example:
    See the __main__ section for an example of how to use the PeerMatcher class to form groups and evaluate their compatibility.
"""

from typing import List, Dict
from pydantic import BaseModel
import numpy as np
import logging

class User(BaseModel):
    id: int
    name: str
    skills: Dict[str, float]
    learning_style: str
    interests: List[str]
    personality_traits: List[str]

class PeerMatcher:
    def __init__(self):
        self.logger = self._setup_logger()

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def calculate_skill_complementarity(self, user1: User, user2: User) -> float:
        common_skills = set(user1.skills.keys()).intersection(set(user2.skills.keys()))
        if not common_skills:
            return 0.0
        score = sum(abs(user1.skills[skill] - user2.skills[skill]) for skill in common_skills) / len(common_skills)
        return 1 - score  # Higher score for higher complementarity

    def calculate_learning_style_diversity(self, user1: User, user2: User) -> float:
        return 1.0 if user1.learning_style != user2.learning_style else 0.0

    def calculate_interest_overlap(self, user1: User, user2: User) -> float:
        common_interests = set(user1.interests).intersection(set(user2.interests))
        total_interests = set(user1.interests).union(set(user2.interests))
        return len(common_interests) / len(total_interests)

    def calculate_personality_dynamics(self, user1: User, user2: User) -> float:
        common_traits = set(user1.personality_traits).intersection(set(user2.personality_traits))
        total_traits = set(user1.personality_traits).union(set(user2.personality_traits))
        return len(common_traits) / len(total_traits)

    def calculate_pair_compatibility(self, user1: User, user2: User) -> float:
        skill_complementarity = self.calculate_skill_complementarity(user1, user2)
        learning_style_diversity = self.calculate_learning_style_diversity(user1, user2)
        interest_overlap = self.calculate_interest_overlap(user1, user2)
        personality_dynamics = self.calculate_personality_dynamics(user1, user2)
        
        # Weighted average of all factors
        return (0.4 * skill_complementarity + 
                0.2 * learning_style_diversity + 
                0.2 * interest_overlap + 
                0.2 * personality_dynamics)

    def generate_initial_groups(self, users: List[User], group_size: int) -> List[List[int]]:
        np.random.shuffle(users)
        groups = [users[i:i + group_size] for i in range(0, len(users), group_size)]
        return groups

    def evaluate_group(self, group: List[User]) -> float:
        n = len(group)
        total_compatibility = 0.0
        for i in range(n):
            for j in range(i + 1, n):
                total_compatibility += self.calculate_pair_compatibility(group[i], group[j])
        return total_compatibility / (n * (n - 1) / 2)

    def monte_carlo_group_formation(self, users: List[User], group_size: int, iterations: int = 1000) -> List[List[int]]:
        best_groups = []
        best_score = -1

        for _ in range(iterations):
            np.random.shuffle(users)
            groups = self.generate_initial_groups(users, group_size)
            avg_score = np.mean([self.evaluate_group(group) for group in groups])

            if avg_score > best_score:
                best_score = avg_score
                best_groups = groups

        self.logger.info(f"Best average compatibility score: {best_score}")
        return best_groups, best_score

# Usage example
if __name__ == "__main__":
    users = [
        User(id=0, name="Alice", skills={"math": 0.8, "programming": 0.6}, learning_style="visual", interests=["AI", "data science"], personality_traits=["creative", "analytical"]),
        User(id=1, name="Bob", skills={"math": 0.6, "programming": 0.9}, learning_style="kinesthetic", interests=["web development", "game design"], personality_traits=["outgoing", "practical"]),
        User(id=2, name="Charlie", skills={"math": 0.7, "programming": 0.7}, learning_style="auditory", interests=["cybersecurity", "networking"], personality_traits=["detail-oriented", "curious"]),
        User(id=3, name="Diana", skills={"math": 0.9, "programming": 0.5}, learning_style="visual", interests=["machine learning", "statistics"], personality_traits=["organized", "logical"]),
        User(id=4, name="Eve", skills={"math": 0.5, "programming": 0.8}, learning_style="kinesthetic", interests=["mobile app development", "UI/UX"], personality_traits=["creative", "empathetic"]),
        User(id=5, name="Frank", skills={"math": 0.7, "programming": 0.7}, learning_style="auditory", interests=["database systems", "cloud computing"], personality_traits=["analytical", "team-player"]),
    ]
    
    matcher = PeerMatcher()
    groups, best_score = matcher.monte_carlo_group_formation(users, group_size=3)
    for group in groups:
        print([user.name for user in group])
    print(f"Best Average Compatibility Score: {best_score}")