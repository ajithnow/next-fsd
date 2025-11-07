/**
 * Authentication API service
 */
import { apiClient } from '@/core/api';
import { authUrlConstants } from '../constants/auth.url.constants';
import type { LoginFormData, LoginResponse } from '../models/auth.model';

async function login(data: LoginFormData): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(authUrlConstants.LOGIN, data);
  return response.data;
}

export const authService = {
  login,
};
