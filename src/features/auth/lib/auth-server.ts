import { cookies } from 'next/headers';

export interface AuthTokens {
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
}

// Updated to use new cookie names from fresh Google OAuth implementation
export async function getAuthTokens(): Promise<AuthTokens> {
  const jar = await cookies();
  return {
    accessToken: jar.get('g_access')?.value || null,
    idToken: jar.get('g_id')?.value || null,
    refreshToken: jar.get('g_refresh')?.value || null,
  };
}

export async function clearAuthTokens() {
  const jar = await cookies();
  jar.delete('g_access');
  jar.delete('g_id');
  jar.delete('g_refresh');
}
