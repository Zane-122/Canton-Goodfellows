import { styled, createGlobalStyle } from "styled-components";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./firebase/contexts/AuthContext";

import Container from "./components/containers/CartoonContainer";
import Header from "./components/headers/CartoonHeader";
import Button from "./components/buttons/CartoonButton";
import Snowfall from "./components/effects/Snowfall";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Coolvetica Rg';
    src: url('../public/fonts/Coolvetica Rg.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  * {
    font-family: 'Coolvetica Rg', sans-serif;
  }
`;

const BigName = styled.h1`
  padding: 0vmind;
  font-size: 10vmin;
  font-family: "Coolvetica Rg", sans-serif;
  font-weight: normal;
  color: rgb(28, 28, 28);
  letter-spacing: 0.7vmin;
  align-self: center;
  margin-top: 2vh;
`;

const NameSpan = styled.span`
  color: #D84040;
`;


const SISpan = styled.span`
  color:rgb(0, 146, 41);
`;

const StyledContainer = styled(Container)`
  padding: 2vmin;
  margin: 1vmin;
  width: 25vw;
`;

const StyledButton = styled(Button)`
  margin-top: 2vmin;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.p`
  font-size: 1.5vmin;
  margin: 0;
  padding: 1vmin;
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
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", minHeight: "100vh"}}>
        <BigName>
          {user ? (
            <>Hello, <NameSpan>{getFirstName(user?.displayName || "")}</NameSpan></>
          ) : (
            <><SISpan>Sign in</SISpan> to continue</>
          )}
        </BigName>
        <div>
          <div style={{
            display: "flex", 
            flexDirection: "row", 
            alignItems: "flex-start", 
            justifyContent: "center", 
            gap: "20px", 
            width: "100%"
          }}>
            <StyledContainer>
              <Header title="Donate!" subtitle="Donate to the Canton Good Fellows to help families in need throughout the year!" />
              <StyledButton color="#FFD700" onClick={() => {
                window.open("https://cantongoodfellows.org/donate/", "_blank");
              }}>
                <ButtonText>Donate Now!</ButtonText>
              </StyledButton>
            </StyledContainer>
            <StyledContainer>
              <Header title="Sponsor a Family!" subtitle="Help a family in need buy gifts for the hollidays!" />
              <StyledButton color="#FFD700">
                <ButtonText>Sponsor Now!</ButtonText>
              </StyledButton>
            </StyledContainer>
            <StyledContainer>
            <Header title="Are you a family in need?" subtitle="Register to receive help from the Canton Good Fellows!" />
              <StyledButton color="#FFD700">
                <ButtonText>Register Now!</ButtonText>
              </StyledButton>
            </StyledContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
