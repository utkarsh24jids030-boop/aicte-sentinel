'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldAlert, ArrowLeft, RefreshCw, Lock } from 'lucide-react';
import { AuthService } from '@/lib/auth/session';
import DemoBanner from './DemoBanner';
import Navbar from './Navbar';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#002b66] text-amber-400 flex items-center justify-center shadow-lg animate-pulse">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-sm">Verifying Sentinel Security Credentials</h3>
            <p className="text-xs text-slate-500 mt-1">Connecting to AICTE Firebase Authentication & Role Registry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Check role authorization
  const isAuthorized = !allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(user.role);

  if (!isAuthorized) {
    const defaultLanding = AuthService.getRoleLandingPath(user.role);

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <DemoBanner />
        <Navbar />

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <span className="inline-block px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              403 Access Forbidden
            </span>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Privilege Restriction
            </h2>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Your active account <strong>{user.name}</strong> has role{' '}
              <span className="font-semibold text-slate-800 uppercase">[{user.role}]</span>, which is not permitted to access this regulatory partition.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs mb-6 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Required Clearance:</div>
              <div className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-sm border border-indigo-200">
                {allowedRoles?.join(', ') || 'Authorized Roles'}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push(defaultLanding)}
                className="w-full py-2.5 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to My Dashboard ({user.role})</span>
              </button>

              <button
                onClick={() => router.push('/login')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Switch to Authorized Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
