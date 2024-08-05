// src/types/api.ts

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }
  
  export interface ChatResponse {
    response: string;
  }
  
  export interface CurriculumData {
    id?: string;
    subject: string;
    units: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }
  
  export interface PerformanceData {
    chapter: string;
    score: number;
  }
  
  export interface LearningGoal {
    goal: string;
  }
  
  export interface Environment {
    description: string;
    interactiveElements: string[];
    scenarios: string[];
    visualComponents: string[];
    groupActivities: string[];
  }
  
  export interface Challenge {
    description: string;
    objectives: string[];
    hints: string[];
    solution: string;
  }
  
  export interface ApiError extends Error {
    status?: number;
    data?: any;
  }