// src/utils/apiUtils.ts

import { toast } from 'react-toastify';
import { API_BASE_URL } from '@/config/api';

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Sending request to:', url, 'with options:', JSON.stringify(options, null, 2));

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const responseData = await response.json();
    console.log('API response:', responseData);

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
      error.status = response.status;
      error.data = responseData;
      throw error;
    }
    
    return responseData as T;
  } catch (error) {
    console.error('API request failed:', error);
    if (typeof window !== 'undefined') {
      toast.error('An error occurred. Please try again later.');
    }
    throw error;
  }
}

export function handleApiError(error: ApiError): void {
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
  } else if (error.status && error.status >= 500) {
    errorMessage = 'A server error occurred. Please try again later.';
  }

  toast.error(errorMessage);
}