export interface ChatMessage {
  type: 'user' | 'assistant';
  value: string;
}

export interface ChatResponse {
  response: string;
}
