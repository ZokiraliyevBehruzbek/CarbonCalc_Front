export interface User {
  id: number;
  username: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateActivityRequest {
  category: 'transport' | 'energy';
  value: number;
}

export interface Activity {
  category: string;
  co2_emission: number;
}

export type PageType = 'register' | 'login' | 'factors_create' | 'profile';