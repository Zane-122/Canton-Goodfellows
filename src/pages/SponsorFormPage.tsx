import React from 'react';
import styled from 'styled-components';
import FormContainer from '../components/containers/FormContainer';
import Navbar from '../components/Navbar';
import CartoonContainer from '../components/containers/CartoonContainer';
import Snowfall from '../components/effects/Snowfall';

const StyledContainer = styled(CartoonContainer)`
  width: fit-content;
  height: fit-content;
  padding: 0.5rem 2rem;
`;

const StyledFormPageContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 60px;
`;

const StyledFormPageTitle = styled.h1`
  font-size: 50px;
  color: rgb(255, 255, 255);
  letter-spacing: 1px;
  margin: 2vmin;
  padding: 0;
`;

const FormCardsContainer = styled(CartoonContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  height: fit-content;
  padding: 2rem;
  margin-top: 5vmin;
  gap: 3rem;
`;

export const SponsorFormPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Snowfall />
      <StyledFormPageContainer style={{ fontFamily: 'Coolvetica, sans-serif' }}>
        <StyledContainer color="#D84040" className="sponsor-form-title-container">
          <StyledFormPageTitle className="sponsor-form-title">Sponsor Form</StyledFormPageTitle>
        </StyledContainer>
        <FormCardsContainer>
          <FormContainer title="Phone Number" type="phonenumber" subtitle="Please enter the primary phone number we can use to reach you." />
          <FormContainer title="Gender Preferences" type="preferences" subtitle="Do you have a preferred gender to be matched with?" />
        </FormCardsContainer>
      </StyledFormPageContainer>
    </>
  );
};
