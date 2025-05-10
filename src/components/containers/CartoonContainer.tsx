import React from 'react';
import styled from 'styled-components';

interface CartoonContainerProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

interface ContainerProps {
  color: string;
}

const Container = styled.div<ContainerProps>`
  position: relative;
  padding: 2rem;
  background-color: ${props => props.color};
  border: 3px solid #0f1418;
  border-radius: 10px;
  box-shadow: 4px 4px 0 0 #0f1418;
`;

const CartoonContainer: React.FC<CartoonContainerProps> = ({ 
  children, 
  className,
  color = "#FFFFFF"
}) => {
  return (
    <Container
      className={className}
      color={color}
    >
      {children}
    </Container>
  );
};

export default CartoonContainer;
