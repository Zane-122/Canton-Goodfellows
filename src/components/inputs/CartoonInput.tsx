import React from 'react';
import styled from 'styled-components';
import { Spinner } from '../../components/effects/Spinner';

interface CartoonInputProps {
    color?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    type?: string;
    disabled?: boolean;
    loading?: boolean;
}

const InputContainer = styled.div`
    position: relative;
    width: 30vmin;
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input<{ color: string; disabled: boolean }>`
    width: 100%;
    background-color: ${props => props.color};
    border: 0.4vmin solid #000;
    border-radius: 1vmin;
    padding: 1.2vmin 1.8vmin;
    font-size: 2vmin;
    font-family: 'TT Trick New', serif;
    font-weight: normal;
    outline: none;
    box-shadow: ${props => props.disabled ? 'none' : '0.5vmin 0.5vmin 0 #000'};
    transform: ${props => props.disabled ? 'translate(0.2vmin, 0.2vmin)' : 'none'};
    transition: all 0.2s ease;
    text-align: center;
    opacity: ${props => props.disabled ? 0.7 : 1};
    cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

    &:focus {
        transform: translate(0.2vmin, 0.2vmin);
        box-shadow: 0.3vmin 0.3vmin 0 #000;
    }
`;

const LoadingContainer = styled.div`
    position: absolute;
    right: 2vmin;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

const CartoonInput: React.FC<CartoonInputProps> = ({
    color = '#F5F5F5',
    placeholder = 'Enter text...',
    value,
    onChange,
    className,
    type = 'text',
    disabled = false,
    loading = false,
}) => {
    return (
        <InputContainer>
            <StyledInput
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={ placeholder }
                className={ className }
                disabled={disabled || loading}
                color={color}
            />
            {loading && (
                <LoadingContainer>
                    <Spinner size={1.5} />
                </LoadingContainer>
            )}
        </InputContainer>
    );
};

export default CartoonInput;
