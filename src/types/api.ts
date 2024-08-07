// src/types/api.ts

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }
  
  export interface ChatResponse {
    response: string;
  }
  
  export interface CurriculumData { // id?: str; // Remove this field
    character: string;
    subject: string;
    units: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }
  
  export interface PerformanceData {
    chapter: string;
    score: number;
  }
  
  export interface CurriculumOptimizationInput {
    current_curriculum: CurriculumData;
    performance_data: PerformanceData[];
    // learning_goals: string[];
  }
  
  export interface LearningGoal {
    goal: string;
  }
  
  export interface Environment {
    id?: number;
    topic: string;
    complexity: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
    elements: string[];
    interactiveElements: string[];
    scenarios: string[];
    visualComponents: string[];
    groupActivities: string[];
    created_at?: string;
    image_url?: string;
  }
  
  export interface Challenge {
    id?: number;
    description: string;
    objectives: string[];
    hints: string[];
    solution: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }
  
  export interface ApiError extends Error {
    status?: number;
    data?: any;
  }
  
  
  
  export interface User {
    id: string; // Change this to string to match the server-side model
    username: string;
    email: string;
    hashed_password?: string;
    created_at?: string;
  }
  
  
  export interface UserProfile {
    id?: number;
    user_id: number;
    skills: { [key: string]: number };
    learning_style: string;
    interests: string[];
  }
  
  export interface UserEngagement {
    id?: number;
    user_id: number;
    engagement_score: number;
    timestamp?: string;
  }
  
  export interface Achievement {
    id?: number;
    name: string;
    description: string;
    criteria: string;
    points: number;
    badge_url?: string;
  }
  
  export interface UserAchievement {
    id?: number;
    user_id: number;
    achievement_id: number;
    unlocked_at?: string;
    achievement?: Achievement;
  }
  
  export interface Recommendation {
    id?: number;
    user_id: number;
    resource_title: string;
    resource_url: string;
    recommended_at?: string;
  }
  
  export interface PeerMatchingRequest {
    users: User[];
    groupSize: number;
  }
  
  export interface EnvironmentGenerationRequest {
    topic: string;
    complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  }
  
  export interface ImageGenerationRequest {
    prompt: string;
    size?: string;
    quality?: string;
    n?: number;
  }
  
  export interface AchievementCreate {
    name: string;
    description: string;
    criteria: string;
    points: number;
  }
  
  export interface UserProfileCreate {
    user_id: number;
    skills: { [key: string]: number };
    learning_style: string;
    interests: string[];
  }
  
  export interface UserEngagementCreate {
    user_id: number;
    engagement_score: number;
  }
  
  export interface RecommendationCreate {
    user_id: number;
    resource_title: string;
    resource_url: string;
  }

  export interface AITutorRequest {
    id: string;
    username: string;
    email: string;
    message: string;
    character: string; // Add this field
    systemPrompt: string; // Add this field
  }

  export interface ChatMessageRequest {
    id: string;
    username: string;
    email: string;
    message: string;
  }