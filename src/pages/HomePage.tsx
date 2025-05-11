import { styled, createGlobalStyle } from "styled-components";
import Navbar from "../components/Navbar";
import { useAuth } from "../firebase/contexts/AuthContext";

import Container from "../components/containers/CartoonContainer";
import Header from "../components/headers/CartoonHeader";
import Button from "../components/buttons/CartoonButton";
import Snowfall from "../components/effects/Snowfall";
import { useEffect, useState, useCallback } from "react";

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

  * {
    font-family: 'Coolvetica Rg', sans-serif;
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

interface BigNameProps {
  scrolled: number;
}

const BigName = styled.h1<BigNameProps>`
  font-size: 10vmin;
  font-family: "TT Trick New Italic", serif;
  color: rgb(214, 245, 255);
  letter-spacing: 0.7vmin;
  position: fixed;
  top: 17vh;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 0;
  transition: all 0.3s ease;
  opacity: ${props => props.scrolled > 50 ? "0" : "1"};
  filter: blur(${props => Math.max(0, Math.min((props.scrolled - 35) / 3, 30))}px);
`;

const EmphasizedName = styled.span`
  font-size: 10vmin;
  font-family: "TT Trick New Bold Italic", serif;
  color: rgb(255, 255, 255);
  text-decoration: underline;
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
  font-family: 'TT Trick New Bold', serif;
`;

const getFirstName = (name: string) => {
  return name.split(" ")[0];
};

export const HomePage: React.FC = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <GlobalStyle />
      <Snowfall />
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "100vh",
          paddingTop: "80px",
          marginTop: "26vh",
        }}
      >
        <BigName scrolled={scrolled}>
          {user ? (
            <>
              Hello, <EmphasizedName>{getFirstName(user?.displayName || "")}</EmphasizedName>
            </>
          ) : (
            <>
              <EmphasizedName>Sign in</EmphasizedName> to continue
            </>
          )}
        </BigName>
        <div>
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
        </div>
      </div>
    </div>
  );
};
