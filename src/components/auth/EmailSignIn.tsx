import { useState } from 'react';
import { signInWithEmail } from '../../firebase/auth';
import { useAuth } from '../../firebase/contexts/AuthContext';
import { AuthError } from '../../firebase/auth';
import CartoonContainer from '../containers/CartoonContainer';
import CartoonHeader from '../headers/CartoonHeader';
import CartoonInput from '../inputs/CartoonInput';
import CartoonButton from '../buttons/CartoonButton';
import { styled } from 'styled-components';

const StyledContainer = styled(CartoonContainer)`
    display: flex;
    align-self: center;
    justify-self: center;
    vertical-align: middle;
    vertical-align-self: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    width: 30vmin;
`;

interface EmailSignInProps {
    onSignIn: () => void;
}

export const EmailSignIn: React.FC<EmailSignInProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signInWithGoogle } = useAuth();

  const checkEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (!email || !password) {
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

      await signInWithEmail(email, password);
      onSignIn();
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1vmin' }}>
        <CartoonHeader title="Log In" />
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
        <CartoonButton 
          color="#D84040" 
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </CartoonButton>
      </div>

  );
}
