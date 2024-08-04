import { apiRequest } from '@/utils/apiUtils';
import { ChatMessage, ChatResponse } from '@/types/api';

export const sendChatMessage = (character: string, message: string) =>
  apiRequest<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({ character, message }),
  });

export const getConversationHistory = (studentId: string) =>
  apiRequest<ChatMessage[]>(`/conversation-history/${studentId}`);

export const clearConversationHistory = (studentId: string) =>
  apiRequest(`/clear-history/${studentId}`, { method: 'POST' });

export const collectFeedback = (studentId: string, feedback: string) =>
  apiRequest(`/collect-feedback/${studentId}`, {
    method: 'POST',
    body: JSON.stringify({ feedback }),
  });

export const getLearningProgress = (studentId: string) =>
  apiRequest(`/learning-progress/${studentId}`);

export const getNextSteps = (studentId: string) =>
  apiRequest(`/next-steps/${studentId}`);

export const optimizeCurriculum = (currentCurriculum: any, performanceData: any, learningGoals: string[]) =>
  apiRequest('/optimize-curriculum', {
    method: 'POST',
    body: JSON.stringify({ currentCurriculum, performanceData, learningGoals }),
  });