import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/session';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { UserRole } from '@/types';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit('auth-register', ip, 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 10 registration attempts per minute permitted.' },
        { 
          status: 429,
          headers: { 'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString() }
        }
      );
    }

    const body = await request.json();
    const { email, name, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    // Privilege Escalation Safeguard: Reject any attempt to register privileged roles
    const privilegedRoles: UserRole[] = ['ADMIN', 'AUDITOR', 'OFFICER', 'EVC_INSPECTOR'];
    if (role && privilegedRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Privilege escalation rejected. Only INSTITUTION accounts can be registered.' },
        { status: 403 }
      );
    }

    // Resolve or provision strictly with unprivileged INSTITUTION role
    const user = AuthService.resolveUserProfile(email, name);
    AuthService.recordRegistration(user);

    return NextResponse.json({
      success: true,
      user,
      message: 'Institution account registered successfully.'
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Registration error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
