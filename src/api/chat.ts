import { apiRequest } from '@/utils/apiUtils';
import { ChatMessage, ChatResponse } from '@/types/api';

const characterPrompts = {
  wake: "You are Wake, the musical whale, a guide through the world of music and sound. Share your knowledge about music theory, instruments, composers, and musical history. Be enthusiastic and encourage musical exploration.",
  levo: "You are Levo, the scholarly lion, ready to unravel the mysteries of science, math and programming. Explain complex concepts in simple terms and encourage scientific thinking and problem-solving.",
  mina: "You are Mina, the globetrotting monkey, an expert in geography, cultures, and space exploration. Share interesting facts about different countries, cultures, and astronomical phenomena. Be adventurous and curious.",
  ella: "You are Ella, the wise elephant, here to make history come alive. Discuss historical events, figures, and their impact on the world. Provide context and connections between different periods in history.",
  koda: "You are Koda, a friendly and knowledgeable Koda. You're here to help with any questions across various subjects, encouraging learning and exploration."
};

export const sendChatMessage = async (character: string, message: string, id: string = "student_01"): Promise<ChatResponse> => {
  try {
    const response = await apiRequest<ChatResponse>('/api/ai-tutor', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        studentId: id, 
        systemPrompt: characterPrompts[character as keyof typeof characterPrompts],
        character: character  // Add this line to pass the character information
      }),
    });
    return response;
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw new Error('Failed to send chat message');
  }
};

export const getConversationHistory = async (studentId: string): Promise<ChatMessage[]> => {
  try {
    const response = await apiRequest<{ history: ChatMessage[] }>(`/api/conversation-history/${studentId}`);
    return response.history;
  } catch (error) {
    console.error('Error in getConversationHistory:', error);
    throw new Error('Failed to fetch conversation history');
  }
};

export const clearConversationHistory = async (studentId: string): Promise<void> => {
  try {
    await apiRequest(`/api/clear-history/${studentId}`, { method: 'POST' });
  } catch (error) {
    console.error('Error in clearConversationHistory:', error);
    throw new Error('Failed to clear conversation history');
  }
};

export const collectFeedback = async (studentId: string, feedback: string): Promise<void> => {
  try {
    await apiRequest(`/api/collect-feedback/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    });
  } catch (error) {
    console.error('Error in collectFeedback:', error);
    throw new Error('Failed to collect feedback');
  }
};

export const getLearningProgress = async (studentId: string): Promise<number> => {
  try {
    const response = await apiRequest<{ progress: number }>(`/api/learning-progress/${studentId}`);
    return response.progress;
  } catch (error) {
    console.error('Error in getLearningProgress:', error);
    throw new Error('Failed to fetch learning progress');
  }
};

export const getNextSteps = async (studentId: string): Promise<string[]> => {
  try {
    const response = await apiRequest<{ nextSteps: string[] }>(`/api/next-steps/${studentId}`);
    return response.nextSteps;
  } catch (error) {
    console.error('Error in getNextSteps:', error);
    throw new Error('Failed to fetch next steps');
  }
};

export const optimizeCurriculum = async (currentCurriculum: any, performanceData: any, learningGoals: string[]): Promise<any> => {
  try {
    const response = await apiRequest('/api/optimize-curriculum', {
      method: 'POST',
      body: JSON.stringify({ currentCurriculum, performanceData, learningGoals }),
    });
    return response;
  } catch (error) {
    console.error('Error in optimizeCurriculum:', error);
    throw new Error('Failed to optimize curriculum');
  }
};

export const getCurriculum = async (curriculumId: string): Promise<any> => {
  try {
    const response = await apiRequest<{ curriculum: any }>(`/api/curriculum/${curriculumId}`);
    return response.curriculum;
  } catch (error) {
    console.error('Error in getCurriculum:', error);
    throw new Error('Failed to fetch curriculum');
  }
};

export const matchPeers = async (studentId: string): Promise<string[]> => {
  try {
    const response = await apiRequest<{ matches: string[] }>('/api/match-peers', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
    return response.matches;
  } catch (error) {
    console.error('Error in matchPeers:', error);
    throw new Error('Failed to find peer matches');
  }
};

export const getAchievements = async (studentId: string): Promise<string[]> => {
  try {
    const response = await apiRequest<{ achievements: string[] }>(`/api/achievements/${studentId}`);
    return response.achievements;
  } catch (error) {
    console.error('Error in getAchievements:', error);
    throw new Error('Failed to get achievements');
  }
};

export const generateChallenges = async (studentId: string): Promise<string[]> => {
  try {
    const response = await apiRequest<{ challenges: string[] }>('/api/generate-challenges', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
    return response.challenges;
  } catch (error) {
    console.error('Error in generateChallenges:', error);
    throw new Error('Failed to generate challenges');
  }
};

export const generateEnvironment = async (topic: string, complexity: string): Promise<string> => {
  try {
    const response = await apiRequest<{ environment: string }>('/api/generate-environment', {
      method: 'POST',
      body: JSON.stringify({ topic, complexity }),
    });
    return response.environment;
  } catch (error) {
    console.error('Error in generateEnvironment:', error);
    throw new Error('Failed to generate environment');
  }
};