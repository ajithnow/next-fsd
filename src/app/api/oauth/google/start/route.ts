import { buildAuthUrl, createStatePayload } from '@/features/auth/lib/google';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const { state, nonce } = createStatePayload();
  const url = buildAuthUrl(state, nonce);
  const jar = await cookies();
  // Store state & nonce for validation (short TTL)
  jar.set('g_oauth_state', state, { httpOnly: true, sameSite: 'lax', maxAge: 300 });
  jar.set('g_oauth_nonce', nonce, { httpOnly: true, sameSite: 'lax', maxAge: 300 });
  return NextResponse.redirect(url);
}
