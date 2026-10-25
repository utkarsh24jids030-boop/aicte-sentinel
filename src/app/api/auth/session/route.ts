import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/session';

export async function GET(request: Request) {
  const result = AuthService.verifyRequest(request);
  if (!result.authorized) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    authenticated: true,
    user: result.user
  });
}
