import React, { useState } from 'react';
import styled from 'styled-components';

interface CartoonToggleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: string;
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
}

interface ButtonContainerProps {
  isPressed: boolean;
  color: string;
  isActive: boolean;
}

const ButtonContainer = styled.button<ButtonContainerProps>`
  position: relative;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 900;
  color: rgb(0, 0, 0);
  background-color: ${props => props.color};
  border: 3px solid ${props => props.isActive ? '#4CAF50' : '#FF5252'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.1s ease;
  transform: translateY(${(props: ButtonContainerProps) => (props.isPressed || props.isActive) ? '4px' : '0'});
  box-shadow: ${(props: ButtonContainerProps) => (props.isPressed || props.isActive)
    ? '0 0 0 0 #0f1418' 
    : '4px 4px 0 0 #0f1418'};

  &:hover {
    background-color: ${props => props.color};
    transform: translateY(${(props: ButtonContainerProps) => props.isActive ? '4px' : '2px'});
    box-shadow: ${(props: ButtonContainerProps) => props.isActive 
      ? '0 0 0 0 #0f1418'
      : '2px 2px 0 0 #0f1418'};
  }

  &:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 0 #0f1418;
  }

  &:focus {
    outline: none;
  }
`;

const CartoonToggleButton: React.FC<CartoonToggleButtonProps> = ({ 
  children, 
  onClick, 
  className,
  color = "rgb(0, 0, 0)",
  isActive = false,
  onToggle
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (onToggle) {
      onToggle(!isActive);
    }
    if (onClick) {
      onClick();
    }
  };

  const handleMouseDown = () => {
    if (!isActive) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    if (!isActive) {
      setIsPressed(false);
    }
  };

  return (
    <ButtonContainer
      className={className}
      onClick={handleClick}
      isPressed={isPressed}
      color={color}
      isActive={isActive}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </ButtonContainer>
  );
};

export default CartoonToggleButton; 