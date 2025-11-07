# Custom Google OAuth Implementation

## Overview

This project now uses a custom Google OAuth 2.0 implementation instead of Better Auth. This gives direct access to the ID token, which is required for backend API verification.

## Architecture

### Email/Password Authentication

- Uses the existing `authService.login()` in `src/features/auth/services/auth.service.ts`
- Authenticates against external API
- No local user storage required

### Google OAuth Authentication (New Flow)

1. **User initiates login**: Clicks "Sign in with Google" button
2. **Start route**: Browser hits `/api/oauth/google/start` which creates `state` + `nonce` cookies (`g_oauth_state`, `g_oauth_nonce`) then redirects to Google
3. **User authorizes**: User logs in and grants permissions on Google
4. **Callback**: Google redirects to `/api/oauth/google/callback?code=...&state=...`
5. **Validation**: Server validates `state` against stored cookie value
6. **Token exchange**: Server exchanges code for tokens using `exchangeCode()`
7. **Store tokens**: Tokens saved in cookies: `g_access`, `g_id`, `g_refresh`
8. **Redirect**: User redirected to `/auth/callback` page which reads tokens via `/api/auth/tokens`

## Key Files

### OAuth Configuration (`src/features/auth/lib/google.ts`)

- `buildAuthUrl(state, nonce)`: Generates OAuth authorization URL with provided state & nonce
- `exchangeCode(code)`: Exchanges authorization code for tokens
- `storeTokens(tokens)`: Persists tokens to cookies (`g_access`, `g_id`, `g_refresh`)
- `readTokens()`: Reads token values from cookies
- `clearTokens()`: Deletes token cookies
- `createStatePayload()`: Generates cryptographically secure `state` and `nonce`

### Start Route (`src/app/api/oauth/google/start/route.ts`)

- Creates state & nonce
- Sets short-lived cookies
- Redirects to Google using `buildAuthUrl`

### Callback Route (`src/app/api/oauth/google/callback/route.ts`)

- Validates state cookie
- Exchanges code for tokens with Google
- Stores tokens via `storeTokens`
- Clears one-time state cookies
- Redirects to `/auth/callback`

### Server-side Auth Utilities (`src/features/auth/lib/auth-server.ts`)

- `getAuthTokens()`: Reads tokens from cookies (use in Server Components, Server Actions)
- `clearAuthTokens()`: Deletes all auth cookies

### Client-side Auth Utilities (`src/features/auth/lib/auth-client.ts`)

- `useAuthTokens()`: React hook to access tokens in client components
- `signOut()`: Clears auth cookies and redirects to login

### API Routes

- `/api/oauth/google/start` (GET): Initiates Google OAuth
- `/api/oauth/google/callback` (GET): Handles Google redirect
- `/api/auth/tokens` (GET): Returns current user's tokens (reads new cookie names)
- `/api/auth/logout` (POST): Clears token cookies

### UI Components

- `ModernLoginForm` & `LoginForm`
  - Email/password via `authService.login()`
  - Google sign-in button now points to `/api/oauth/google/start`

### Callback Page (`src/app/auth/callback/page.tsx`)

- Displays all tokens after successful OAuth
- Shows: Access Token, ID Token, Refresh Token

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Google Cloud Console Configuration

**Authorized JavaScript Origins:**

- `http://localhost:3000`
- `https://yourdomain.com` (production)

**Authorized Redirect URIs:**

- `http://localhost:3000/api/oauth/google/callback`
- `https://yourdomain.com/api/oauth/google/callback` (production)

## Usage Examples

### Get Tokens in Server Component

```typescript
import { getAuthTokens } from '@/features/auth/lib/auth-server';

export default async function ServerPage() {
  const tokens = await getAuthTokens();

  if (tokens.idToken) {
    // Use ID token for API calls
  }
}
```

### Get Tokens in Client Component

```typescript
'use client';
import { useAuthTokens } from '@/features/auth/lib/auth-client';

export function ClientComponent() {
  const { tokens, isLoading } = useAuthTokens();

  if (isLoading) return <div>Loading...</div>;

  return <div>ID Token: {tokens.idToken}</div>;
}
```

### Sign Out

```typescript
'use client';
import { signOut } from '@/features/auth/lib/auth-client';

export function LogoutButton() {
  return <button onClick={signOut}>Sign Out</button>;
}
```

## Security Notes

1. **HTTP-only Cookies**: Tokens are stored in HTTP-only cookies to prevent XSS attacks
2. **Secure Flag**: In production, cookies use the `secure` flag (HTTPS only)
3. **SameSite**: Cookies use `SameSite=lax` to prevent CSRF attacks
4. **Token Expiration**: Access tokens expire based on Google's `expires_in` value (typically 1 hour)
5. **Refresh Token**: Stored separately with 30-day expiration for token renewal

## Removed Better Auth

Better Auth has been completely removed because it doesn't provide direct access to the ID token. The following files were deleted:

- `src/features/auth/lib/auth.ts` (Better Auth server config)
- `src/app/api/auth/[...all]/route.ts` (Better Auth API handler)
- `src/features/auth/lib/use-auth-tokens.ts` (old hook)

## Next Steps

1. Implement refresh token rotation and automatic access token renewal.
2. Add middleware to protect authenticated routes and redirect unauthenticated users.
3. Decode `id_token` server-side to derive user profile claims (email, name) for personalization.
4. Add error boundary/UI for OAuth failures (invalid_state, exchange_failed).
5. Consider adding PKCE if moving to a pure SPA public client scenario.

To fully integrate this authentication:

1. **Implement Token Refresh**: Add logic to refresh access tokens using refresh_token
2. **Protected Routes**: Add middleware to protect routes requiring authentication
3. **API Integration**: Use ID token to authenticate with your external API
4. **User Profile**: Decode ID token to extract user information (email, name, etc.)
5. **Error Handling**: Add better error handling for OAuth failures
6. **Loading States**: Improve loading UX during OAuth redirects
