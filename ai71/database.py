# ai71/database.py
import os
from sqlalchemy import create_engine, Column, Integer, Text, Float, ForeignKey, String, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from alembic import command
from alembic.config import Config
from datetime import datetime

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True, nullable=False)
#     email = Column(String, unique=True, index=True, nullable=False)
#     hashed_password = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Curriculum(Base):
    __tablename__ = "curriculums"

    id = Column(Integer, primary_key=True, index=True)
    curriculum = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PerformanceData(Base):
    __tablename__ = "performance_data"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    chapter = Column(Text, nullable=False)
    score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    curriculum = relationship("Curriculum", back_populates="performance_data")
    user = relationship("User", back_populates="performance_data")

# class LearningGoal(Base):
#     __tablename__ = "learning_goals"

#     id = Column(Integer, primary_key=True, index=True)
#     curriculum_id = Column(Integer, ForeignKey("curriculums.id"))
#     user_id = Column(Integer, ForeignKey("users.id"))
#     goal = Column(Text, nullable=False)

#     curriculum = relationship("Curriculum", back_populates="learning_goals")
#     user = relationship("User", back_populates="learning_goals")

class ConversationHistory(Base):
    __tablename__ = "conversation_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    character = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    is_ai_response = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="conversations")

class Environment(Base):
    __tablename__ = "environments"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    complexity = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    elements = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    criteria = Column(Text, nullable=False)
    points = Column(Integer, nullable=False)

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")

class UserEngagement(Base):
    __tablename__ = "user_engagements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    engagement_score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="engagements")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    skills = Column(JSON, nullable=False)
    learning_style = Column(String, nullable=False)
    interests = Column(JSON, nullable=False)

    user = relationship("User", back_populates="profile")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resource_title = Column(String, nullable=False)
    resource_url = Column(String, nullable=False)
    recommended_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recommendations")

User.performance_data = relationship("PerformanceData", back_populates="user")
# User.learning_goals = relationship("LearningGoal", back_populates="user")
User.conversations = relationship("ConversationHistory", back_populates="user")
User.achievements = relationship("UserAchievement", back_populates="user")
User.engagements = relationship("UserEngagement", back_populates="user")
User.profile = relationship("UserProfile", back_populates="user", uselist=False)
User.recommendations = relationship("Recommendation", back_populates="user")

Curriculum.performance_data = relationship("PerformanceData", back_populates="curriculum")
# Curriculum.learning_goals = relationship("LearningGoal", back_populates="curriculum")

def init_db():
    Base.metadata.create_all(bind=engine)

def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")