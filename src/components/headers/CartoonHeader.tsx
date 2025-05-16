import React from 'react';
import styled from 'styled-components';

interface CartoonHeaderProps {
    title: string;
    subtitle?: string | React.ReactNode;
    className?: string;
    color?: string;
    fontSize?: string;
}

const HeaderContainer = styled.div`
    text-align: center;
`;

interface TitleProps {
    color?: string;
    fontSize?: string;
}
const Title = styled.h1<TitleProps>`
    font-size: ${props => props.fontSize || '4vmin'};
    font-weight: 900;
    color: ${(props) => props.color || '#1A1A1A'};
    margin: 0;
    padding: 0;
    font-family: 'TT Trick New Bold Italic', serif;
`;

interface SubtitleProps {
    color?: string;
}
const Subtitle = styled.h2<SubtitleProps>`
    font-size: 2.5vmin;
    font-weight: 500;
    color: ${(props) => props.color || '#4A4A4A'};
    margin: 0.5rem 0 0 0;
    padding: 0;
    font-family: 'TT Trick New', serif;
    white-space: pre-line;
`;

const CartoonHeader: React.FC<CartoonHeaderProps> = ({ title, subtitle, className, color, fontSize }) => {
    return (
        <HeaderContainer className={className}>
            <Title color={color} fontSize={fontSize}>{title}</Title>
            {subtitle && <Subtitle color={color}>{subtitle}</Subtitle>}
        </HeaderContainer>
    );
};

export default CartoonHeader;
