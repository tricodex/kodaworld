import { toast } from 'react-toastify';
import { API_BASE_URL } from '@/config/api';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface ApiError extends Error {
  status?: number;
  data?: any;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}, retries = 0): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Attempting to fetch from:', url);

    let token;
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('authToken');
    }

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
      error.status = response.status;
      error.data = errorData;
      
      if (response.status === 429) {
        // Rate limit exceeded
        if (retries < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
          return apiRequest<T>(endpoint, options, retries + 1);
        }
      }
      
      throw error;
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

export function handleApiError(error: any): void { // was apiError but changed to any
  console.error('API Error:', error);
  let errorMessage = 'An unexpected error occurred. Please try again later.';
  
  if (error.status === 400) {
    errorMessage = 'Invalid request. Please check your input and try again.';
  } else if (error.status === 401) {
    errorMessage = 'Unauthorized. Please log in and try again.';
  } else if (error.status === 403) {
    errorMessage = 'Access denied. You do not have permission to perform this action.';
  } else if (error.status === 404) {
    errorMessage = 'The requested resource was not found.';
  } else if (error.status === 429) {
    errorMessage = 'Too many requests. Please wait a moment and try again.';
  } else if (error.status ?? 0 >= 500) {
    errorMessage = 'A server error occurred. Please try again later.';
  }

  toast.error(errorMessage);
}