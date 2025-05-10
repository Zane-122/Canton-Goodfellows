import React, { useState } from 'react';
import { useAuth } from '../../firebase/contexts/AuthContext';
import Button from '../buttons/CartoonButton';
import { AuthError } from '../../firebase/auth';

const GoogleSignIn: React.FC = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await logout();
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <Button 
          color={user ? "#228B22" : "#228B22"}
          onClick={user ? handleSignOut : handleSignIn}
        >
          <p>{user ? "Sign out" : "Sign in with Google"}</p>
        </Button>
    </div>
  );
};

export default GoogleSignIn; 