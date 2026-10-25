import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, isRegistration, method } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    // Resolve authoritative user record without trusting client-provided role
    const user = AuthService.resolveUserProfile(email, name);

    if (isRegistration) {
      AuthService.recordRegistration(user);
    } else {
      AuthService.recordLogin(user, method || 'FIREBASE_AUTH');
    }

    const redirectPath = AuthService.getRoleLandingPath(user.role);

    return NextResponse.json({
      success: true,
      user,
      redirectPath
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error during authentication sync';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
