import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect, useRef } from "react";
import { styled, createGlobalStyle } from "styled-components";
import Navbar from "../components/Navbar";
import { useAuth } from "../firebase/contexts/AuthContext";

import Container from "../components/containers/CartoonContainer";
import Header from "../components/headers/CartoonHeader";
import Button from "../components/buttons/CartoonButton";
import Snowfall from "../components/effects/Snowfall";
import SnowyGround from "../components/effects/SnowyGround";

import christmasGiftsImage from '../images/Christmas Gifts from Unsplash.jpg';
import christmasGiftsImage2 from '../images/Kids Gifts Christmas.jpg';

import { Link, Navigate, useNavigate } from 'react-router-dom';
import CartoonContainer from "../components/containers/CartoonContainer";
import CartoonHeader from "../components/headers/CartoonHeader";
import CartoonImageContainer from "../components/containers/CartoonImageContainer";

import img1 from '../images/Kids Gifts Christmas.jpg'
import img2 from '../images/Christmas Gifts from Unsplash.jpg'
import CartoonButton from "../components/buttons/CartoonButton";
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Coolvetica Rg';
    src: url('/fonts/Coolvetica Rg.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: 'TT Trick New';
    src: url('/fonts/TT Tricks Trial DemiBold.otf') format('opentype');
    font-weight: 600;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: 'TT Trick New';
    src: url('/fonts/TT Tricks Trial DemiBold Italic.otf') format('opentype');
    font-weight: 600;
    font-style: italic;
    font-display: block;
  }

  @font-face {
    font-family: 'TT Trick New';
    src: url('/fonts/TT Tricks Trial Bold.otf') format('opentype');
    font-weight: 700;
    font-style: normal;
    font-display: block;
  }

  * {
    font-family: 'Coolvetica Rg', 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: radial-gradient(circle at 50% 200%, #87CEEB 50%, #4169E1 70%, #1E3A8A 100%);
    background-attachment: fixed;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  * {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

interface BigNameProps {}
interface StyledSubtitleProps {
  orientiation: "left" | "center";
  color?: string;
}

const BigNameContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const BigName = styled.h1<BigNameProps>`
  font-size: 10vmin;
  font-family: "TT Trick New", serif;
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
  font-family: "TT Trick New", serif;
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
  return name.split(" ")[0];
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
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll', window.scrollY + 'px');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const firstName = useMemo(() =>
    user ? getFirstName(user.displayName || "") : "",
    [user]
  );

  const greetingText = useMemo(() => (
    user ? (
      <>
        Hello, <EmphasizedName>{firstName}</EmphasizedName>
      </>
    ) : (
      <>
        Please log in!
      </>
    )
  ), [user, firstName]);
  
  const content = useMemo(() => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5vmin'}}>
      
        <StyledContainer style={{ transform: 'translateX(-5vmin)' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '5vmin',
            gap: '1vmin',
            maxWidth: '30vmin',
            maxHeight: '10vmin'
          }}>
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
            <p style={{ fontSize: '2vmin', color: 'black' }}> - </p>
            <CartoonButton color="#CA242B" disabled={!user} onClick={() => {navigate('/registration')}}> <p>Register</p> </CartoonButton>
          </div>

          <CartoonImageContainer width="40vmin" height="40vmin">
            <img src={img1} alt="Description" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </CartoonImageContainer>
        </StyledContainer>

        <StyledContainer style={{ transform: 'translateX(5vmin)' }}>
          <CartoonImageContainer width="40vmin" height="40vmin">
            <img src={img2} alt="Description" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </CartoonImageContainer>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '5vmin',
            gap: '1vmin',
            maxWidth: '30vmin',
            maxHeight: '10vmin'
          }}>
            <CartoonHeader title="Help us help Canton!" subtitle="Donate to us on our website!" />
            <p style={{ fontSize: '2vmin', color: 'black' }}> - </p>
            <CartoonButton color="#CA242B" onClick={() => {window.open('https://cantongoodfellows.org/donate/', '_blank')}}> <p>Donate!</p> </CartoonButton>
          </div>
        </StyledContainer>
      
    </div>
  ), []);

  return (
    <div>
      <GlobalStyle />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Snowfall />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "100vh",
            paddingTop: "80px",
            marginTop: "10vh",
          }}
        >
          <BigNameContainer>
            <BigName>
              {greetingText}
            </BigName>
          </BigNameContainer>
          <ContentContainer>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "90vw",
                position: "relative"
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