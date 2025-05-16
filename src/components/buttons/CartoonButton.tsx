import React from 'react';
import styled from 'styled-components';

interface CartoonButtonProps {
    children: React.ReactNode;
    color: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const Button = styled.button<{ color: string }>`
    padding: 10px 20px;
    font-size: 16px;
    background-color: ${(props) => props.color};
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'TT Trick New', serif;
    font-weight: 600;
    border: 3px solid black;
    box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
    transition: all 0.1s ease;

    &:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 1);
    }

    &:active {
        transform: translate(4px, 4px);
        box-shadow: -0px -0px 0px 0px rgba(0, 0, 0, 1);
    }

    &:disabled {
        cursor: not-allowed;
        background-color: #888;
        transform: translate(4px, 4px);
        box-shadow: -0px -0px 0px 0px rgba(0, 0, 0, 1);
    }
`;

const CartoonButton: React.FC<CartoonButtonProps> = ({
    children,
    color,
    onClick,
    disabled,
    className,
    style
}) => {
    return (
        <Button
            color={color}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={style}
        >
            {children}
        </Button>
    );
};

export default CartoonButton;
