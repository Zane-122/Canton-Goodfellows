import React, { useState } from 'react';
import styled from 'styled-components';

interface CartoonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: string;
}

interface ButtonContainerProps {
  isPressed: boolean;
  color: string;
}

const ButtonContainer = styled.button<ButtonContainerProps>`
  position: relative;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 900;
  color: rgb(0, 0, 0);
  background-color: ${props => props.color};
  border: 3px solid #0f1418;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.1s ease;
  transform: translateY(${(props: ButtonContainerProps) => props.isPressed ? '4px' : '0'});
  box-shadow: ${(props: ButtonContainerProps) => props.isPressed 
    ? '0 0 0 0 #0f1418' 
    : '4px 4px 0 0 #0f1418'};

  &:hover {
    background-color: ${props => props.color};
    transform: translateY(2px);
    box-shadow: 2px 2px 0 0 #0f1418;
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 0 #0f1418;
  }

  &:focus {
    outline: none;
  }
`;

const CartoonButton: React.FC<CartoonButtonProps> = ({ 
  children, 
  onClick, 
  className,
  color = "rgb(0, 0, 0)"
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <ButtonContainer
      className={className}
      onClick={onClick}
      isPressed={isPressed}
      color={color}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </ButtonContainer>
  );
};

export default CartoonButton; 