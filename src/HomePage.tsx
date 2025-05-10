import { styled, createGlobalStyle } from "styled-components";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./firebase/contexts/AuthContext";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Coolvetica Rg';
    src: url('../public/fonts/Coolvetica Rg.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
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


const getFirstName = (name: string) => {
  return name.split(" ")[0];
};

export const HomePage: React.FC = () => {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <div>
      <GlobalStyle />
      <Navbar />
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", minHeight: "100vh"}}>
        <BigName>
          {user ? (
            <>Hello, <NameSpan>{getFirstName(user?.displayName || "")}</NameSpan></>
          ) : (
            <><SISpan>Sign in</SISpan> to continue</>
          )}
        </BigName>
      </div>
    </div>
  );
};
