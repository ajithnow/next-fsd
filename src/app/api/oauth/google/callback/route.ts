import { exchangeCode, storeTokens } from '@/features/auth/lib/google';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get('code');
  const returnedState = params.get('state');
  const error = params.get('error');

  const jar = await cookies();
  const savedState = jar.get('g_oauth_state')?.value;

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url));
  }
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }
  if (!returnedState || !savedState || returnedState !== savedState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', request.url));
  }

  try {
    const tokens = await exchangeCode(code);
    await storeTokens(tokens);
    // Clear one-time state cookie
    jar.delete('g_oauth_state');
    jar.delete('g_oauth_nonce');
    return NextResponse.redirect(new URL('/auth/callback', request.url));
  } catch (e: any) {
    console.error('Google OAuth callback error:', e);
    return NextResponse.redirect(new URL('/login?error=exchange_failed', request.url));
  }
}
