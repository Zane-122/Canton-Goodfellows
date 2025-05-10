import React from 'react';
import styled from 'styled-components';

interface CartoonHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const HeaderContainer = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #1A1A1A;
  margin: 0;
  padding: 0;
  font-family: 'Coolvetica Rg', sans-serif;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  color: #4A4A4A;
  margin: 0.5rem 0 0 0;
  padding: 0;
  font-family: 'Coolvetica Rg', sans-serif;
`;

const CartoonHeader: React.FC<CartoonHeaderProps> = ({ 
  title, 
  subtitle,
  className 
}) => {
  return (
    <HeaderContainer className={className}>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </HeaderContainer>
  );
};

export default CartoonHeader;
