'use client';

import { useEffect, useState } from 'react';

export interface AuthTokens {
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
}

export function useAuthTokens() {
  const [tokens, setTokens] = useState<AuthTokens>({
    accessToken: null,
    idToken: null,
    refreshToken: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch tokens from an API endpoint that reads cookies
    fetch('/api/auth/tokens')
      .then((res) => res.json())
      .then((data) => {
        setTokens(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return { tokens, isLoading };
}

export async function signOut() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login';
}
