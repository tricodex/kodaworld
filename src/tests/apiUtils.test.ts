import { apiRequest } from '@/utils/apiUtils';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock as any;

// Mock window
global.window = { localStorage: localStorageMock } as any;

describe('apiRequest', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error
    (console.error as jest.Mock).mockRestore();
  });

  it('should make a successful API request', async () => {
    const mockResponse = { data: 'test' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await apiRequest('/test-endpoint');
    expect(result).toEqual(mockResponse);
  });

  it('should handle API errors', async () => {
    fetchMock.mockRejectOnce(new Error('API Error'));

    await expect(apiRequest('/test-endpoint')).rejects.toThrow('API Error');
    expect(console.error).toHaveBeenCalled();
  });

  it('should include authorization header if token exists', async () => {
    const mockToken = 'test-token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    fetchMock.mockResponseOnce(JSON.stringify({}));

    await apiRequest('/test-endpoint');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockToken}`
        })
      })
    );
  });
});