import { EmailSignIn } from "../components/auth/EmailSignIn";
import CartoonContainer from "../components/containers/CartoonContainer";
import { styled } from "styled-components";
import Navbar from "../components/Navbar";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import Button from "../components/buttons/CartoonButton";
import { EmailSignUp } from "../components/auth/EmailSignUp";
import { Link, useNavigate } from 'react-router-dom';

const StyledContainer = styled(CartoonContainer)`
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: fit-content;

    align-items: center;
    justify-content: center;
`;

export const SignUp = () => {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"}}>
                <StyledContainer>
                    <EmailSignUp onSignUp={() => navigate('/')} />
                    <p> - or - </p>
                    <GoogleSignIn text="Sign Up with Google" onError={() => {}} />
                    <p> - if you already have an account, <Link to="/login" style={{ color: '#1EC9F2', textDecoration: 'none', cursor: 'pointer' }}>log in here</Link> - </p>
                </StyledContainer>
            </div>
        </>
    );
}   