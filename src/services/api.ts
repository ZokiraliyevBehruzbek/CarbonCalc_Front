import { User, RegisterRequest, LoginRequest, CreateActivityRequest, Activity } from '../types';

const API_BASE = 'https://carboncalc-api.onrender.com'; // Update this to your Django API URL

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// API helper function
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getCookie('access_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const authAPI = {
  register: async (data: RegisterRequest) => {
    const response = await apiCall<{ msg: string; tokens: { access: string; refresh: string } }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    setCookie('access_token', response.tokens.access);
    setCookie('refresh_token', response.tokens.refresh);
    
    return response;
  },

  login: async (data: LoginRequest) => {
    const response = await apiCall<{ access: string; refresh: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    setCookie('access_token', response.access);
    setCookie('refresh_token', response.refresh);
    
    return response;
  },

  me: async (): Promise<User> => {
    return apiCall<User>('/auth/me/');
  },

  logout: () => {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
  },

  isAuthenticated: (): boolean => {
    return !!getCookie('access_token');
  },
};

export const factorsAPI = {
  create: async (data: CreateActivityRequest) => {
    return apiCall<Activity>('/factors/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyActivity: async (): Promise<Activity[]> => {
    return apiCall<Activity[]>('/factors/my_activity/');
  },
};