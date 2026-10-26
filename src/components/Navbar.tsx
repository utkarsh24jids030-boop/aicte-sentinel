'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ChevronDown, 
  LogOut,
  Building2,
  FileSearch,
  Scale,
  ClipboardCheck,
  Lock,
  LogIn
} from 'lucide-react';
import { UserRole, User } from '@/types';
import { DEMO_USERS } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/lib/auth/session';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, logout, switchDemoUser } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Fallback to demo officer if evaluating before explicit sign-in
  const currentUser: User = authUser || DEMO_USERS[1];

  const handleSwitchUser = async (targetUser: User) => {
    setShowRoleMenu(false);
    await switchDemoUser(targetUser);
    
    // Auto navigate to role landing page
    const landing = AuthService.getRoleLandingPath(targetUser.role);
    router.push(landing);
  };

  const handleLogout = async () => {
    setShowRoleMenu(false);
    await logout();
    router.push('/login');
  };

  const navLinks = [
    { label: 'Portal Home', href: '/', roles: ['INSTITUTION', 'OFFICER', 'EVC_INSPECTOR', 'ADMIN', 'AUDITOR'] },
    { label: 'Institution Portal', href: '/institution', roles: ['INSTITUTION', 'ADMIN'] },
    { label: 'Officer Queue', href: '/officer', roles: ['OFFICER', 'ADMIN'] },
    { label: 'Linkage Radar', href: '/officer/radar', roles: ['OFFICER', 'ADMIN', 'AUDITOR'] },
    { label: 'EVC Inspection', href: '/evc', roles: ['EVC_INSPECTOR', 'OFFICER', 'ADMIN'] },
    { label: 'Audit Trail', href: '/admin', roles: ['ADMIN', 'AUDITOR', 'OFFICER'] }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#002b66] text-white shadow-md border-b border-[#001f4d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-inner group-hover:bg-white/15 transition-all">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">AICTE Sentinel</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
                  SIH26261
                </span>
              </div>
              <p className="text-[11px] text-blue-200 font-medium">Regulatory Decision-Support & Compliance Intelligence</p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && link.href !== '/officer');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-white/15 text-white font-semibold shadow-2xs' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User & Role Switcher */}
          <div className="relative">
            {authUser ? (
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-blue-200 uppercase tracking-wider font-medium">{currentUser.role.replace('_', ' ')}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-blue-200 ml-1" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            {/* Role Switcher & Auth Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                    Role: {currentUser.role.replace('_', ' ')}
                  </div>
                </div>

                <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Demo Persona
                </div>

                <div className="py-1">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSwitchUser(user)}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                        currentUser.id === user.id ? 'bg-blue-50/70 border-l-4 border-[#002b66]' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-xs border border-slate-200">
                        {user.role === 'INSTITUTION' ? <Building2 className="w-4 h-4 text-blue-600" /> :
                         user.role === 'OFFICER' ? <FileSearch className="w-4 h-4 text-indigo-600" /> :
                         user.role === 'EVC_INSPECTOR' ? <ClipboardCheck className="w-4 h-4 text-amber-600" /> :
                         user.role === 'ADMIN' ? <Lock className="w-4 h-4 text-slate-600" /> :
                         <Scale className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.designation}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Portal</span>
                  </button>
                  
                  <Link
                    href="/login"
                    onClick={() => setShowRoleMenu(false)}
                    className="w-full text-center block text-xs font-medium text-slate-600 hover:text-slate-900 py-1"
                  >
                    Manage Credentials
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
