'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  getIdToken
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { User, UserRole } from '@/types';
import { AuthService, DEMO_CREDENTIALS } from '@/lib/auth/session';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (email: string, pass: string, name: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoUser: (targetUser: User) => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && fbUser.email) {
        // Resolve profile from authoritative store (preventing privilege self-escalation)
        const appUser = AuthService.resolveUserProfile(fbUser.email, fbUser.displayName);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      let fbCred;
      try {
        fbCred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      } catch (signInErr: any) {
        // Auto-provision demo persona if this is a pre-seeded evaluator account
        // and doesn't exist in the freshly linked Firebase project yet
        const isDemo = DEMO_CREDENTIALS.some(c => c.email.toLowerCase() === email.trim().toLowerCase());
        const isNotFound = signInErr?.code === 'auth/user-not-found' || 
                           signInErr?.code === 'auth/invalid-credential' ||
                           signInErr?.code === 'auth/invalid-login-credentials';

        if (isDemo && isNotFound) {
          try {
            fbCred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
            const demoInfo = DEMO_CREDENTIALS.find(c => c.email.toLowerCase() === email.trim().toLowerCase());
            if (demoInfo) {
              await updateProfile(fbCred.user, { displayName: demoInfo.name });
            }
          } catch {
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }

      const resolved = AuthService.resolveUserProfile(fbCred.user.email || email, fbCred.user.displayName);
      setUser(resolved);

      // Record in backend audit trail & verify session
      try {
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: fbCred.user.email || email, method: 'FIREBASE_AUTH' })
        });
      } catch (apiErr) {
        console.warn('Backend login audit sync notification error:', apiErr);
      }

      return { success: true, user: resolved };
    } catch (err: any) {
      let msg = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please wait a few moments.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    setError(null);
    try {
      const fbCred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await updateProfile(fbCred.user, { displayName: name.trim() });

      // Note: By security design, self-registration ALWAYS creates unprivileged INSTITUTION role
      const resolved = AuthService.resolveUserProfile(fbCred.user.email || email, name.trim());
      setUser(resolved);

      // Notify backend
      try {
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: fbCred.user.email || email, 
            name: name.trim(),
            isRegistration: true, 
            method: 'FIREBASE_SIGNUP' 
          })
        });
      } catch (apiErr) {
        console.warn('Backend registration audit sync error:', apiErr);
      }

      return { success: true, user: resolved };
    } catch (err: any) {
      let msg = 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      if (user) {
        AuthService.recordLogout(user);
      }
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (err) {
      console.error('Error signing out of Firebase:', err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: any) {
      let msg = 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No registered account found with this email.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.message) {
        msg = err.message;
      }
      return { success: false, error: msg };
    }
  };

  const switchDemoUser = async (targetUser: User) => {
    // For seamless testing in demo environments, attempt login with targetUser demo password
    const demoCred = DEMO_CREDENTIALS.find(c => c.email.toLowerCase() === targetUser.email.toLowerCase());
    if (demoCred) {
      await login(demoCred.email, demoCred.password);
    } else {
      setUser(targetUser);
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (!firebaseUser) return null;
    return await getIdToken(firebaseUser);
  };

  const value = useMemo(() => ({
    firebaseUser,
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    switchDemoUser,
    getToken
  }), [firebaseUser, user, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
