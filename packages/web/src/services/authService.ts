/**
 * Auth Service for HeySalad AI
 * Cloudflare-based authentication
 */

const API_BASE_URL = '/api/auth';
const TOKEN_KEY = 'heysalad_ai_token';

export interface User {
  id: string;
  email: string;
  name?: string;
  tier: 'free' | 'pro' | 'max';
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

/**
 * Sign up new user
 */
export async function signup(email: string, password: string, name?: string): Promise<AuthResponse> {
  try {
    console.log('Signup request to:', `${API_BASE_URL}/signup`);
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    console.log('Signup response status:', response.status);
    const data = await response.json();
    console.log('Signup response data:', data);

    if (response.ok && data.success && data.token) {
      setToken(data.token);
      return { success: true, token: data.token, user: data.user };
    }

    return { success: false, error: data.error || 'Signup failed' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('Login request to:', `${API_BASE_URL}/login`);
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log('Login response status:', response.status);
    const data = await response.json();
    console.log('Login response data:', data);

    if (response.ok && data.success && data.token) {
      setToken(data.token);
      return { success: true, token: data.token, user: data.user };
    }

    return { success: false, error: data.error || 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      removeToken();
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
}

/**
 * Logout user
 */
export function logout(): void {
  removeToken();
  window.location.href = '/';
}

/**
 * Get stored auth token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store auth token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove auth token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  if (user.name) return user.name;
  if (user.email) return user.email.split('@')[0];
  return `User ${user.id.slice(0, 8)}`;
}
