import { styled, createGlobalStyle } from "styled-components";
import Navbar from "../components/Navbar";
import { useAuth } from "../firebase/contexts/AuthContext";

import Container from "../components/containers/CartoonContainer";
import Header from "../components/headers/CartoonHeader";
import Button from "../components/buttons/CartoonButton";
import Snowfall from "../components/effects/Snowfall";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Coolvetica Rg';
    src: url('/fonts/Coolvetica Rg.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'TT Trick New';
    src: url('/fonts/TT Tricks Trial DemiBold.otf') format('opentype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
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
`;

const BigName = styled.h1`
  font-size: 10vmin;
  font-family: "TT Trick New Italic", serif;
  color: rgb(214, 245, 255);
  letter-spacing: 0.7vmin;
  align-self: center;
  margin-top: 2vh;
  transition: all 0.3s ease;
`;

const EmphasizedName = styled.span`
  font-size: 10vmin;
  font-family: "TT Trick New Bold Italic", serif;
  color: rgb(255, 255, 255);
  text-decoration: underline;
`;

interface ButtonProps {
  orientation: "left" | "right";
}

const StyledContainer = styled(Container)<ButtonProps>`
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
          marginTop: "10vh",
        }}
      >
        <BigName>
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

            <StyledContainer orientation="right">
              <Header title="Sponsor a Family!" subtitle="Help a family in need buy gifts for the holidays!" />
              <StyledButton  color="#CA242B">
                <ButtonText>Sponsor Now!</ButtonText>
              </StyledButton>
            </StyledContainer>

            <StyledContainer orientation="left">
              <Header
                title="Are you a family in need?"
                subtitle="Register to receive help from the Canton Good Fellows!"
              />
              <StyledButton color="#CA242B">
                <ButtonText>Register Now!</ButtonText>
              </StyledButton>
            </StyledContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
