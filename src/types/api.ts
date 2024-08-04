export interface ChatMessage {
    type: 'user' | 'assistant';
    value: string;
  }
  
  export interface ChatResponse {
    response: string;
  }
  
  export interface LearningProgress {
    progress: number;
  }
  
  export interface NextSteps {
    steps: string[];
  }
  
  export interface OptimizedCurriculum {
    curriculum: any;  // Define a more specific type based on your curriculum structure
  }