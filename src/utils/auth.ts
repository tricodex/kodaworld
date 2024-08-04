export function setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }
  
  export function getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
  
  export function removeAuthToken() {
    localStorage.removeItem('authToken');
  }
  
  export function isAuthenticated(): boolean {
    return !!getAuthToken();
  }