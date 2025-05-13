import { EmailSignIn } from '../components/auth/EmailSignIn';
import CartoonContainer from '../components/containers/CartoonContainer';
import { styled } from 'styled-components';
import Navbar from '../components/Navbar';
import GoogleSignIn from '../components/auth/GoogleSignIn';
import Button from '../components/buttons/CartoonButton';
import { Link, useNavigate } from 'react-router-dom';

const StyledContainer = styled(CartoonContainer)`
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: fit-content;

    align-items: center;
    justify-content: center;
`;

export const LogIn = () => {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <StyledContainer>
                    <EmailSignIn onSignIn={() => navigate('/')} />
                    <p> - or - </p>
                    <GoogleSignIn onError={() => {}} />
                    <p>
                        {' '}
                        - if you don't have an account,{' '}
                        <Link
                            to="/signup"
                            style={{ color: '#1EC9F2', textDecoration: 'none', cursor: 'pointer' }}
                        >
                            sign up here
                        </Link>{' '}
                        -{' '}
                    </p>
                </StyledContainer>
            </div>
        </>
    );
};
