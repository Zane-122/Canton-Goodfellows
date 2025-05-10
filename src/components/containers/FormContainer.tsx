import React, { useState } from 'react';
import CartoonContainer from './CartoonContainer';
import CartoonInput from '../inputs/CartoonInput';
import styled from 'styled-components';
interface FormContainerProps {
  title: string;
  type: string;
  subtitle?: string;
}

const StyledFormCard = styled(CartoonContainer)`
  background-color:rgb(162, 37, 37);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 100vmin;
  width: fit-content;
  height: fit-content;
  margin: 80px;
  color: #fff8e7;
`;
const StyledFormCardTitle = styled.h1`
  font-size: 50px;
  color: #fff8e7;
  letter-spacing: 0.2vmin;
  margin: 0vmin;
`;
const StyledFormCardInput = styled(CartoonInput)`
  text-align: center;
  margin: 500vmin;
`;
const StyledFormCardSubtitle = styled.h2`
  font-size: 20px;
  color: #fff8e7;
  letter-spacing: 0.2vmin;
  margin: 0vmin;
`;

const FormContainer: React.FC<FormContainerProps> = ({ title, type, subtitle }) => {
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

export default FormContainer;