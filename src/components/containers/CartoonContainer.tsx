import React from 'react';
import styled from 'styled-components';

interface CartoonContainerProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  solidBorder?: boolean;
}

interface ContainerProps {
  color: string;
  solidBorder?: boolean;
}

const Container = styled.div<ContainerProps>`
  position: ${props => props.className?.includes('navbar-container') ? 'fixed' : 'relative'};
  padding: 2rem;
  background-color: ${props => props.color};
  border: 3px solid #0f1418;
  border-radius: ${props => (props.solidBorder ? "0px" : "10px")};
  box-shadow: 4px 4px 0 0 #0f1418;

  &.navbar-container {
    border-radius: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CartoonContainer: React.FC<CartoonContainerProps> = ({ 
  children, 
  className,
  color = "#FFFFFF",
  solidBorder = false
}) => {
  return (
    <Container
      className={className}
      color={color}
      solidBorder={solidBorder}
    >
      {children}
    </Container>
  );
};

export default CartoonContainer;
