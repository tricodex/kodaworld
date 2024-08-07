import { apiRequest } from '@/utils/apiUtils';
import {
  ChatMessage,
  ChatResponse,
  CurriculumData,
  PerformanceData,
  LearningGoal,
  Environment,
  Challenge,
  UserProfile,
  UserEngagement,
  UserAchievement,
  Recommendation,
  User,
  ApiError,
  AITutorRequest,
  ChatMessageRequest
} from '@/types/api';

const characterPrompts = {
  wake: "You are Wake, the musical whale, a guide through the world of music and sound. Share your knowledge about music theory, instruments, composers, and musical history. Be enthusiastic and encourage musical exploration.",
  levo: "You are Levo, the scholarly lion, ready to unravel the mysteries of science, math and programming. Explain complex concepts in simple terms and encourage scientific thinking and problem-solving.",
  mina: "You are Mina, the globetrotting monkey, an expert in geography, cultures, and space exploration. Share interesting facts about different countries, cultures, and astronomical phenomena. Be adventurous and curious.",
  ella: "You are Ella, the wise elephant, here to make history come alive. Discuss historical events, figures, and their impact on the world. Provide context and connections between different periods in history.",
  koda: "You are Koda, a friendly and knowledgeable Koda. You're here to help with any questions across various subjects, encouraging learning and exploration."
};

// export const sendChatMessage = async (character: keyof typeof characterPrompts, message: string, id: string): Promise<ChatResponse> => {
//   try {
//     return await apiRequest<ChatResponse>('/api/ai-tutor', {
//       method: 'POST',
//       body: JSON.stringify({ 
//         message, 
//         studentId: id, 
//         systemPrompt: characterPrompts[character],
//         character
//       }),
//     });
//   } catch (error) {
//     throw error as ApiError;
//   }
// };

export const sendChatMessage = async (
  character: keyof typeof characterPrompts,
  data: ChatMessageRequest
): Promise<ChatResponse> => {
  try {
    const aiTutorRequest: AITutorRequest = {
      ...data,
      character,
      systemPrompt: characterPrompts[character],
    };

    return await apiRequest<ChatResponse>('/api/ai-tutor', {
      method: 'POST',
      body: JSON.stringify(aiTutorRequest),
    });
  } catch (error) {
    throw error as ApiError;
  }
};

export const getConversationHistory = async (studentId: string, character: string): Promise<ChatMessage[]> => {
  try {
    const response = await apiRequest<{ history: ChatMessage[] }>(`/api/conversation-history/${studentId}/${character}`);
    return response.history;
  } catch (error) {
    throw error as ApiError;
  }
};

export const clearConversationHistory = async (studentId: string, character: string): Promise<void> => {
  try {
    await apiRequest(`/api/clear-history/${studentId}/${character}`, { method: 'POST' });
  } catch (error) {
    throw error as ApiError;
  }
};

export const collectFeedback = async (studentId: string, feedback: string): Promise<void> => {
  try {
    await apiRequest(`/api/collect-feedback/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    });
  } catch (error) {
    throw error as ApiError;
  }
};

export const getLearningProgress = async (studentId: string): Promise<number> => {
  try {
    const response = await apiRequest<{ progress: number }>(`/api/learning-progress/${studentId}`);
    return response.progress;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getNextSteps = async (studentId: string): Promise<string[]> => {
  try {
    const response = await apiRequest<{ nextSteps: string[] }>(`/api/next-steps/${studentId}`);
    return response.nextSteps;
  } catch (error) {
    throw error as ApiError;
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
    throw error as ApiError;
  }
};

export const getCurriculum = async (curriculumId: string): Promise<CurriculumData> => {
  try {
    const response = await apiRequest<{ curriculum: CurriculumData }>(`/api/curriculum/${curriculumId}`);
    return response.curriculum;
  } catch (error) {
    throw error as ApiError;
  }
};

export const matchPeers = async (users: User[], groupSize: number): Promise<string[][]> => {
  try {
    const response = await apiRequest<{ matches: string[][] }>('/api/match-peers', {
      method: 'POST',
      body: JSON.stringify({ users, groupSize }),
    });
    return response.matches;
  } catch (error) {
    throw error as ApiError;
  }
};

export const generateAchievements = async (curriculum: CurriculumData): Promise<any> => {
  try {
    const response = await apiRequest<{ achievementSystem: any }>('/api/generate-achievements', {
      method: 'POST',
      body: JSON.stringify(curriculum),
    });
    return response.achievementSystem;
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateAchievements = async (studentId: string, progress: { [key: string]: number }, achievementSystem: any): Promise<any> => {
  try {
    const response = await apiRequest<{ achievementUpdates: any }>(`/api/update-achievements/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({ progress, achievementSystem }),
    });
    return response.achievementUpdates;
  } catch (error) {
    throw error as ApiError;
  }
};

