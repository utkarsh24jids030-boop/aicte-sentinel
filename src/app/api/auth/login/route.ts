import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/session';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { UserRole } from '@/types';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: max 20 logins per minute per IP
    const rateCheck = checkRateLimit('auth-login', ip, 20, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 20 login attempts per minute permitted. Please try again shortly.' },
        { 
          status: 429,
          headers: { 'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString() }
        }
      );
    }

    const body = await request.json();
    const { email, name, isRegistration, method, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    // Privilege escalation safeguard during registration
    const privilegedRoles: UserRole[] = ['ADMIN', 'AUDITOR', 'OFFICER', 'EVC_INSPECTOR'];
    if (isRegistration && role && privilegedRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Privilege escalation rejected. Only INSTITUTION accounts can be registered.' },
        { status: 403 }
      );
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
