import { apiRequest } from '@/utils/apiUtils';

export const sendChatMessage = (character: string, message: string) =>
  apiRequest('/chat', {
    method: 'POST',
    body: JSON.stringify({ character, message }),
  });
