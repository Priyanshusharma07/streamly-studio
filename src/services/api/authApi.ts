import { apiFetch } from './config';
import type { LoginDto, SignupDto, AuthResponse, AuthUser } from './types';

export const loginUser = async (dto: LoginDto): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
};

export const signupUser = async (dto: SignupDto): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
};

export const getProfile = async (): Promise<AuthUser> => {
  return apiFetch<AuthUser>('/auth/profile');
};
