'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  LogIn,
  Menu,
  X
} from 'lucide-react';
import { UserRole, User } from '@/types';
import { DEMO_USERS } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/lib/auth/session';
import NotificationCenter from '@/components/NotificationCenter';

interface NavLinkItem {
  label: string;
  href: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, logout, switchDemoUser } = useAuth();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (roleMenuRef.current && !roleMenuRef.current.contains(target)) {
        setShowRoleMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setShowMoreMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile and dropdown menus on route change
  useEffect(() => {
    setShowRoleMenu(false);
    setShowMoreMenu(false);
    setShowMobileMenu(false);
  }, [pathname]);

  const handleSwitchUser = async (targetUser: User) => {
    setShowRoleMenu(false);
    await switchDemoUser(targetUser);
    const landing = AuthService.getRoleLandingPath(targetUser.role);
    router.push(landing);
  };

  const handleLogout = async () => {
    setShowRoleMenu(false);
    setShowMobileMenu(false);
    await logout();
    router.push('/login');
  };

  // Determine nav links based on authentication and role
  let primaryLinks: NavLinkItem[] = [];
  let secondaryLinks: NavLinkItem[] = [];

  if (!authUser) {
    // 1. SIGNED-OUT: Show ONLY "Portal Home"
    primaryLinks = [{ label: 'Portal Home', href: '/' }];
    secondaryLinks = [];
  } else {
    // 2. SIGNED-IN: Role-specific links
    const role: UserRole = authUser.role;

    switch (role) {
      case 'INSTITUTION':
        primaryLinks = [
          { label: 'Portal Home', href: '/' },
          { label: 'Institution Portal', href: '/institution' }
        ];
        secondaryLinks = [
          { label: 'Safeguards', href: '/safeguards' },
          { label: 'Metrics', href: '/metrics' },
          { label: 'Conformance', href: '/conformance' }
        ];
        break;

      case 'OFFICER':
        primaryLinks = [
          { label: 'Portal Home', href: '/' },
          { label: 'Officer Queue', href: '/officer' },
          { label: 'Linkage Radar', href: '/officer/radar' }
        ];
        secondaryLinks = [
          { label: 'Audit Trail', href: '/admin' },
          { label: 'Safeguards', href: '/safeguards' },
          { label: 'Metrics', href: '/metrics' },
          { label: 'Conformance', href: '/conformance' }
        ];
        break;

      case 'EVC_INSPECTOR':
        primaryLinks = [
          { label: 'Portal Home', href: '/' },
          { label: 'EVC Inspection', href: '/evc' }
        ];
        secondaryLinks = [
          { label: 'Safeguards', href: '/safeguards' },
          { label: 'Metrics', href: '/metrics' },
          { label: 'Conformance', href: '/conformance' }
        ];
        break;

      case 'AUDITOR':
        primaryLinks = [
          { label: 'Portal Home', href: '/' },
          { label: 'Linkage Radar', href: '/officer/radar' }
        ];
        secondaryLinks = [
          { label: 'Audit Trail', href: '/auditor' },
          { label: 'Safeguards', href: '/safeguards' },
          { label: 'Metrics', href: '/metrics' },
          { label: 'Conformance', href: '/conformance' }
        ];
        break;

      case 'ADMIN':
      default:
        primaryLinks = [
          { label: 'Portal Home', href: '/' },
          { label: 'Officer Queue', href: '/officer' },
          { label: 'Linkage Radar', href: '/officer/radar' },
          { label: 'EVC Inspection', href: '/evc' }
        ];
        secondaryLinks = [
          { label: 'Audit Trail', href: '/admin' },
          { label: 'Safeguards', href: '/safeguards' },
          { label: 'Metrics', href: '/metrics' },
          { label: 'Conformance', href: '/conformance' }
        ];
        break;
    }
  }

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isMoreActive = secondaryLinks.some(link => isLinkActive(link.href));

  return (
    <header className="sticky top-0 z-50 bg-[#002b66] text-white shadow-md border-b border-[#001f4d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-inner group-hover:bg-white/15 transition-all shrink-0">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                  AICTE Sentinel
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-400/30 whitespace-nowrap hidden xs:inline-block">
                  SIH26261
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-blue-200 font-medium truncate max-w-[200px] sm:max-w-none hidden lg:block">
                Regulatory Decision-Support &amp; Compliance Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Items (Strict Single-Line at 1280px) */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {primaryLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    active 
                      ? 'bg-white/15 text-white font-semibold shadow-2xs' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* "More" Dropdown for Secondary Items when Signed In */}
            {secondaryLinks.length > 0 && (
              <div className="relative" ref={moreMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  aria-expanded={showMoreMenu}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    isMoreActive 
                      ? 'bg-white/15 text-white font-semibold shadow-2xs' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-blue-200 transition-transform duration-150 ${showMoreMenu ? 'rotate-180' : ''}`} />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Regulatory Modules
                    </div>
                    {secondaryLinks.map((link) => {
                      const active = isLinkActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setShowMoreMenu(false)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                            active
                              ? 'bg-blue-50 text-blue-900 font-bold border-l-4 border-[#002b66]'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                          }`}
                        >
                          <span className="whitespace-nowrap">{link.label}</span>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Section: Notification Bell + User Role Switcher OR Sign In Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Notification Bell: ONLY SHOWN WHEN SIGNED IN */}
            {authUser && (
              <div className="text-white shrink-0">
                <NotificationCenter />
              </div>
            )}

            {/* Authenticated User / Role Switcher */}
            {authUser ? (
              <div className="relative" ref={roleMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  aria-expanded={showRoleMenu}
                  aria-haspopup="true"
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-left shrink-0"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                    {authUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                      {authUser.name}
                    </div>
                    <div className="text-[10px] text-blue-200 uppercase tracking-wider font-medium truncate">
                      {authUser.role.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200 ml-0.5 shrink-0" />
                </button>

                {/* Role Switcher & Persona Dropdown */}
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{authUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{authUser.email}</div>
                      <div className="mt-1 inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                        Role: {authUser.role.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Demo Persona
                    </div>

                    <div className="py-1">
                      {DEMO_USERS.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleSwitchUser(user)}
                          className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                            authUser.id === user.id ? 'bg-blue-50/70 border-l-4 border-[#002b66]' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-xs border border-slate-200 shrink-0">
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
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
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
            ) : (
              /* Signed-Out State: Strict Single-Line Sign In Button */
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button (Visible on screens < 768px, tested at 390px) */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={showMobileMenu}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 focus:outline-hidden transition-colors shrink-0"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Tested at 390px) */}
      {showMobileMenu && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-[#001f4d] border-t border-[#00173b] px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="space-y-1">
            {primaryLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    active 
                      ? 'bg-white/20 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Secondary Links for Signed-In Roles in Mobile Menu */}
            {secondaryLinks.length > 0 && (
              <div className="pt-2 border-t border-white/10 mt-2 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                  Secondary Modules
                </div>
                {secondaryLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        active 
                          ? 'bg-white/20 text-white font-semibold' 
                          : 'text-blue-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Footer Action: Sign In or Sign Out */}
          <div className="pt-3 border-t border-white/10">
            {authUser ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-blue-200 flex items-center justify-between">
                  <span className="font-semibold text-white truncate">{authUser.name}</span>
                  <span className="text-[10px] font-bold uppercase bg-blue-500/30 px-2 py-0.5 rounded text-blue-200">
                    {authUser.role.replace('_', ' ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setShowMobileMenu(false)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
