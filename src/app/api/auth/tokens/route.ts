import { readTokens } from '@/features/auth/lib/google';
import { NextResponse } from 'next/server';

export async function GET() {
  const tokens = await readTokens();
  return NextResponse.json(tokens);
}
