'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Building2, 
  FileSearch, 
  ClipboardCheck, 
  Scale, 
  CheckCircle2,
  User as UserIcon,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { AuthService } from '@/lib/auth/session';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { login, register, resetPassword, user } = useAuth();

  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('officer@aicte-india.org');
  const [password, setPassword] = useState('Password@123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = AuthService.getCredentials();

  // If already logged in, redirect to proper landing path
  useEffect(() => {
    if (user && !isLoading) {
      const destination = redirectParam || AuthService.getRoleLandingPath(user.role);
      router.push(destination);
    }
  }, [user, isLoading, redirectParam, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await login(email, password);
      if (!result.success || !result.user) {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
        return;
      }

      const dest = redirectParam || AuthService.getRoleLandingPath(result.user.role);
      router.push(dest);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error during Firebase authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(email, password, fullName || email.split('@')[0]);
      if (!result.success || !result.user) {
        setError(result.error || 'Registration failed.');
        return;
      }

      setSuccessMessage('Registration successful! Redirecting to Institutional Portal...');
      setTimeout(() => {
        router.push(redirectParam || '/institution');
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register account with Firebase');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Please provide your registered official email address.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email);
      if (!result.success) {
        setError(result.error || 'Could not send reset email.');
      } else {
        setSuccessMessage(`Password reset link dispatched to ${email}. Please check your inbox.`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (credEmail: string) => {
    setMode('LOGIN');
    setEmail(credEmail);
    setPassword('Password@123');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Left: Form Area */}
          <div className="p-8 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#002b66] flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-900 text-lg">
                  {mode === 'LOGIN' && 'AICTE Sentinel Sign In'}
                  {mode === 'REGISTER' && 'Institution Registration'}
                  {mode === 'FORGOT_PASSWORD' && 'Reset Sentinel Password'}
                </span>
              </div>
              
              <p className="text-xs text-slate-500 mb-5">
                {mode === 'LOGIN' && 'Firebase authenticated single sign-on for institutional approvals & regulatory intelligence.'}
                {mode === 'REGISTER' && 'Create your institutional credentials to submit and track approval applications.'}
                {mode === 'FORGOT_PASSWORD' && 'Enter your verified email to receive a secure Firebase recovery link.'}
              </p>

              {/* Mode Toggle Tabs (Sign In / Register) */}
              {mode !== 'FORGOT_PASSWORD' && (
                <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => { setMode('LOGIN'); setError(''); setSuccessMessage(''); }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      mode === 'LOGIN' 
                        ? 'bg-white text-slate-900 shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('REGISTER'); setError(''); setSuccessMessage(''); }}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      mode === 'REGISTER' 
                        ? 'bg-white text-slate-900 shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Register Institution
                  </button>
                </div>
              )}

              {/* Status & Error Alerts */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* 1. LOGIN FORM */}
              {mode === 'LOGIN' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Official Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@aicte-india.org"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMode('FORGOT_PASSWORD'); setError(''); setSuccessMessage(''); }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Default demo password: Password@123</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {isLoading ? 'Authenticating with Firebase...' : 'Sign In to Portal'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* 2. REGISTRATION FORM */}
              {mode === 'REGISTER' && (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Authorized Representative Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="e.g. Dr. Ramesh Sharma"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Institutional Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="registrar@institute.edu"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password (min. 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <strong className="text-slate-700">Role Notice:</strong> Self-registered accounts are enrolled in the Institution Portal. Regulatory officer roles are provisioned directly by AICTE administration.
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {isLoading ? 'Registering with Firebase...' : 'Create Institutional Account'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* 3. FORGOT PASSWORD FORM */}
              {mode === 'FORGOT_PASSWORD' && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@institute.edu"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Firebase will send a password reset link to this address.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {isLoading ? 'Dispatching Firebase Reset Link...' : 'Send Password Reset Link'}
                    <KeyRound className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMode('LOGIN'); setError(''); setSuccessMessage(''); }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Protected under AICTE Cyber Security & Access Controls (2026) • Firebase Auth Integrated
            </div>
          </div>

          {/* Right: 1-Click Role Credential Switcher */}
          <div className="bg-slate-50 p-8 sm:p-10 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                Demo Evaluator Shortcut
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">1-Click Role Selection</h3>
              <p className="text-xs text-slate-500 mb-4">
                Click any persona below to auto-fill credentials and test role-based capabilities:
              </p>

              <div className="space-y-2.5">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      email === acc.email
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                        {acc.role === 'INSTITUTION' ? <Building2 className="w-4 h-4 text-blue-600" /> :
                         acc.role === 'OFFICER' ? <FileSearch className="w-4 h-4 text-indigo-600" /> :
                         acc.role === 'EVC_INSPECTOR' ? <ClipboardCheck className="w-4 h-4 text-amber-600" /> :
                         acc.role === 'ADMIN' ? <Lock className="w-4 h-4 text-slate-600" /> :
                         <Scale className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{acc.name}</div>
                        <div className="text-[11px] text-slate-500">{acc.desc} ({acc.role})</div>
                      </div>
                    </div>
                    {email === acc.email && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-[11px] text-slate-400 bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
              <strong>Tip:</strong> All accounts authenticate directly via Google Firebase with audit logging.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <DemoBanner />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-[#002b66] animate-spin" />
        </div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
