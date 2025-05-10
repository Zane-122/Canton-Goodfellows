import { 
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export interface AuthUser {
  email: string | null;
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    console.error("Error signing in with Google:", error);
    
    // Handle specific error cases
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-disabled':
          throw new AuthError('This account has been disabled. Please contact support.', 'user-disabled');
        case 'auth/popup-closed-by-user':
          throw new AuthError('Sign in was cancelled. Please try again.', 'popup-closed');
        case 'auth/popup-blocked':
          throw new AuthError('Pop-up was blocked. Please allow pop-ups for this site.', 'popup-blocked');
        case 'auth/cancelled-popup-request':
          throw new AuthError('Another sign-in attempt is in progress.', 'popup-cancelled');
        default:
          throw new AuthError('An error occurred during sign in. Please try again.', 'unknown');
      }
    }
    throw new AuthError('An unexpected error occurred. Please try again.', 'unknown');
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new AuthError('Failed to sign out. Please try again.', 'signout-failed');
  }
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
} 