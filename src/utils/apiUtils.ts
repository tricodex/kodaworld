import { toast } from 'react-toastify';
import { API_BASE_URL } from '@/config/api';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}, retries = 0): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Attempting to fetch from:', url);  // Add this line

    let token;
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('authToken');
    }
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      if (response.status >= 500 && retries < MAX_RETRIES) {
        // Retry for server errors
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return apiRequest<T>(endpoint, options, retries + 1);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    if (typeof window !== 'undefined') {
      toast.error('An error occurred. Please try again later.');
    }
    throw error;
  }
}