import React, { useState } from 'react';
import { useAuth } from '../../firebase/contexts/AuthContext';
import Button from '../buttons/CartoonButton';
import { AuthError } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';

interface GoogleSignInProps {
    text?: string;
    onError: (error: string) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ text, onError }) => {
    const { user, signInWithGoogle, logout } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            setError(null);
            setIsLoading(true);
            await signInWithGoogle();
        } catch (err) {
            if (err instanceof AuthError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
            navigate('/');
            if (error != null) {
                onError(error);
            }
        }
    };

    const handleSignOut = async () => {
        try {
            setError(null);
            setIsLoading(true);
            await logout();
        } catch (err) {
            if (err instanceof AuthError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
            navigate('/');
        }
    };

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
            {error && (
                <div
                    style={{
                        backgroundColor: '#FFE6E6',
                        color: '#D84040',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                    }}
                >
                    {error}
                </div>
            )}
            <Button color="#1EC9F2" onClick={handleSignIn} disabled={isLoading}>
                {isLoading ? 'Loading...' : text || 'Log in with Google'}
            </Button>
        </div>
    );
};

export default GoogleSignIn;