export const generateChallenges = async (studentId: string, progress: { [key: string]: number }, achievementSystem: any): Promise<Challenge[]> => {
  try {
    const response = await apiRequest<{ challenges: Challenge[] }>(`/api/generate-challenges/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({ progress, achievementSystem }),
    });
    return response.challenges;
  } catch (error) {
    throw error as ApiError;
  }
};

export const calculateEngagement = async (studentId: string, activityLog: any[]): Promise<number> => {
  try {
    const response = await apiRequest<{ engagementScore: number }>(`/api/calculate-engagement/${studentId}`, {
      method: 'POST',
      body: JSON.stringify(activityLog),
    });
    return response.engagementScore;
  } catch (error) {
    throw error as ApiError;
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
    throw error as ApiError;
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
    throw error as ApiError;
  }
};

export const generateImage = async (prompt: string, size: string = "1024x1024", quality: string = "standard", n: number = 1): Promise<string> => {
  try {
    const response = await apiRequest<{ url: string }>('/api/generate-image', {
      method: 'POST',
      body: JSON.stringify({ prompt, size, quality, n }),
    });
    return response.url;
  } catch (error) {
    throw error as ApiError;
  }
};

export const generateEnvironmentWithImage = async (topic: string, complexity: string): Promise<Environment> => {
  try {
    const response = await apiRequest<{ environment: Environment }>('/api/generate-environment-with-image', {
      method: 'POST',
      body: JSON.stringify({ topic, complexity }),
    });
    return response.environment;
  } catch (error) {
    throw error as ApiError;
  }
};

export const generateAchievementBadge = async (achievement: { name: string, description: string }): Promise<string> => {
  try {
    const response = await apiRequest<{ badge_url: string }>('/api/generate-achievement-badge', {
      method: 'POST',
      body: JSON.stringify(achievement),
    });
    return response.badge_url;
  } catch (error) {
    throw error as ApiError;
  }
};

export const recommendResources = async (userId: string, learningStyle: string, currentFocus: string, skillLevel: string): Promise<any> => {
  try {
    const response = await apiRequest<{ resources: any }>('/api/recommend-resources', {
      method: 'POST',
      body: JSON.stringify({ userId, learningStyle, currentFocus, skillLevel }),
    });
    return response.resources;
  } catch (error) {
    throw error as ApiError;
  }
};

export const generateElement = async (elementType: string, params: any): Promise<any> => {
  try {
    const response = await apiRequest<any>('/api/generate-element', {
      method: 'POST',
      body: JSON.stringify({ element_type: elementType, params }),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const createUser = async (user: User): Promise<User> => {
  try {
    const response = await apiRequest<User>('/api/user', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getUser = async (userId: number): Promise<User> => {
  try {
    const response = await apiRequest<User>(`/api/user/${userId}`);
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const createUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    const response = await apiRequest<UserProfile>('/api/user-profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  try {
    const response = await apiRequest<UserProfile>(`/api/user-profile/${userId}`);
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const createUserEngagement = async (engagement: UserEngagement): Promise<UserEngagement> => {
  try {
    const response = await apiRequest<UserEngagement>('/api/user-engagement', {
      method: 'POST',
      body: JSON.stringify(engagement),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getUserEngagements = async (userId: number): Promise<UserEngagement[]> => {
  try {
    const response = await apiRequest<UserEngagement[]>(`/api/user-engagement/${userId}`);
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const createUserAchievement = async (achievement: UserAchievement): Promise<UserAchievement> => {
  try {
    const response = await apiRequest<UserAchievement>('/api/user-achievement', {
      method: 'POST',
      body: JSON.stringify(achievement),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getUserAchievements = async (userId: number): Promise<UserAchievement[]> => {
  try {
    const response = await apiRequest<UserAchievement[]>(`/api/user-achievement/${userId}`);
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const createRecommendation = async (recommendation: Recommendation): Promise<Recommendation> => {
  try {
    const response = await apiRequest<Recommendation>('/api/recommendation', {
      method: 'POST',
      body: JSON.stringify(recommendation),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getUserRecommendations = async (userId: number): Promise<Recommendation[]> => {
  try {
    const response = await apiRequest<Recommendation[]>(`/api/recommendation/${userId}`);
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const createEnvironment = async (environment: Environment): Promise<Environment> => {
  try {
    const response = await apiRequest<Environment>('/api/environment', {
      method: 'POST',
      body: JSON.stringify(environment),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const getEnvironment = async (environmentId: number): Promise<Environment> => {
  try {
    const response = await apiRequest<Environment>(`/api/environment/${environmentId}`);
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateUser = async (userId: number, userUpdate: Partial<User>): Promise<User> => {
  try {
    const response = await apiRequest<User>(`/api/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userUpdate),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await apiRequest(`/api/user/${userId}`, { method: 'DELETE' });
  } catch (error) {
    throw error as ApiError;
  }
};

export const updateUserProfile = async (userId: number, profileUpdate: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await apiRequest<UserProfile>(`/api/user-profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileUpdate),
    });
    return response;
  } catch (error) {
    throw error as ApiError;
  }
};

export const deleteUserProfile = async (userId: number): Promise<void> => {
  try {
    await apiRequest(`/api/user-profile/${userId}`, { method: 'DELETE' });
  } catch (error) {
    throw error as ApiError;
  }
};
