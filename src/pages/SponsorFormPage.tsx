import React from 'react';
import styled from 'styled-components';
import FormContainer from '../components/containers/FormContainer';
import Navbar from '../components/Navbar';
import CartoonContainer from '../components/containers/CartoonContainer';

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
  min-height: 100vh;
  width: 100%;
`;

const StyledFormPageTitle = styled.h1`
  font-size: 50px;
  color: rgb(255, 255, 255);
  letter-spacing: 1px;
  margin: 2vmin;
`;

export const SponsorFormPage: React.FC = () => {
  return (
    <StyledFormPageContainer className="sponsor-form-page" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
      <Navbar />
      <StyledContainer color="#D84040" className="sponsor-form-title-container">
        <StyledFormPageTitle className="sponsor-form-title">Sponsor Form</StyledFormPageTitle>
      </StyledContainer>
      <FormContainer title="Phone Number" type="phonenumber" />
      <FormContainer title="Gender Preferences" type="preferences" subtitle="Do you have a preferred gender to be matched with?" />
    </StyledFormPageContainer>
  );
};
