import React from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% {
    box-shadow: 0 0 50px #fff, 0 0 100px #fff, 0 0 150px #fff;
  }
  50% {
    box-shadow: 0 0 60px #fff, 0 0 120px #fff, 0 0 180px #fff;
  }
  100% {
    box-shadow: 0 0 50px #fff, 0 0 100px #fff, 0 0 150px #fff;
  }
`;

const MoonContainer = styled.div`
    position: fixed;
    top: 200px;
    right: 50px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #fff;
    animation: ${glow} 3s ease-in-out infinite;
    z-index: 0;
`;

const Moon: React.FC = () => {
    return <MoonContainer />;
};

export default Moon;
