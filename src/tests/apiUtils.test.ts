import { 
  sendChatMessage,
  getConversationHistory,
  clearConversationHistory,
  collectFeedback,
  getLearningProgress,
  getNextSteps,
  optimizeCurriculum,
  getCurriculum,
  matchPeers,
  generateAchievements,
  updateAchievements,
  generateChallenges,
  calculateEngagement,
  generateEnvironment,
  generateChallenge,
  generateImage,
  generateEnvironmentWithImage,
  generateAchievementBadge,
  recommendResources,
  generateElement
} from '@/api/chat';
import { handleApiError, apiRequest } from '@/utils/apiUtils';
import { 
  ApiError, 
  ChatMessage, 
  ChatResponse,
  CurriculumData,
  PerformanceData,
  LearningGoal,
  Environment,
  Challenge,
  User,
  AITutorRequest,
  ChatMessageRequest
} from '@/types/api';
import fetchMock from 'jest-fetch-mock';
import { toast } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Enable fetch mocks
fetchMock.enableMocks();

describe('API Utilities', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  describe('Core API Utilities', () => {
    describe('apiRequest', () => {
      it('should make a successful API request', async () => {
        const mockResponse = { data: 'test' };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
      
        const result = await apiRequest<{ data: string }>('/test');
        expect(result).toEqual(mockResponse);
        
        const calls = fetchMock.mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toBe('http://localhost:8000/api/test');
        
        const options = calls[0][1];
        expect(options).toBeDefined();
        expect(options?.headers).toBeDefined();
        
        if (options && options.headers) {
          const headers = options.headers as Headers;
          expect(headers.get('Content-Type')).toBe('application/json');
        }
      });

      it('should handle API errors', async () => {
        const errorResponse = { message: 'Not Found' };
        fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 404 });
  
        await expect(apiRequest('/test')).rejects.toThrow('HTTP error! status: 404');
        expect(toast.error).toHaveBeenCalledWith('An error occurred. Please try again later.');
      });
  
      it('should handle network errors', async () => {
        fetchMock.mockReject(new Error('Network error'));
  
        await expect(apiRequest('/test')).rejects.toThrow('Network error');
        expect(toast.error).toHaveBeenCalledWith('An error occurred. Please try again later.');
      });
    });

    describe('handleApiError', () => {
      it('should handle 400 error', () => {
        const error = new Error('Bad Request') as ApiError;
        error.status = 400;
        handleApiError(error);
        expect(toast.error).toHaveBeenCalledWith('Invalid request. Please check your input and try again.');
      });
  
      it('should handle 401 error', () => {
        const error = new Error('Unauthorized') as ApiError;
        error.status = 401;
        handleApiError(error);
        expect(toast.error).toHaveBeenCalledWith('Unauthorized. Please log in and try again.');
      });
  
      it('should handle 403 error', () => {
        const error = new Error('Forbidden') as ApiError;
        error.status = 403;
        handleApiError(error);
        expect(toast.error).toHaveBeenCalledWith('Access denied. You do not have permission to perform this action.');
      });
  
      it('should handle 404 error', () => {
        const error = new Error('Not Found') as ApiError;
        error.status = 404;
        handleApiError(error);
        expect(toast.error).toHaveBeenCalledWith('The requested resource was not found.');
      });
  
      it('should handle 429 error', () => {
        const error = new Error('Too Many Requests') as ApiError;
        error.status = 429;
        handleApiError(error);
        expect(toast.error).toHaveBeenCalledWith('Too many requests. Please wait a moment and try again.');
      });
  
      it('should handle 500 error', () => {
        const error = new Error('Internal Server Error') as ApiError;
        error.status = 500;
        handleApiError(error);
        expect(toast.error).toHaveBeenCalledWith('A server error occurred. Please try again later.');
      });
  
      it('should handle unknown errors', () => {
        const error = new Error('Unknown Error') as ApiError;
        handleApiError(error);
        expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred. Please try again later.');
      });
    });
  });


  describe('Specific API Functions', () => {
    describe('sendChatMessage', () => {
      it('should send a chat message successfully', async () => {
        const mockResponse: ChatResponse = { response: 'Response from AI' };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const chatMessageRequest: ChatMessageRequest = {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          message: 'Hello, AI!'
        };

        const result = await sendChatMessage('wake', chatMessageRequest);

        expect(result).toEqual(mockResponse);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/ai-tutor');
        const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string) as AITutorRequest;
        expect(requestBody).toMatchObject({
          ...chatMessageRequest,
          character: 'wake',
          systemPrompt: expect.any(String)
        });
      });
    });

    describe('getConversationHistory', () => {
      it('should fetch conversation history', async () => {
        const mockHistory: ChatMessage[] = [
          { role: 'user', content: 'Hello', timestamp: '2023-01-01T00:00:00Z' },
          { role: 'assistant', content: 'Hi there!', timestamp: '2023-01-01T00:00:01Z' }
        ];
        fetchMock.mockResponseOnce(JSON.stringify({ history: mockHistory }));

        const result = await getConversationHistory('123', 'wake');

        expect(result).toEqual(mockHistory);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/conversation-history/123/wake');
      });
    });

    describe('clearConversationHistory', () => {
      it('should clear conversation history', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

        await clearConversationHistory('123', 'wake');

        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/clear-history/123/wake');
        expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
      });
    });

    describe('collectFeedback', () => {
      it('should collect feedback successfully', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

        await collectFeedback('123', 'Great experience!');

        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/collect-feedback/123');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({ feedback: 'Great experience!' });
      });
    });

    describe('getLearningProgress', () => {
      it('should fetch learning progress', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ progress: 75 }));

        const result = await getLearningProgress('123');

        expect(result).toBe(75);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/learning-progress/123');
      });
    });

    describe('getNextSteps', () => {
      it('should fetch next steps', async () => {
        const mockSteps = ['Review chapter 1', 'Take quiz on topic A'];
        fetchMock.mockResponseOnce(JSON.stringify({ nextSteps: mockSteps }));

        const result = await getNextSteps('123');

        expect(result).toEqual(mockSteps);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/next-steps/123');
      });
    });

    describe('optimizeCurriculum', () => {
      it('should optimize curriculum', async () => {
        const mockCurriculum: CurriculumData = {
          id: '1',
          subject: 'Math',
          units: ['Algebra', 'Geometry'],
          difficulty: 'Intermediate'
        };
        fetchMock.mockResponseOnce(JSON.stringify({ optimizedCurriculum: mockCurriculum }));

        const result = await optimizeCurriculum(
          { id: '1', subject: 'Math', units: ['Algebra'], difficulty: 'Beginner' },
          [{ chapter: 'Algebra', score: 80 }],
          [{ goal: 'Master Geometry' }]
        );

        expect(result).toEqual(mockCurriculum);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/optimize-curriculum');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
          currentCurriculum: { id: '1', subject: 'Math', units: ['Algebra'], difficulty: 'Beginner' },
          performanceData: [{ chapter: 'Algebra', score: 80 }],
          learningGoals: [{ goal: 'Master Geometry' }]
        });
      });
    });

    describe('getCurriculum', () => {
      it('should fetch curriculum', async () => {
        const mockCurriculum: CurriculumData = {
          id: '1',
          subject: 'Math',
          units: ['Algebra', 'Geometry'],
          difficulty: 'Intermediate'
        };
        fetchMock.mockResponseOnce(JSON.stringify({ curriculum: mockCurriculum }));

        const result = await getCurriculum('1');

        expect(result).toEqual(mockCurriculum);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/curriculum/1');
      });
    });

    // ... [Previous test cases remain the same] ...

    describe('matchPeers', () => {
      it('should match peers', async () => {
        const mockMatches = [['user1', 'user2'], ['user3', 'user4']];
        fetchMock.mockResponseOnce(JSON.stringify({ matches: mockMatches }));

        const result = await matchPeers([
          { id: '1', username: 'User 1', email: 'user1@example.com' },
          { id: '2', username: 'User 2', email: 'user2@example.com' }
        ], 2);

        expect(result).toEqual(mockMatches);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/match-peers');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
          users: [
            { id: '1', username: 'User 1', email: 'user1@example.com' },
            { id: '2', username: 'User 2', email: 'user2@example.com' }
          ],
          groupSize: 2
        });
      });
    });

    describe('generateAchievements', () => {
      it('should generate achievements', async () => {
        const mockAchievements = { achievement1: 'Description 1', achievement2: 'Description 2' };
        fetchMock.mockResponseOnce(JSON.stringify({ achievementSystem: mockAchievements }));

        const result = await generateAchievements({ id: '1', subject: 'Math', units: ['Algebra'], difficulty: 'Beginner' });

        expect(result).toEqual(mockAchievements);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/generate-achievements');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({ id: '1', subject: 'Math', units: ['Algebra'], difficulty: 'Beginner' });
      });
    });

    describe('updateAchievements', () => {
      it('should update achievements', async () => {
        const mockUpdates = { achievement1: 'Unlocked', achievement2: 'In Progress' };
        fetchMock.mockResponseOnce(JSON.stringify({ achievementUpdates: mockUpdates }));

        const result = await updateAchievements('123', { topic1: 80, topic2: 60 }, { achievement1: 'Description 1' });

        expect(result).toEqual(mockUpdates);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/update-achievements/123');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
          progress: { topic1: 80, topic2: 60 },
          achievementSystem: { achievement1: 'Description 1' }
        });
      });
    });

    describe('generateChallenges', () => {
      it('should generate challenges', async () => {
        const mockChallenges: Challenge[] = [
          { id: 1, description: 'Challenge 1', objectives: ['Objective 1'], hints: ['Hint 1'], solution: 'Solution 1', difficulty: 'Beginner' },
          { id: 2, description: 'Challenge 2', objectives: ['Objective 2'], hints: ['Hint 2'], solution: 'Solution 2', difficulty: 'Intermediate' }
        ];
        fetchMock.mockResponseOnce(JSON.stringify({ challenges: mockChallenges }));

        const result = await generateChallenges('123', { topic1: 80, topic2: 60 }, { achievement1: 'Description 1' });

        expect(result).toEqual(mockChallenges);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/generate-challenges/123');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
          progress: { topic1: 80, topic2: 60 },
          achievementSystem: { achievement1: 'Description 1' }
        });
      });
    });

    describe('calculateEngagement', () => {
      it('should calculate engagement', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ engagementScore: 85 }));

        const result = await calculateEngagement('123', [{ action: 'login', timestamp: Date.now() }]);

        expect(result).toBe(85);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/calculate-engagement/123');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual([{ action: 'login', timestamp: expect.any(Number) }]);
      });
    });

    describe('generateEnvironment', () => {
      it('should generate environment', async () => {
        const mockEnvironment: Environment = {
          id: 1,
          topic: 'forest',
          complexity: 'Intermediate',
          description: 'A lush forest environment',
          elements: ['trees', 'river'],
          interactiveElements: ['climbing trees'],
          scenarios: ['forest fire prevention'],
          visualComponents: ['3D trees'],
          groupActivities: ['nature walk']
        };
        fetchMock.mockResponseOnce(JSON.stringify({ environment: mockEnvironment }));

        const result = await generateEnvironment('forest', 'Intermediate');

        expect(result).toEqual(mockEnvironment);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/generate-environment');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({ topic: 'forest', complexity: 'Intermediate' });
      });
    });

    describe('generateChallenge', () => {
      it('should generate challenge', async () => {
        const mockChallenge: Challenge = {
          id: 1,
          description: 'Find the hidden treasure',
          objectives: ['Navigate the forest', 'Solve riddles'],
          hints: ['Look for marked trees'],
          solution: 'The treasure is under the oldest tree',
          difficulty: 'Intermediate'
        };
        fetchMock.mockResponseOnce(JSON.stringify({ challenge: mockChallenge }));

        const result = await generateChallenge({ id: 1, topic: 'forest', complexity: 'Intermediate', description: 'A forest scene', elements: [], interactiveElements: [], scenarios: [], visualComponents: [], groupActivities: [] }, 'Intermediate');

        expect(result).toEqual(mockChallenge);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/generate-challenge');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
          environment: { id: 1, topic: 'forest', complexity: 'Intermediate', description: 'A forest scene', elements: [], interactiveElements: [], scenarios: [], visualComponents: [], groupActivities: [] },
          difficulty: 'Intermediate'
        });
      });
    });

    describe('generateImage', () => {
      it('should generate image', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ url: 'http://example.com/image.jpg' }));

        const result = await generateImage('A beautiful landscape', '512x512', 'high', 1);

        expect(result).toBe('http://example.com/image.jpg');
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/generate-image');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
          prompt: 'A beautiful landscape',
          size: '512x512',
          quality: 'high',
          n: 1
        });
      });
    });

    describe('generateEnvironmentWithImage', () => {
      it('should generate environment with image', async () => {
        const mockEnvironment: Environment = {
          id: 1,
          topic: 'forest',
          complexity: 'Intermediate',
          description: 'A lush forest environment',
          elements: ['trees', 'river'],
          interactiveElements: ['climbing trees'],
          scenarios: ['forest fire prevention'],
          visualComponents: ['3D trees'],
          groupActivities: ['nature walk'],
          image_url: 'http://example.com/forest.jpg'
        };
        fetchMock.mockResponseOnce(JSON.stringify({ environment: mockEnvironment }));

        const result = await generateEnvironmentWithImage('forest', 'Intermediate');

        expect(result).toEqual(mockEnvironment);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/generate-environment-with-image');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({ topic: 'forest', complexity: 'Intermediate' });
      });
    });

    describe('generateAchievementBadge', () => {
      it('should generate achievement badge', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ badge_url: 'http://example.com/badge.jpg' }));

        const result = await generateAchievementBadge({ name: 'Super Learner', description: 'Completed 10 courses' });

        expect(result).toBe('http://example.com/badge.jpg');
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/generate-achievement-badge');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
          name: 'Super Learner',
          description: 'Completed 10 courses'
        });
      });
    });

    describe('recommendResources', () => {
      it('should recommend resources', async () => {
        const mockResources = [{ id: '1', title: 'Resource 1' }, { id: '2', title: 'Resource 2' }];
        fetchMock.mockResponseOnce(JSON.stringify({ resources: mockResources }));

        const result = await recommendResources('123', 'visual', 'math', 'intermediate');

        expect(result).toEqual(mockResources);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/recommend-resources');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
          userId: '123',
          learningStyle: 'visual',
          currentFocus: 'math',
          skillLevel: 'intermediate'
        });
      });
    });


    describe('generateElement', () => {
      it('should generate element', async () => {
        const mockElement = { type: 'quiz', content: 'Quiz content' };
        fetchMock.mockResponseOnce(JSON.stringify(mockElement));

        const result = await generateElement('quiz', { topic: 'math', difficulty: 'medium' });

        expect(result).toEqual(mockElement);
        expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/api/api/generate-element');
        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
          element_type: 'quiz',
          params: { topic: 'math', difficulty: 'medium' }
        });
      });
    });
  });
});