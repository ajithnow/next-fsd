import { useQueryClient } from '@tanstack/react-query';
import type { LoginFormData, LoginResponse } from '../models/auth.model';
import { useAuthMutation } from '../queries/useAuthMutation';

/**
 * Hook wrapper around auth manager that exposes login/logout with react-query
 * Returns the raw mutation as part of the result so callers can access
 * mutation state if they want.
 */
export function useAuthManager() {
  const queryClient = useQueryClient();

  const mutation = useAuthMutation();

  const login = async (
    data: LoginFormData,
    options?: { onSuccess?: (resp: LoginResponse) => void },
  ) => {
    const resp = (await mutation.mutateAsync(data, {
      onSuccess: (resp) => {
        // Manager-level side effects: persist token + user and invalidate queries
        if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
          try {
            globalThis.localStorage.setItem('accessToken', resp.token);
            globalThis.localStorage.setItem('user', JSON.stringify(resp.user));
          } catch {
            // ignore localStorage errors
          }
        }

        try {
          queryClient.invalidateQueries({ queryKey: ['user'] });
        } catch {
          // ignore
        }

        // then call any caller-provided onSuccess
        if (options?.onSuccess) {
          try {
            options.onSuccess(resp);
          } catch (e) {
            console.error('useAuthManager onSuccess callback error', e);
          }
        }
      },
    })) as LoginResponse;

    return resp;
  };

  const logout = async () => {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      try {
        globalThis.localStorage.removeItem('accessToken');
        globalThis.localStorage.removeItem('user');
      } catch {
        // ignore
      }
    }

    try {
      queryClient.invalidateQueries();
    } catch {
      // ignore
    }
  };

  return {
    login,
    logout,
    mutation,
  };
}
