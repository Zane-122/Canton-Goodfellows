import React, { useState } from 'react';
import CartoonContainer from './CartoonContainer';
import CartoonInput from '../inputs/CartoonInput';
import styled, { createGlobalStyle } from 'styled-components';

interface FormCardProps {
  title: string;
  type: string;
  subtitle?: string;
}
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

const StyledFormCard = styled(CartoonContainer)`
  background-color:rgb(162, 37, 37);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 70vw;
  width: fit-content;
  height: fit-content;
  color: #fff8e7;
  padding: 2rem;
  gap: 0.5rem;
`;
const StyledFormCardTitle = styled.h1`
  font-size: 50px;
  color: #fff8e7;
  margin: 0;
  font-family: 'TT Trick New', serif;
`;
const StyledFormCardInput = styled(CartoonInput)`
  text-align: center;
  margin: 0;
  margin-top: 2rem;
`;
const StyledFormCardSubtitle = styled.h2`
  font-size: 20px;
  color: #fff8e7;
  margin: 0;
  font-family: 'TT Trick New', serif;
`;

const FormCard: React.FC<FormCardProps> = ({ title, type, subtitle }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const onPhoneNumberChange = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    let formatted = '';
    if (numbers.length > 0) {
      formatted = '(' + numbers.slice(0, 3);
      if (numbers.length > 3) {
        formatted += ') ' + numbers.slice(3, 6);
        if (numbers.length > 6) {
          formatted += '-' + numbers.slice(6, 10);
        }
      }
    }
    setPhoneNumber(formatted);
  };

  return (
    <StyledFormCard className="form-card" color="#D84040">
      <StyledFormCardTitle className="form-card-title">{title}</StyledFormCardTitle>
      {subtitle ? <StyledFormCardSubtitle className="form-card-subtitle">{subtitle}</StyledFormCardSubtitle> : null}
      {type === "phonenumber" ? <StyledFormCardInput value={phoneNumber} onChange={onPhoneNumberChange} /> : null}
    </StyledFormCard>
  );
};

export default FormCard;