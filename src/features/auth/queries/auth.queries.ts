import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginFormData } from '../models/auth.model';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (data) => {
      // Invalidate and refetch data that should change upon login
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}
