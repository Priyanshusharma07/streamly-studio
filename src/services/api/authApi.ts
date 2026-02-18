import { apiFetch } from './config';
import type {
  LoginDto,
  SignupDto,
  AuthUser,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto
} from './types';

export interface NormalizedAuthResponse {
  user: AuthUser;
  accessToken: string;
  tokenType: string;
}

export const loginUser = async (
  dto: LoginDto
): Promise<NormalizedAuthResponse> => {
  const response = await apiFetch<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

  if (!response?.access_token) {
    throw new Error('Token not found in login response');
  }

  // 🔥 Normalize snake_case → camelCase
  return {
    user: response.user,
    accessToken: response.access_token,
    tokenType: response.token_type,
  };
};

export const signupUser = async (dto: SignupDto) => {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
};

export const getProfile = async (): Promise<AuthUser> => {
  return apiFetch<AuthUser>('/auth/me');
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email } as ForgotPasswordDto),
  });
};

export const resetPassword = async (dto: ResetPasswordDto): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
};

export const changePassword = async (dto: ChangePasswordDto): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
};

export const refreshToken = async (): Promise<NormalizedAuthResponse> => {
  const response = await apiFetch<any>('/auth/refresh', {
    method: 'POST',
  });

  if (!response?.access_token) {
    throw new Error('Token not found in refresh response');
  }

  return {
    user: response.user,
    accessToken: response.access_token,
    tokenType: response.token_type,
  };
};
