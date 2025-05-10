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
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '0.5rem 1rem', 
          borderRadius: '4px',
          marginTop: '0.5rem'
        }}>
          {error}
        </div>
      )}
      {!user && (
        <Button 
          color="#F5F5F5"
          onClick={handleSignIn}
        >
          Sign in with Google
        </Button>
      )}
    </div>
  );
};

export default GoogleSignIn; 