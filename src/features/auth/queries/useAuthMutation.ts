import { useMutation } from '@tanstack/react-query';
import type { LoginFormData, LoginResponse } from '../models/auth.model';
import { authService } from '../services/auth.service';

/**
 * React Query mutation for authentication.
 * Keeps side-effects related to successful login close to the network layer.
 */
export function useAuthMutation() {
  return useMutation<LoginResponse, unknown, LoginFormData>({
    mutationFn: (data: LoginFormData) => authService.login(data),
  });
}
