// Fresh Google OAuth implementation with PKCE-less simple server-side flow
// Provides: buildAuthUrl, exchangeCode, readTokens, clearTokens

const AUTH_BASE = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export const googleConfig: GoogleConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: `${
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }/api/oauth/google/callback`,
  scopes: ['openid', 'email', 'profile'],
};

function randomString(bytes = 16) {
  return [...crypto.getRandomValues(new Uint8Array(bytes))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function buildAuthUrl(state: string, nonce: string) {
  if (!googleConfig.clientId) throw new Error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
  const params = new URLSearchParams({
    client_id: googleConfig.clientId,
    redirect_uri: googleConfig.redirectUri,
    response_type: 'code',
    scope: googleConfig.scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
    nonce,
  });
  return `${AUTH_BASE}?${params.toString()}`;
}

export async function exchangeCode(code: string) {
  if (!googleConfig.clientId || !googleConfig.clientSecret) {
    throw new Error('Missing Google OAuth credentials');
  }
  const body = new URLSearchParams({
    code,
    client_id: googleConfig.clientId,
    client_secret: googleConfig.clientSecret,
    redirect_uri: googleConfig.redirectUri,
    grant_type: 'authorization_code',
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error_description || json.error || 'Token exchange failed');
  }
  return json as {
    access_token: string;
    id_token?: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope?: string;
  };
}

// Cookie helpers (server-side only usage intended)
import { cookies } from 'next/headers';

export async function storeTokens(tokens: {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in: number;
}) {
  const jar = await cookies();
  const secure = process.env.NODE_ENV === 'production';
  jar.set('g_access', tokens.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: tokens.expires_in,
  });
  if (tokens.id_token)
    jar.set('g_id', tokens.id_token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: tokens.expires_in,
    });
  if (tokens.refresh_token)
    jar.set('g_refresh', tokens.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
}

export async function readTokens() {
  const jar = await cookies();
  return {
    accessToken: jar.get('g_access')?.value || null,
    idToken: jar.get('g_id')?.value || null,
    refreshToken: jar.get('g_refresh')?.value || null,
  };
}

export async function clearTokens() {
  const jar = await cookies();
  jar.delete('g_access');
  jar.delete('g_id');
  jar.delete('g_refresh');
}

export function createStatePayload() {
  return { state: randomString(12), nonce: randomString(12) };
}
