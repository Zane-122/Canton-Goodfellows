import React from 'react';
import styled from 'styled-components';
import CartoonContainer from '../containers/CartoonContainer';

const SelectionContainer = styled(CartoonContainer)<{ backgroundColor?: string }>`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 15px;
  background: ${props => props.backgroundColor || 'white'};
  border: 3px solid black;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
  justify-content: center;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
`;

const SelectableButton = styled.button<{ isSelected: boolean; selectionColor?: string }>`
  padding: 8px 16px;
  font-family: 'TT Trick New', serif;
  font-size: 1em;
  font-weight: 600;
  background: ${props => props.isSelected ? (props.selectionColor || '#CA242B') : 'white'};
  color: ${props => props.isSelected ? 'white' : 'black'};
  border: 3px solid black;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${props => props.isSelected ? '4px 4px 0px 0px rgba(0, 0, 0, 1)' : '2px 2px 0px 0px rgba(0, 0, 0, 1)'};
  min-width: 80px;
  text-align: center;

  &:hover {
    box-shadow: ${props => props.isSelected ? '4px 4px 0px 0px rgba(0, 0, 0, 1)' : '3px 3px 0px 0px rgba(0, 0, 0, 1)'};
  }

  &:active {
    box-shadow: ${props => props.isSelected ? '4px 4px 0px 0px rgba(0, 0, 0, 1)' : '1px 1px 0px 0px rgba(0, 0, 0, 1)'};
  }
`;

interface SelectionFieldProps {
  options: { label: string; value: any }[];
  value: any;
  onChange: (value: any) => void;
  backgroundColor?: string;
  selectionColor?: string;
}

const SelectionField: React.FC<SelectionFieldProps> = ({ 
  options, 
  value, 
  onChange,
  backgroundColor,
  selectionColor 
}) => {
  return (
    <SelectionContainer backgroundColor={backgroundColor}>
      {options.map((option) => (
        <SelectableButton
          key={option.value}
          isSelected={value === option.value}
          onClick={() => onChange(option.value)}
          selectionColor={selectionColor}
        >
          {option.label}
        </SelectableButton>
      ))}
    </SelectionContainer>
  );
};

export default SelectionField; 