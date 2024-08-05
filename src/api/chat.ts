import { apiRequest, handleApiError } from '@/utils/apiUtils';
import { ChatMessage, ChatResponse, CurriculumData, PerformanceData, LearningGoal, Environment, Challenge } from '@/types/api';

const characterPrompts = {
  wake: "You are Wake, the musical whale, a guide through the world of music and sound. Share your knowledge about music theory, instruments, composers, and musical history. Be enthusiastic and encourage musical exploration.",
  levo: "You are Levo, the scholarly lion, ready to unravel the mysteries of science, math and programming. Explain complex concepts in simple terms and encourage scientific thinking and problem-solving.",
  mina: "You are Mina, the globetrotting monkey, an expert in geography, cultures, and space exploration. Share interesting facts about different countries, cultures, and astronomical phenomena. Be adventurous and curious.",
  ella: "You are Ella, the wise elephant, here to make history come alive. Discuss historical events, figures, and their impact on the world. Provide context and connections between different periods in history.",
  koda: "You are Koda, a friendly and knowledgeable Koda. You're here to help with any questions across various subjects, encouraging learning and exploration."
};

export const sendChatMessage = async (character: string, message: string, id: string): Promise<ChatResponse> => {
  try {
    return await apiRequest<ChatResponse>('/api/ai-tutor', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        studentId: id, 
        systemPrompt: characterPrompts[character as keyof typeof characterPrompts],
        character: character
      }),
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getConversationHistory = async (studentId: string, character: string): Promise<ChatMessage[]> => {
  try {
    const response = await apiRequest<{ history: ChatMessage[] }>(`/api/conversation-history/${studentId}/${character}`);
    return response.history;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const clearConversationHistory = async (studentId: string, character: string): Promise<void> => {
  try {
    await apiRequest(`/api/clear-history/${studentId}/${character}`, { method: 'POST' });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const collectFeedback = async (studentId: string, feedback: string): Promise<void> => {
  try {
    await apiRequest(`/api/collect-feedback/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getLearningProgress = async (studentId: string): Promise<number> => {
  try {
    const response = await apiRequest<{ progress: number }>(`/api/learning-progress/${studentId}`);
    return response.progress;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getNextSteps = async (studentId: string): Promise<string[]> => {
  try {
    const response = await apiRequest<{ nextSteps: string[] }>(`/api/next-steps/${studentId}`);
    return response.nextSteps;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const optimizeCurriculum = async (currentCurriculum: CurriculumData, performanceData: PerformanceData[], learningGoals: LearningGoal[]): Promise<CurriculumData> => {
  try {
    const response = await apiRequest<{ optimizedCurriculum: CurriculumData }>('/api/optimize-curriculum', {
      method: 'POST',
      body: JSON.stringify({ currentCurriculum, performanceData, learningGoals }),
    });
    return response.optimizedCurriculum;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getCurriculum = async (curriculumId: string): Promise<CurriculumData> => {
  try {
    const response = await apiRequest<{ curriculum: CurriculumData }>(`/api/curriculum/${curriculumId}`);
    return response.curriculum;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const matchPeers = async (users: any[], groupSize: number): Promise<string[][]> => {
  try {
    const response = await apiRequest<{ matches: string[][] }>('/api/match-peers', {
      method: 'POST',
      body: JSON.stringify({ users, groupSize }),
    });
    return response.matches;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getAchievements = async (studentId: string): Promise<string[]> => {
  try {
    const response = await apiRequest<{ achievements: string[] }>(`/api/achievements/${studentId}`);
    return response.achievements;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const generateChallenges = async (studentId: string, progress: { [key: string]: number }, achievementSystem: any): Promise<string[]> => {
  try {
    const response = await apiRequest<{ challenges: string[] }>('/api/generate-challenges', {
      method: 'POST',
      body: JSON.stringify({ studentId, progress, achievementSystem }),
    });
    return response.challenges;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const generateEnvironment = async (topic: string, complexity: string): Promise<Environment> => {
  try {
    const response = await apiRequest<{ environment: Environment }>('/api/generate-environment', {
      method: 'POST',
      body: JSON.stringify({ topic, complexity }),
    });
    return response.environment;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const generateChallenge = async (environment: Environment, difficulty: string): Promise<Challenge> => {
  try {
    const response = await apiRequest<{ challenge: Challenge }>('/api/generate-challenge', {
      method: 'POST',
      body: JSON.stringify({ environment, difficulty }),
    });
    return response.challenge;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};