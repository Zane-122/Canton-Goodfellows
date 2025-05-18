import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect, useRef } from 'react';
import { styled, createGlobalStyle } from 'styled-components';
import Navbar from '../components/Navbar';
import { useAuth } from '../firebase/contexts/AuthContext';

import Container from '../components/containers/CartoonContainer';
import Header from '../components/headers/CartoonHeader';
import Button from '../components/buttons/CartoonButton';
import Snowfall from '../components/effects/Snowfall';
import SnowyGround from '../components/effects/SnowyGround';

import christmasGiftsImage from '../images/Christmas Gifts from Unsplash.jpg';
import christmasGiftsImage2 from '../images/Kids Gifts Christmas.jpg';

import { Link, Navigate, useNavigate } from 'react-router-dom';
import CartoonContainer from '../components/containers/CartoonContainer';
import CartoonHeader from '../components/headers/CartoonHeader';
import CartoonImageContainer from '../components/containers/CartoonImageContainer';

import img1 from '../images/Kids Gifts Christmas.jpg';
import img2 from '../images/Christmas Gifts from Unsplash.jpg';
import CartoonButton from '../components/buttons/CartoonButton';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Tag } from '../components/headers/tag';

interface BigNameProps {}
interface StyledSubtitleProps {
    orientiation: 'left' | 'center';
    color?: string;
}

const BigNameContainer = styled.div`
    position: relative;
    height: 100%;
    overflow: hidden;
`;

const BigName = styled.h1<BigNameProps>`
    font-size: 10vmin;
    font-family: 'TT Trick New', serif;
    font-weight: 600;
    font-style: italic;
    color: rgb(214, 245, 255);
    letter-spacing: 0.7vmin;
    width: 100%;
    text-align: center;
    margin: 0;
    padding: 0;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    transform: translateY(calc(var(--scroll) * 0.5));
    margin-bottom: 3vmin;
`;

const EmphasizedName = styled.span`
    font-size: 10vmin;
    font-family: 'TT Trick New', serif;
    font-weight: 700;
    font-style: italic;
    color: rgb(255, 255, 255);
    text-decoration: underline;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
`;

const getFirstName = (name: string) => {
    return name.split(' ')[0];
};

const ContentContainer = styled.div`
    position: relative;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const StyledContainer = styled(CartoonContainer)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: 5vmin auto;
    margin-top: 0vh;
    height: fit-content;
`;

export const HomePage: React.FC = () => {
    const { user, signInWithGoogle, logout } = useAuth();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(user !== null);
    const [accountType, setAccountType] = useState<string | null>(null);

    useEffect(() => {
        const getAccountType = async () => {
            if (!user) {console.log('NO USER'); return;}
            else console.log('USER EXISTS');
            
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc?.data();
            const accountType = userData?.accountType;
            setAccountType(accountType);
            console.log(accountType === null ? 'YOUR CODE DOESNT WORK' : accountType);
        };
        
        getAccountType();
    }, [user]);

    useEffect(() => {
        const handleScroll = () => {
            document.documentElement.style.setProperty('--scroll', window.scrollY + 'px');
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const firstName = useMemo(() => (user ? getFirstName(user.displayName || '') : ''), [user]);

    const greetingText = useMemo(
        () =>
            user ? (
                <>
                    Hello, <EmphasizedName>{firstName}</EmphasizedName>
                </>
            ) : (
                <>Please log in!</>
            ),
        [user, firstName]
    );

    const content = useMemo(
        () => (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5vmin',
                }}
            >
                {accountType !== null && <StyledContainer>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1vmin'}}>
                    <CartoonHeader
                        title="Go to your dashboard!"
                        subtitle={accountType === 'sponsor' ? 'Click below to go to your sponsor dashboard where you can manage who you have sponsored' : 'Click below to go to your family dashboard where you can manage your family'}
                    />
                    <text> - </text>
                    <CartoonButton
                        color="#CA242B"
                        onClick={() => {
                            navigate(accountType === 'sponsor' ? '/sponsor-dashboard' : '/family-dashboard');
                        }}
                    >
                        {accountType === 'sponsor' ? 'Go to Sponsor Dashboard' : 'Go to Family Dashboard'}
                    </CartoonButton>
                    </div>
                </StyledContainer>}
                <StyledContainer>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '5vmin',
                            gap: '1vmin',
                            maxWidth: '30vmin',
                            maxHeight: '10vmin',
                        }}
                    >
                        <CartoonHeader
                            title="Register to Sponsor or for Aid"
                            subtitle={
                                <>
                                    Click here to register!
                                    <br />
                                    (You need an account!)
                                </>
                            }
                        />
                        {accountType === null && <p style={{ fontSize: '2vmin', color: 'black' }}> - </p>}
                        {accountType !== null && <div style={{padding: '1vmin'}}> <Tag backgroundColor="#CA242B" text={`Registered as a ${accountType}`}/> </div>}
                        <CartoonButton
                            color="#CA242B"
                            disabled={!user}
                            onClick={() => {
                                navigate('/registration');
                            }}
                        >
                            {' '}
                            <p>Register</p>{' '}
                        </CartoonButton>
                        
                    </div>

                    <CartoonImageContainer width="40vmin" height="40vmin">
                        <img
                            src={img1}
                            alt="Description"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </CartoonImageContainer>
                </StyledContainer>

                <StyledContainer>
                    <CartoonImageContainer width="40vmin" height="40vmin">
                        <img
                            src={img2}
                            alt="Description"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </CartoonImageContainer>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '5vmin',
                            gap: '1vmin',
                            maxWidth: '30vmin',
                            maxHeight: '10vmin',
                        }}
                    >
                        <CartoonHeader
                            title="Help us help Canton!"
                            subtitle="Donate to us on our website!"
                        />
                        <p style={{ fontSize: '2vmin', color: 'black' }}> - </p>
                        <CartoonButton
                            color="#CA242B"
                            onClick={() => {
                                window.open('https://cantongoodfellows.org/donate/', '_blank');
                            }}
                        >
                            {' '}
                            <p>Donate!</p>{' '}
                        </CartoonButton>
                    </div>
                </StyledContainer>
            </div>
        ),
        [accountType, navigate]
    );

    return (
        <div>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}
            >
                <Snowfall />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Navbar />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        minHeight: '100vh',
                        paddingTop: '80px',
                        marginTop: '10vh',
                    }}
                >
                    <BigNameContainer>
                        <BigName>{greetingText}</BigName>
                    </BigNameContainer>
                    <ContentContainer>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '90vw',
                                position: 'relative',
                            }}
                        >
                            {content}
                        </div>
                    </ContentContainer>
                </div>
            </div>
            <SnowyGround />
        </div>
    );
};
