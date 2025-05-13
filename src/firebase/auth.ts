import { 
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
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
          throw new AuthError(error.code, error.message);
      }
    }
    throw new AuthError('An unexpected error occurred. Please try again.', 'unknown');
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw new AuthError('No account found with this email.', 'user-not-found');
        case 'auth/wrong-password':
          throw new AuthError('Incorrect password.', 'wrong-password');
        case 'auth/invalid-email':
          throw new AuthError('Invalid email address.', 'invalid-email');
        default:
          throw new AuthError('Failed to sign in. Please try again.', 'signin-failed');
      }
    }
    throw new AuthError('An unexpected error occurred. Please try again.', 'unknown');
  }
}

export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's profile with display name
    await updateProfile(result.user, {
      displayName: displayName
    });
    
    return result.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new AuthError('An account already exists with this email.', 'email-in-use');
        case 'auth/invalid-email':
          throw new AuthError('Invalid email address.', 'invalid-email');
        case 'auth/weak-password':
          throw new AuthError('Password is too weak.', 'weak-password');
        default:
          throw new AuthError('Failed to sign up. Please try again.', 'signup-failed');
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