import React, { useState } from 'react';
import { logOut } from '../../firebase/auth';
import { AuthError } from '../../firebase/auth';
import CartoonButton from '../buttons/CartoonButton';
import { styled } from 'styled-components';
import { useAuth } from '../../firebase/contexts/AuthContext';

const SignOutContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1vmin;
`;

const ErrorMessage = styled.div`
    background-color: #FFE6E6;
    color: #D84040;
    padding: 0.5vmin 1vmin;
    border-radius: 0.5vmin;
    font-size: 1.5vmin;
    margin-bottom: 0.5vmin;
`;

interface SignOutProps {
    onSignOut?: () => void;
}

export const SignOut: React.FC<SignOutProps> = ({ onSignOut }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const handleSignOut = async () => {
        try {
            setError(null);
            setIsLoading(true);
            await logOut();
            if (onSignOut) {
                onSignOut();
            }
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
        <SignOutContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <CartoonButton 
                color="#D84040" 
                onClick={handleSignOut}
                disabled={isLoading || !user}
            >
                {isLoading ? 'Signing Out...' : 'Sign Out'}
            </CartoonButton>
        </SignOutContainer>
    );
};   