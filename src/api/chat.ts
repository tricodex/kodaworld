  import { apiRequest } from '@/utils/apiUtils';
  import { ChatMessage, ChatResponse } from '@/types/api';

  const characterPrompts = {
    wake: "You are Wake, the musical whale, a guide through the world of music and sound. Share your knowledge about music theory, instruments, composers, and musical history. Be enthusiastic and encourage musical exploration.",
    levo: "You are Levo, the scholarly lion, ready to unravel the mysteries of science, math and programming. Explain complex concepts in simple terms and encourage scientific thinking and problem-solving.",
    mina: "You are Mina, the globetrotting monkey, an expert in geography, cultures, and space exploration. Share interesting facts about different countries, cultures, and astronomical phenomena. Be adventurous and curious.",
    ella: "You are Ella, the wise elephant, here to make history come alive. Discuss historical events, figures, and their impact on the world. Provide context and connections between different periods in history.",
    koda: "You are Koda, a friendly and knowledgeable AI Tutor. You're here to help with any questions across various subjects, encouraging learning and exploration."
  };

  export const sendChatMessage = (character: string, message: string) =>
    apiRequest<ChatResponse>('/api/ai-tutor', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        studentId: "student_01", 
        systemPrompt: characterPrompts[character as keyof typeof characterPrompts] 
      }),
    });

  export const getConversationHistory = (studentId: string) =>
    apiRequest<ChatMessage[]>(`/api/conversation-history/${studentId}`);

  export const clearConversationHistory = (studentId: string) =>
    apiRequest(`/api/clear-history/${studentId}`, { method: 'POST' });

  export const collectFeedback = (studentId: string, feedback: string) =>
    apiRequest(`/api/collect-feedback/${studentId}`, {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    });

  export const getLearningProgress = (studentId: string) =>
    apiRequest<{ progress: number }>(`/api/learning-progress/${studentId}`);

  export const getNextSteps = (studentId: string) =>
    apiRequest(`/api/next-steps/${studentId}`);

  export const optimizeCurriculum = (currentCurriculum: any, performanceData: any, learningGoals: string[]) =>
    apiRequest('/api/optimize-curriculum', {
      method: 'POST',
      body: JSON.stringify({ currentCurriculum, performanceData, learningGoals }),
    });

  export const getCurriculum = (curriculumId: string) =>
    apiRequest<{ curriculum: any }>(`/api/curriculum/${curriculumId}`);

