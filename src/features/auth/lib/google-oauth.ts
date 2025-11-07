// Google OAuth configuration and helpers

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

export const googleOAuthConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: `${
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }/api/oauth/callback/google`,
  scopes: ['openid', 'email', 'profile'],
};

export function getGoogleAuthUrl() {
  if (!googleOAuthConfig.clientId) {
    throw new Error(
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured. Please add it to your .env file.',
    );
  }

  const params = new URLSearchParams({
    client_id: googleOAuthConfig.clientId,
    redirect_uri: googleOAuthConfig.redirectUri,
    response_type: 'code',
    scope: googleOAuthConfig.scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  if (!googleOAuthConfig.clientId || !googleOAuthConfig.clientSecret) {
    throw new Error('Google OAuth credentials are not configured. Please check your .env file.');
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: googleOAuthConfig.clientId,
      client_secret: googleOAuthConfig.clientSecret,
      redirect_uri: googleOAuthConfig.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Token exchange failed:', error);
    throw new Error(
      `Failed to exchange code for tokens: ${error.error_description || error.error}`,
    );
  }

  return response.json();
}
