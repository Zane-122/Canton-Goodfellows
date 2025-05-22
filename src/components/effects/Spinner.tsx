import styled, { keyframes } from "styled-components";

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const bounce = keyframes`
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(180deg); }
`;

const SpinnerComponent = styled.div<{size: number}>`
    width: ${props => props.size}vmin;
    height: ${props => props.size}vmin;
    border: ${props => props.size / 8}vmin solid #000;
    border-top: ${props => props.size / 8}vmin solid transparent;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite, ${bounce} 2s ease-in-out infinite;
    will-change: transform;
    transform: translateZ(0);
`;

export const Spinner = SpinnerComponent;