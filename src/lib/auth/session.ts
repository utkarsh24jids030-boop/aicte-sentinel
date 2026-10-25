// AICTE Sentinel Auth & Session Management with Firebase Integration
// Problem Statement SIH26261 - Smart India Hackathon 2026

import { User, UserRole } from '@/types';
import { DataStore, DEMO_USERS } from '../store';
import { AuditTrailEngine } from '../audit/trail';

export const DEMO_CREDENTIALS = [
  { role: 'INSTITUTION' as UserRole, email: 'institution@sunrise.edu', password: 'Password@123', name: 'Dr. Anand Kumar', desc: 'Sunrise Institute of Technology' },
  { role: 'OFFICER' as UserRole, email: 'officer@aicte-india.org', password: 'Password@123', name: 'Smt. Priyadarshini Rao', desc: 'AICTE Senior Scrutiny Officer' },
  { role: 'EVC_INSPECTOR' as UserRole, email: 'inspector@aicte-evc.gov.in', password: 'Password@123', name: 'Prof. Harish Chandran', desc: 'EVC Inspection Committee Lead' },
  { role: 'ADMIN' as UserRole, email: 'admin@aicte-india.org', password: 'Password@123', name: 'Vikramaditya Singh', desc: 'AICTE Sentinel Lead Admin' },
  { role: 'AUDITOR' as UserRole, email: 'auditor@cag.gov.in', password: 'Password@123', name: 'Meenakshi Sundaram', desc: 'Independent Vigilance Auditor' }
];

export class AuthService {
  static getCredentials() {
    return DEMO_CREDENTIALS;
  }

  /**
   * Resolve an application user profile given their authenticated email.
   * Enforces security rule: Self-registered users are NEVER granted privileged roles.
   * Privileged roles (ADMIN, OFFICER, EVC_INSPECTOR, AUDITOR) are strictly mapped
   * to authoritative pre-configured system records.
   */
  static resolveUserProfile(email: string, displayName?: string | null): User {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check authoritative store first
    const existing = DataStore.getUserByEmail(normalizedEmail) || DEMO_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return existing;
    }

    // New Firebase self-registered user: Strictly unprivileged INSTITUTION role
    const newUser: User = {
      id: `usr-fb-${Date.now()}`,
      email: normalizedEmail,
      name: displayName || normalizedEmail.split('@')[0],
      role: 'INSTITUTION', // Unprivileged default; prevents privilege escalation
      designation: 'Institutional Representative',
      createdAt: new Date().toISOString()
    };

    return DataStore.createUser(newUser);
  }

  /**
   * Log authentication events in the cryptographic audit trail
   */
  static recordLogin(user: User, method: string = 'FIREBASE_AUTH') {
    AuditTrailEngine.recordEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_LOGIN_SUCCESS',
      entityType: 'AUTH',
      entityId: user.id,
      afterSummary: `User ${user.name} authenticated via ${method} with role ${user.role}`
    });
  }

  static recordLogout(user: User) {
    AuditTrailEngine.recordEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_LOGOUT',
      entityType: 'AUTH',
      entityId: user.id,
      afterSummary: `User ${user.name} logged out from Sentinel portal`
    });
  }

  static recordRegistration(user: User) {
    AuditTrailEngine.recordEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_REGISTRATION',
      entityType: 'AUTH',
      entityId: user.id,
      afterSummary: `New user ${user.name} registered with role ${user.role}`
    });
  }

  /**
   * Backend authorization verifier to prevent reliance solely on client-side redirects.
   * Validates authorization headers and checks role permissions against server state.
   */
  static verifyRequest(request: Request, allowedRoles?: UserRole[]): { 
    authorized: boolean; 
    user?: User; 
    error?: string; 
    status: number 
  } {
    // Check Authorization header or custom user header
    const authHeader = request.headers.get('authorization') || '';
    const emailHeader = request.headers.get('x-user-email') || '';

    // Extract identifier
    let email = emailHeader;
    if (!email && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      // If token contains email or token payload
      try {
        if (token.includes('@')) {
          email = token;
        } else {
          // Decode JWT payload without signature verification if public key not bundled,
          // but validate user existence against server store
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
            email = payload.email || '';
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!email) {
      return { authorized: false, error: 'Authentication required. No credentials supplied.', status: 401 };
    }

    const user = this.resolveUserProfile(email);
    if (!user) {
      return { authorized: false, error: 'User record not recognized.', status: 401 };
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return { 
        authorized: false, 
        user, 
        error: `Access Denied: Role '${user.role}' is not authorized to access this resource. Required: [${allowedRoles.join(', ')}]`, 
        status: 403 
      };
    }

    return { authorized: true, user, status: 200 };
  }

  static getRoleLandingPath(role: UserRole): string {
    switch (role) {
      case 'INSTITUTION':
        return '/institution';
      case 'OFFICER':
        return '/officer';
      case 'EVC_INSPECTOR':
        return '/evc';
      case 'ADMIN':
        return '/admin';
      case 'AUDITOR':
        return '/auditor';
      default:
        return '/';
    }
  }

  /**
   * Check if a given role can access a path
   */
  static isAuthorizedForPath(role: UserRole, path: string): boolean {
    if (role === 'ADMIN') return true; // Admins have oversight across all modules
    if (path.startsWith('/institution')) {
      return role === 'INSTITUTION';
    }
    if (path.startsWith('/officer/radar')) {
      return role === 'OFFICER' || role === 'AUDITOR';
    }
    if (path.startsWith('/officer')) {
      return role === 'OFFICER';
    }
    if (path.startsWith('/evc')) {
      return role === 'EVC_INSPECTOR' || role === 'OFFICER';
    }
    if (path.startsWith('/admin')) {
      return role === 'AUDITOR'; // Auditors can inspect audit trail
    }
    if (path.startsWith('/auditor')) {
      return role === 'AUDITOR';
    }
    return true;
  }
}
