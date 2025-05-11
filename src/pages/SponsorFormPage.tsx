import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import FormCard from '../components/containers/FormCard';
import Navbar from '../components/Navbar';
import CartoonContainer from '../components/containers/CartoonContainer';
import Snowfall from '../components/effects/Snowfall';
import CartoonButton from '../components/buttons/CartoonButton';

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

const StyledContainer = styled(CartoonContainer)`
  width: fit-content;
  height: fit-content;
  padding: 2vmin;
  margin: 1vmin;
`;

const StyledFormPageContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 10vh;
  margin-bottom: 10vh;
`;

const StyledFormPageTitle = styled.h1`
  font-size: 10vmin;
  font-family: "TT Trick New Bold Italic", serif;
  color: rgb(255, 255, 255);
  letter-spacing: 0.2vmin;
  margin: 2vmin;
  padding: 0;
`;

const FormCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 90vw;
  gap: 1vh;
`;

const StyledButton = styled(CartoonButton)`
  font-size: 5vmin;
  font-family: "TT Trick New Bold Italic", serif;
  color: rgb(255, 255, 255);
  letter-spacing: 0.2vmin;
  margin: 2vmin;
  padding: 1vmin;
`;
export const SponsorFormPage: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Navbar />
      <Snowfall />
      <StyledFormPageContainer>
        <StyledContainer color="#D84040">
          <StyledFormPageTitle>Sponsor Form</StyledFormPageTitle>
        </StyledContainer>
        <FormCardsContainer>

          <StyledContainer color="#D84040">
            <FormCard title="Phone Number" type="phonenumber" subtitle="Please enter the primary phone number we can use to reach you." />
          </StyledContainer>

          <StyledContainer color="#D84040">
            <FormCard title="Gender Preferences" type="genderpreferences" subtitle="Do you have a preferred gender to be matched with?" />
          </StyledContainer>

          <StyledContainer color="#D84040">
            <FormCard title="Age Preferences" type="agepreferences" subtitle="Do you have a preferred age of children to sponsor for?" />
          </StyledContainer>

          <StyledContainer color="#D84040">
            <FormCard title="Extra Accomodations" type="accomodations" subtitle="Are you willing to accomodate for neurodiverse kids? (Ex. kids with Autism, ADHD, sensory processing issues, etc.)" />
          </StyledContainer>
          
          <StyledButton color="#D84040">
            Submit
          </StyledButton>


        </FormCardsContainer>
      </StyledFormPageContainer>
    </>
  );
};
