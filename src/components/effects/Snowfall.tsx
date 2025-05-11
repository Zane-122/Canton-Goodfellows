import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const snowfall = keyframes`
  0% {
    transform: translateY(-100vh) translateX(0) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) translateX(100px) rotate(360deg);
  }
`;

const Snowflake = styled.div<{ size: number; delay: number; duration: number }>`
  position: fixed;
  top: -10px;
  left: ${props => Math.random() * 100}vw;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  animation: ${snowfall} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: -1;
`;

const SnowfallContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
`;

const Snowfall: React.FC = () => {
  const snowflakes = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      size: Math.random() * 12 + 4,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    })), 
    [] // Empty dependency array means this only runs once
  );

  return (
    <SnowfallContainer>
      {snowflakes.map(snowflake => (
        <Snowflake
          key={snowflake.id}
          size={snowflake.size}
          delay={snowflake.delay}
          duration={snowflake.duration}
        />
      ))}
    </SnowfallContainer>
  );
};

export default Snowfall; 