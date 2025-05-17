import React from 'react';
import styled from 'styled-components';
import CartoonContainer from '../containers/CartoonContainer';

const SelectionContainer = styled(CartoonContainer)<{ backgroundColor?: string }>`
    display: flex;
    flex-wrap: nowrap;
    gap: 1vmin;
    padding: 1vmin;
    background: ${(props) => props.backgroundColor || 'white'};
    border: 0.4vmin solid black;
    box-shadow: 0.5vmin 0.5vmin 0px 0px rgba(0, 0, 0, 1);
    justify-content: flex-start;
    align-items: center;
    width: fit-content;
    max-width: calc(10vmin * 4 + 1vmin * 3 + 2vmin); /* Width of 4 buttons + gaps + padding */
    margin: 0 auto;
    overflow-x: auto;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const SelectableButton = styled.button<{ isSelected: boolean; selectionColor?: string }>`
    padding: 1vmin 2vmin;
    font-family: 'TT Trick New', serif;
    font-size: 2vmin;
    font-weight: 600;
    background: ${(props) => (props.isSelected ? props.selectionColor || '#CA242B' : 'white')};
    color: ${(props) => (props.isSelected ? 'white' : 'black')};
    border: 0.4vmin solid black;
    border-radius: 1vmin;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: ${(props) =>
        props.isSelected ? '0.5vmin 0.5vmin 0px 0px rgba(0, 0, 0, 1)' : '0.25vmin 0.25vmin 0px 0px rgba(0, 0, 0, 1)'};
    min-width: fit-content;
    width: fit-content;
    flex: 0 0 auto;
    text-align: center;
    white-space: nowrap;

    &:hover {
        box-shadow: ${(props) =>
            props.isSelected
                ? '0.5vmin 0.5vmin 0px 0px rgba(0, 0, 0, 1)'
                : '0.4vmin 0.4vmin 0px 0px rgba(0, 0, 0, 1)'};
    }

    &:active {
        box-shadow: ${(props) =>
            props.isSelected
                ? '0.5vmin 0.5vmin 0px 0px rgba(0, 0, 0, 1)'
                : '0.15vmin 0.15vmin 0px 0px rgba(0, 0, 0, 1)'};
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
    selectionColor,
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
