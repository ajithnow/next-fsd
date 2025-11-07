import { clearTokens } from '@/features/auth/lib/google';
import { NextResponse } from 'next/server';

export async function POST() {
  await clearTokens();
  return NextResponse.json({ success: true });
}
