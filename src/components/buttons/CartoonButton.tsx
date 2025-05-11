import React, { useState } from 'react';
import styled from 'styled-components';

interface CartoonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: string;
  disabled?: boolean;
}

interface ButtonContainerProps {
  isPressed: boolean;
  color: string;
  disabled?: boolean;
}

const ButtonContainer = styled.button<ButtonContainerProps>`
  position: relative;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 900;
  color: rgb(0, 0, 0);
  background-color: ${props => props.disabled ? "#808080" : props.color};
  border: 3px solid #0f1418;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.1s ease;
  transform: translateY(${(props: ButtonContainerProps) => props.isPressed || props.disabled ? '4px' : '0'});
  box-shadow: ${(props: ButtonContainerProps) => props.isPressed || props.disabled
    ? '0 0 0 0 #0f1418' 
    : '4px 4px 0 0 #0f1418'};

  &:hover {
    background-color: ${props => props.disabled ? "#808080" : props.color}; 
    transform: ${props => props.disabled ? "translateY(4px)" : "translateY(2px)"};
    box-shadow: ${props => props.disabled ? "0 0 0 0 #0f1418" : "2px 2px 0 0 #0f1418"};  
  }

  &:active {
    transform: ${props => props.disabled ? "translateY(4px)" : "translateY(4px)"};
    box-shadow: ${props => props.disabled ? "0 0 0 0 #0f1418" : "0 0 0 0 #0f1418"};
  }

  &:focus {
    outline: none;
  }
`;

const CartoonButton: React.FC<CartoonButtonProps> = ({ 
  children, 
  onClick, 
  className,
  color = "rgb(0, 0, 0)",
  disabled = false
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
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </ButtonContainer>
  );
};

export default CartoonButton; 