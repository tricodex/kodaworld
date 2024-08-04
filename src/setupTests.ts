// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  global.localStorage = localStorageMock as any;
  
  // Mock window
  global.window = { localStorage: localStorageMock } as any;
  
  // Mock toast
  jest.mock('react-toastify', () => ({
    toast: {
      error: jest.fn(),
    },
  }));