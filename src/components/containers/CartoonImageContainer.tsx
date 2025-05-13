import React from 'react';
import styled from 'styled-components';

interface CartoonImageContainerProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
    width?: string;
    height?: string;
    onClick?: () => void;
}

interface ContainerProps {
    color: string;
    width?: string;
    height?: string;
}

const Container = styled.div<ContainerProps>`
    position: relative;
    padding: 0.5rem;
    background-color: ${(props) => props.color};
    border: 3px solid #0f1418;
    border-radius: 10px;
    box-shadow: 4px 4px 0 0 #0f1418;
    width: ${(props) => props.width || 'auto'};
    aspect-ratio: 1;
    overflow: hidden;
    transition:
        transform 0.1s ease,
        box-shadow 0.1s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: column;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 7px;
        border: 2px solid #0f1418;
        display: block;
        margin: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`;

const CartoonImageContainer: React.FC<CartoonImageContainerProps> = ({
    children,
    className,
    color = '#FFFFFF',
    width,
    height,
    onClick,
}) => {
    return (
        <Container
            className={className}
            color={color}
            width={width}
            height={height}
            onClick={onClick}
        >
            {children}
        </Container>
    );
};

export default CartoonImageContainer;
