import React from 'react';
import styled from 'styled-components';

interface StarButtonProps {
    isStarred: boolean;
    disabled: boolean;
    onClick: () => void;
    size?: number;
}

const StarContainer = styled.button<{ isStarred: boolean; disabled: boolean }>`
    background: white;
    border: 3px solid black;
    border-radius: 10px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    padding: 5px;
    transition: all 0.1s ease;
    box-shadow: ${props => props.disabled ? 'none' : '4px 4px 0px 0px rgba(0, 0, 0, 1)'};
    position: relative;
    top: ${props => props.disabled ? '4px' : '0px'};
        left: ${props => props.disabled ? '4px' : '0px'};

    &:hover {
        top: ${props => props.disabled ? '4px' : '2px'};
        left: ${props => props.disabled ? '4px' : '2px'};
        box-shadow: ${props => props.disabled ? 'none' : '2px 2px 0px 0px rgba(0, 0, 0, 1)'};
    }

    &:active {
        top: ${props => props.disabled ? '4px' : '4px'};
        left: ${props => props.disabled ? '4px' : '4px'};
        box-shadow: ${props => props.disabled ? 'none' : '0px 0px 0px 0px rgba(0, 0, 0, 1)'};
    }

    opacity: ${props => props.disabled ? 0.5 : 1};
`;

const StarButton: React.FC<StarButtonProps> = ({ isStarred, disabled, onClick, size = 30 }) => {
    const color = disabled ? '#808080' : '#FFD700';

    return (
        <StarContainer 
            onClick={disabled ? undefined : onClick}
            isStarred={isStarred}
            disabled={disabled}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={isStarred ? color : 'none'}
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ alignSelf: 'center', justifySelf: 'center', verticalAlign: 'middle' }}
            >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </StarContainer>
    );
};

export default StarButton; 