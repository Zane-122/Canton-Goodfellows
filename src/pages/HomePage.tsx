import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect, useRef } from "react";
import { styled, createGlobalStyle } from "styled-components";
import Navbar from "../components/Navbar";
import { useAuth } from "../firebase/contexts/AuthContext";

import Container from "../components/containers/CartoonContainer";
import Header from "../components/headers/CartoonHeader";
import Button from "../components/buttons/CartoonButton";
import Snowfall from "../components/effects/Snowfall";
import { debounce } from 'lodash'; // Import debounce from lodash

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
`;

interface BigNameProps {}

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

interface ContainerProps {
  orientation: "left" | "right";
}

const StyledContainer = styled(Container)<ContainerProps>`
  padding: 2vmin;
  margin: 1vmin;
  width: 25vw;
  align-self: ${props => props.orientation === "left" ? "flex-start" : "flex-end"};
`;

const StyledButton = styled(Button)`
  margin-top: 2vmin;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.p`
  font-size: 2vmin;
  color: rgb(255, 255, 255);
  margin: 0;
  font-family: 'TT Trick New', serif;
  font-weight: 700;
`;

const getFirstName = (name: string) => {
  return name.split(" ")[0];
};

const ContentContainer = styled.div`
  position: relative;
`;

export const HomePage: React.FC = () => {
  const { user, signInWithGoogle, logout } = useAuth();

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
        Please sign in!
      </>
    )
  ), [user, firstName]);

  const containerContent = useMemo(() => (
    <div style={{ marginTop: "2vh" }}>
      <StyledContainer orientation="left">
        <Header
          title="Donate!"
          subtitle="Donate to the Canton Good Fellows to help families in need throughout the year!"
        />
        <StyledButton
          color="#CA242B"
          onClick={() => {
            window.open("https://cantongoodfellows.org/donate/", "_blank");
          }}
        >
          <ButtonText>Donate Now!</ButtonText>
        </StyledButton>
      </StyledContainer>

      <StyledContainer orientation="left">
        <Header title="Sponsor a Family!" subtitle="Help a family in need buy gifts for the holidays!" />
        <StyledButton color="#CA242B" disabled={!user}>
          <ButtonText>Sponsor Now!</ButtonText>
        </StyledButton>
      </StyledContainer>

      <StyledContainer orientation="left">
        <Header
          title="Are you a family in need?"
          subtitle="Register to receive help from the Canton Good Fellows!"
        />
        <StyledButton color="#CA242B" disabled={!user}>
          <ButtonText>Register Now!</ButtonText>
        </StyledButton>
      </StyledContainer>
    </div>
  ), [user]);
  return (
    <div>
      <GlobalStyle />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
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
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "1vh",
                width: "90vw",
              }}
            >
              {containerContent}
            </div>
          </ContentContainer>
        </div>
      </div>
    </div>
  );
};