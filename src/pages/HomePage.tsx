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
  style?: React.CSSProperties;
}

const StyledContainer = styled(Container)<ContainerProps>`
  padding: 2vmin;
  margin: 1vmin;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const StyledButton = styled(Button)`
  margin-top: 2vmin;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
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

const StyledSubtitle = styled.p<StyledSubtitleProps>`
  margin-top: 2vh;
  font-size: 3vmin;
  color: rgb(0, 0, 0);
  font-family: 'TT Trick New', serif;
  font-weight: 300;
  text-align: ${props => props.orientiation === "left" ? "left" : "center"};
  align-self: ${props => props.orientiation === "left" ? "flex-start" : "center"};
  margin-bottom: 1vh;
  ${props => props.color && `
    color: ${props.color};
  `}
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
    <div style={{ 
      marginTop: "2vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1vh",
      alignItems: "center"
    }}>
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        gap: "1vh",
        width: "100%",
        justifyContent: "space-between"
      }}>
        <StyledContainer>
          <Header
            title="Sponsor a Family"
          />
          <StyledSubtitle orientiation="center">
            Are you interested in sponsoring a child or an entire family, by purchasing gifts and clothing gift cards for Christmas?
          </StyledSubtitle>

          <StyledSubtitle orientiation="center">
            As you're deciding, here are some things to think about:
          </StyledSubtitle>

          <StyledSubtitle orientiation="left" color="#CA242B">
            - Our children are usually all sponsored out by the end of October. If you are interested in sponsoring a child, make sure to contact us in early October, or you might miss out!
          </StyledSubtitle>

          <StyledSubtitle orientiation="left" color="#CA242B">
            - Sponsors do not have to purchase all of the child's gifts. You decide how much you can afford to spend on your sponsored child. We fill in what is not supplied.
          </StyledSubtitle>

          <StyledSubtitle orientiation="left" color="#CA242B">
            - Anyone can sponsor a child, or several children; you don't need to be a Canton resident.
          </StyledSubtitle>

          <StyledSubtitle orientiation="center">
            Child assignments begin in early October! Click the button below to register to sponsor a child.
          </StyledSubtitle>
          
          <StyledButton
            color="#CA242B"
            disabled={!user}
          >
            <ButtonText>Register to Sponsor</ButtonText>
          </StyledButton>
        </StyledContainer>
        <img 
          src={christmasGiftsImage} 
          alt="Christmas Gifts"
          style={{ 
            width: "30vw",
            height: "auto",
            objectFit: "cover",
            borderRadius: "10px",
            border: "3px solid #000000",
            boxShadow: "0.5vmin 0.5vmin 0 #000000"
          }}
        />
      </div>
      
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        gap: "1vh",
        width: "100%",
        justifyContent: "space-between"
      }}>
        <img 
          src={christmasGiftsImage2} 
          alt="Christmas Gifts"
          style={{ 
            width: "30vw",
            height: "auto",
            objectFit: "cover",
            borderRadius: "10px",
            border: "3px solid #000000",
            boxShadow: "0.5vmin 0.5vmin 0 #000000"
          }}
        />
      
      <StyledContainer >
        <Header title="Get Assistance"/>

        <StyledSubtitle orientiation="center">
        Is your family in need of gift and food assistance for Christmas? And do you have children ages 18 or under? If so, the Canton Goodfellows are here to help.
        </StyledSubtitle>

        <StyledSubtitle orientiation="center">
        We supply gifts for children (not adults) and assist only Canton families, without regard to race or religion, who meet the following guidelines:
        </StyledSubtitle>

        <StyledSubtitle orientiation="left" color="#CA242B">
        - You must live in Canton.
        </StyledSubtitle>

        <StyledSubtitle orientiation="left" color="#CA242B">
        - Your children must live with you.
        </StyledSubtitle>

        <StyledSubtitle orientiation="left" color="#CA242B">
        - Your family must meet our income guidelines for a family of your size.
        </StyledSubtitle>

        <StyledSubtitle orientiation="left" color="#CA242B">
        - Your application must meet the date deadlines listed above, and be approved by our committee. Applications are reviewed on a first-come, first-served basis.
        </StyledSubtitle>

          <StyledButton color="#CA242B">
            <ButtonText>Sponsor Now!</ButtonText>
          </StyledButton>
        </StyledContainer>
      </div>

      <StyledContainer >
        <Header
          title="Help us help Canton"
          subtitle="Please consider donating to help us continue or mission."
        />
        <StyledButton color="#CA242B"             
          onClick={() => {
            window.open("https://cantongoodfellows.org/donate/", "_blank");
          }}>
          <ButtonText>Donate Now</ButtonText>
        </StyledButton>
      </StyledContainer>
    </div>
  ), [user]);


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
              {containerContent}
            </div>
          </ContentContainer>
        </div>
      </div>
      <SnowyGround />
    </div>
  );
};