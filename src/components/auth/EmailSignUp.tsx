import React, { useState } from 'react';
import { AuthError, signInWithEmail, signUpWithEmail } from '../../firebase/auth';
import { useAuth } from '../../firebase/contexts/AuthContext';
import CartoonInput from '../inputs/CartoonInput';
import CartoonButton from '../buttons/CartoonButton';
import CartoonContainer from '../containers/CartoonContainer';
import { styled } from 'styled-components';
import CartoonHeader from '../headers/CartoonHeader';
import { Navigate, useNavigate } from 'react-router-dom';

const StyledContainer = styled(CartoonContainer)`
    display: flex;
    align-self: center;
    justify-self: center;
    vertical-align: middle;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    width: 30vmin;
`;  

interface EmailSignUpProps {
    onSignUp: () => void;
}

export const EmailSignUp: React.FC<EmailSignUpProps> = ({ onSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const { user, signInWithGoogle } = useAuth();
    
    const checkEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleSignUp = async () => {
        try {
            setError(null);
            setIsLoading(true);

            if (!email || !password || !confirmPassword || !displayName) {
                setError('Please fill in all fields');
                return;
            }

            if (!checkEmail(email)) {
                setError('Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (displayName.length < 3) {
                setError('Display name must be at least 3 characters');
                return;
            }

            const user = await signUpWithEmail(email, password, displayName);
            await signInWithEmail(email, password);
            onSignUp();
        } catch (error) {
            if (error instanceof AuthError) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1vmin' }}>
                <CartoonHeader title="Create Account" />
                {error && (
                    <div style={{
                        backgroundColor: '#FFE6E6',
                        color: '#D84040',
                        padding: '0.5vmin 1vmin',
                        borderRadius: '0.5vmin',
                        fontSize: '1.5vmin',
                        marginBottom: '0.5vmin',
                    }}>
                        {error}
                    </div>
                )}
                {verificationSent && (
                    <div style={{
                        backgroundColor: '#E6FFE6',
                        color: '#40D840',
                        padding: '0.5vmin 1vmin',
                        borderRadius: '0.5vmin',
                        fontSize: '1.5vmin',
                        marginBottom: '0.5vmin',
                    }}>
                        Verification email sent! Please check your inbox.
                    </div>
                )}
                <CartoonInput 
                    type="text" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e)} 
                    placeholder="Display Name" 
                    disabled={isLoading}
                />
                <CartoonInput 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e)} 
                    placeholder="Email" 
                    disabled={isLoading}
                />
                <CartoonInput 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e)} 
                    placeholder="Password" 
                    disabled={isLoading}
                />
                <CartoonInput 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e)} 
                    placeholder="Confirm Password" 
                    disabled={isLoading}
                />
                <CartoonButton 
                    color="#D84040" 
                    onClick={handleSignUp}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </CartoonButton>
            </div>

    );
};  