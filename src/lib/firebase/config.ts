import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// AICTE Sentinel Web App's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCdQwLXSDHxZ96pl1pI4Io2Hb0zvSyWAwM",
  authDomain: "aicte-sentinel.firebaseapp.com",
  projectId: "aicte-sentinel",
  storageBucket: "aicte-sentinel.firebasestorage.app",
  messagingSenderId: "583942298191",
  appId: "1:583942298191:web:133a8d72e1f75dc99e683a",
  measurementId: "G-KKVDCHNC29"
};

// Initialize Firebase app singleton
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Analytics conditionally on client side only to avoid SSR issues
let analyticsInstance: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics initialization failed or unsupported in this environment
  });
}

export { analyticsInstance as analytics };
