# ai71/database.py
import os
from sqlalchemy import create_engine, Column, Integer, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from alembic import command
from alembic.config import Config



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

class Curriculum(Base):
    __tablename__ = "curriculums"

    id = Column(Integer, primary_key=True, index=True)
    curriculum = Column(Text, nullable=False)

class PerformanceData(Base):
    __tablename__ = "performance_data"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id"))
    chapter = Column(Text, nullable=False)
    score = Column(Float, nullable=False)

    curriculum = relationship("Curriculum", back_populates="performance_data")

class LearningGoal(Base):
    __tablename__ = "learning_goals"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_id = Column(Integer, ForeignKey("curriculums.id"))
    goal = Column(Text, nullable=False)

    curriculum = relationship("Curriculum", back_populates="learning_goals")

Curriculum.performance_data = relationship("PerformanceData", back_populates="curriculum")
Curriculum.learning_goals = relationship("LearningGoal", back_populates="curriculum")

def init_db():
    Base.metadata.create_all(bind=engine)

def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")